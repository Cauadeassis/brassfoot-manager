import { GameState, TransferOffer } from "../types/state";
import { Team } from "../types/team";
import { Player } from "../types/player";
import { getRandom, formatMoney } from "../utils";
import getPositionsData from "./generators/positions";
import { Position } from "../types/player";
import { TransferError } from "../errors";

interface MakeTransferProps {
  draft: GameState;
  transferOffer: TransferOffer;
}

interface GenerateTransferMessageProps {
  player: Player;
  value: number;
  buyer?: Team | null;
  seller?: Team | null;
}

const generateTransferMessage = ({
  player,
  value,
  buyer,
  seller,
}: GenerateTransferMessageProps) => {
  const stateKey = `${seller ? "team" : "free"}_to_${buyer ? "team" : "free"}`;
  const messages: Record<string, string> = {
    team_to_team: `${player.name} do ${seller?.name} foi vendido por ${formatMoney(value)} para o ${buyer?.name}!`,
    free_to_team: `${player.name} contratado do mercado livre pelo ${buyer?.name} por ${formatMoney(value)}!`,
    team_to_free: `${player.name} foi dispensado pelo ${seller?.name} e agora está livre no mercado.`,
  };
  return messages[stateKey];
};

export const makeTransfer = ({
  draft,
  transferOffer,
}: MakeTransferProps): string | null => {
  const { buyerTeamId, sellerTeamId, playerId, value } = transferOffer;
  if (!buyerTeamId && !sellerTeamId)
    throw TransferError.missingBuyerAndSeller();
  const buyer = buyerTeamId ? draft.teams[buyerTeamId] : null;
  const seller = sellerTeamId ? draft.teams[sellerTeamId] : null;
  const player = draft.players[playerId];
  if (!player) throw new Error("Jogador não encontrado na base de dados!");
  if (!seller && player.currentTeamId !== null) {
    throw TransferError.invalidPlayer(player.name);
  }
  let playerIndex = -1;
  if (seller) {
    playerIndex = seller.squad.playerIds.findIndex(
      (id: string) => id === playerId,
    );
    if (playerIndex === -1) throw TransferError.playerNotFound(player.name);
  }

  if (buyer && buyer.money < value) {
    if (buyerTeamId === draft.userTeamId) throw TransferError.missingMoney();
    return null;
  }
  if (seller) {
    seller.squad.playerIds.splice(playerIndex, 1);
  }
  if (buyer) {
    buyer.money -= value;
    buyer.squad.playerIds.push(playerId);
    player.currentTeamId = buyer.id;
  } else {
    player.currentTeamId = null;
  }

  if (seller) seller.money += value;

  return generateTransferMessage({ player, value, buyer, seller });
};

export const processAITransfers = (gameState: GameState): void => {
  const teamsList = Object.values(gameState.teams);
  const POSITIONS_DATA = getPositionsData(gameState.modality!);
  const freeAgents = Object.values(gameState.players).filter(
    (p) => p.currentTeamId === null,
  );
  teamsList.forEach((team) => {
    if (team.id === gameState.userTeamId) return;
    if (team.squad.playerIds.length > 22) {
      const positionGroups: Record<string, Player[]> = {};
      team.squad.playerIds.forEach((id: string) => {
        const player = gameState.players[id];
        if (!player) return;
        if (!positionGroups[player.position])
          positionGroups[player.position] = [];
        positionGroups[player.position].push(player);
      });

      const surplusPlayers: Player[] = [];
      Object.entries(positionGroups).forEach(([position, players]) => {
        const limit = POSITIONS_DATA[position as Position]?.max || 2;
        if (players.length > limit) {
          const sortedByQuality = [...players].sort(
            (a, b) => b.overall - a.overall,
          );
          surplusPlayers.push(...sortedByQuality.slice(limit));
        }
      });

      if (surplusPlayers.length > 0) {
        surplusPlayers.sort((a, b) => a.overall - b.overall);
        const playerToSell = surplusPlayers[0];

        makeTransfer({
          draft: gameState,
          transferOffer: {
            playerId: playerToSell.id,
            value: playerToSell.value,
            buyerTeamId: null,
            sellerTeamId: team.id,
          },
        });
      }
    }
    if (
      team.squad.playerIds.length < 18 &&
      freeAgents.length > 0 &&
      team.money > 2_000_000
    ) {
      const affordableFreeAgent = freeAgents.find(
        (p) => p.value <= team.money * 0.5,
      );

      if (affordableFreeAgent) {
        makeTransfer({
          draft: gameState,
          transferOffer: {
            playerId: affordableFreeAgent.id,
            value: affordableFreeAgent.value,
            buyerTeamId: team.id,
            sellerTeamId: null,
          },
        });
        const agentIndex = freeAgents.findIndex(
          (p) => p.id === affordableFreeAgent.id,
        );
        if (agentIndex > -1) freeAgents.splice(agentIndex, 1);
      }
    }
  });
};

interface GenerateOfferProps {
  teams: Team[];
  players: Record<string, Player>;
  userTeamId: string | null;
  currentCount: number;
}

export const generateOffer = ({
  teams,
  players,
  userTeamId,
  currentCount,
}: GenerateOfferProps) => {
  if (currentCount >= 3 || !userTeamId) return null;
  const userTeam = teams.find((team) => team.id === userTeamId);
  if (!userTeam) return null;
  const buyablePlayers = userTeam.squad.playerIds
    .map((id) => players[id])
    .filter((player) => player && player.overall >= 72);
  if (!buyablePlayers.length || Math.random() >= 0.4) return null;
  const targetPlayer = getRandom({ array: buyablePlayers });
  const otherTeams = teams.filter((team) => team.id !== userTeamId);
  if (!otherTeams.length) return null;
  const buyerTeam = getRandom({ array: otherTeams });
  const value = Math.floor(targetPlayer.value * (1.1 + Math.random() * 0.5));
  return {
    playerId: targetPlayer.id,
    value,
    sellerTeamId: userTeam.id,
    buyerTeamId: buyerTeam.id,
    text: `${buyerTeam.name} offers ${formatMoney(value)} for ${targetPlayer.name}`,
  };
};
