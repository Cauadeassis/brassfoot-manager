import { StateCreator } from "zustand";
import { organizeSquad } from "../../gameEngine/tactics";
import POSITIONS_DATA from "../../data/positions";
import FORMATIONS from "../../data/formations";
import { formatMoney, getRandom } from "../../utils";
import { GameStore, MarketActions } from "../useGameStore";
import { toast } from "../useToastStore";
import { Player } from "../../types";
import { Position } from "../../types";
export const createMarketSlice: StateCreator<
  GameStore,
  [["zustand/immer", never]],
  [],
  MarketActions
> = (set, get) => ({
  acceptOffer: (index) => {
    const state = get();
    const offer = state.notifications[index];
    if (!offer) return;
    get().makeTransaction({
      buyerTeamId: offer.buyerTeamId,
      sellerTeamId: offer.sellerTeamId,
      playerId: offer.playerId,
      value: offer.value,
    });
    set((draft) => {
      draft.notifications.splice(index, 1);
    });
  },

  rejectOffer: (index) => {
    set((draft) => {
      draft.notifications.splice(index, 1);
    });
  },

  sellPlayer: (playerId) => {
    const state = get();
    const userTeam = state.teams.find((t) => t.id === state.userTeamId);

    if (!userTeam) return;

    if (userTeam.squad.length <= 11) {
      toast({ message: "Elenco muito pequeno para vender!", type: "error" });
      return;
    }

    const player = userTeam.squad.find((p) => p.id === playerId);
    if (!player) {
      toast({
        message: "Erro! Jogador não encontrado no elenco.",
        type: "error",
      });
      return;
    }

    get().makeTransaction({
      buyerTeamId: null,
      sellerTeamId: state.userTeamId,
      playerId,
      value: player.value,
    });
  },

  makeTransaction: (transaction) =>
    set((draft) => {
      const { buyerTeamId, sellerTeamId, playerId, value } = transaction;

      const buyer =
        buyerTeamId !== null
          ? draft.teams.find((t) => t.id === buyerTeamId)
          : null;

      const seller =
        sellerTeamId !== null
          ? draft.teams.find((t) => t.id === sellerTeamId)
          : null;

      if (!buyer && !seller) {
        toast({ message: "Erro! Sem origem e destino.", type: "error" });
        return;
      }

      const sourceSquad = seller ? seller.squad : draft.freeAgents;
      const playerIndex = sourceSquad.findIndex((p) => p.id === playerId);

      if (playerIndex === -1) {
        toast({ message: "Jogador não encontrado na origem!", type: "error" });
        return;
      }

      const player = sourceSquad[playerIndex];

      if (buyer && buyer.money < value) {
        if (buyerTeamId === draft.userTeamId) {
          toast({ message: "Saldo insuficiente!", type: "error" });
        }
        return;
      }
      if (seller) {
        seller.squad.splice(playerIndex, 1);
        seller.startersId = organizeSquad({
          squad: seller.squad,
          positions: FORMATIONS[seller.tactics.formation].positions,
        });
        seller.money += value;
      } else {
        draft.freeAgents.splice(playerIndex, 1);
      }

      const clonedPlayer = { ...player };

      if (buyerTeamId === draft.userTeamId && !seller) {
        clonedPlayer.statistics = {
          goals: 0,
          redCards: 0,
          assistance: 0,
          yellowCards: 0,
          matchesPlayed: 0,
        };
      }
      if (buyer) {
        buyer.squad.push(clonedPlayer);
        buyer.startersId = organizeSquad({
          squad: buyer.squad,
          positions: FORMATIONS[buyer.tactics.formation].positions,
        });
        buyer.money -= value;
      } else {
        draft.freeAgents.push(clonedPlayer);
      }

      const stateKey = `${seller ? "team" : "free"}_to_${buyer ? "team" : "free"}`;
      const txTypeMap: Record<string, string> = {
        team_to_team: "transfer",
        free_to_team: "signing",
        team_to_free: "release",
      };

      const messages: Record<string, string> = {
        transfer: `${clonedPlayer.name} do ${seller?.name} foi vendido por ${formatMoney(value)} para o ${buyer?.name}!`,
        signing: `${clonedPlayer.name} contratado do mercado livre pelo ${buyer?.name} por ${formatMoney(value)}!`,
        release: `${clonedPlayer.name} foi dispensado pelo ${seller?.name} e agora está livre no mercado.`,
      };

      toast({ message: messages[txTypeMap[stateKey]], type: "ok" });
    }),

  generateOffers: () => {
    const state = get();

    if (state.notifications.length >= 3) return;

    const userTeam = state.teams.find((t) => t.id === state.userTeamId);
    if (!userTeam) return;
    const buyablePlayers = userTeam.squad.filter(
      (player) => player.overall >= 72,
    );
    if (!buyablePlayers.length || Math.random() >= 0.4) return;

    const targetPlayer = getRandom({ array: buyablePlayers });
    const otherTeams = state.teams.filter(
      (team) => team.id !== state.userTeamId,
    );
    if (!otherTeams.length) return;

    const buyerTeam = getRandom({ array: otherTeams });
    const value = Math.floor(targetPlayer.value * (1.1 + Math.random() * 0.5));

    set((draft) => {
      draft.notifications.push({
        playerId: targetPlayer.id,
        value,
        sellerTeamId: userTeam.id,
        buyerTeamId: buyerTeam.id,
        text: `${buyerTeam.name} offers ${formatMoney(value)} for ${targetPlayer.name}`,
      });
    });

    toast({ message: "New transfer offer received!", type: "info" });
  },

  aiManageMarket: () => {
    const initialTeams = get().teams;

    initialTeams.forEach((team) => {
      if (team.id === get().userTeamId) return;

      const squad = team.squad;
      if (squad.length > 22) {
        const positionGroups: Partial<Record<string, Player[]>> = {};

        squad.forEach((player) => {
          if (!positionGroups[player.position])
            positionGroups[player.position] = [];
          positionGroups[player.position]?.push(player);
        });

        const surplusPlayers: Player[] = [];

        Object.entries(positionGroups).forEach(([position, players]) => {
          const limit = POSITIONS_DATA[position as Position]?.max || 2;
          if (players && players.length > limit) {
            const sortedByQuality = [...players].sort(
              (a, b) => b.overall - a.overall,
            );
            const surplus = sortedByQuality.slice(limit);
            surplusPlayers.push(...surplus);
          }
        });

        if (surplusPlayers.length > 0) {
          surplusPlayers.sort((a, b) => a.overall - b.overall);
          const playerToSell = surplusPlayers[0];
          get().makeTransaction({
            playerId: playerToSell.id,
            value: playerToSell.value,
            buyerTeamId: null,
            sellerTeamId: team.id,
          });
        }
      }

      const updatedState = get();
      const updatedTeam = updatedState.teams.find((t) => t.id === team.id);
      if (!updatedTeam) return;

      if (
        updatedTeam.squad.length < 18 &&
        updatedState.freeAgents.length > 0 &&
        updatedTeam.money > 2_000_000
      ) {
        const freeAgent = updatedState.freeAgents.find(
          (player) => player.value <= updatedTeam.money * 0.5,
        );

        if (freeAgent) {
          get().makeTransaction({
            playerId: freeAgent.id,
            value: freeAgent.value,
            buyerTeamId: updatedTeam.id,
            sellerTeamId: null,
          });
        }
      }
    });
  },
});
