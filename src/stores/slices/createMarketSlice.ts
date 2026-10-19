import { StateCreator } from "zustand";
import { GameState, TransferOffer } from "../../types/state";
import {
  evaluateTransferProposal,
  makeTransfer,
  processAITransfers,
  generateOffer,
} from "../../gameEngine/market";
import { toast } from "../useToastStore";
import type { GameStore, MarketActions } from "../types";

export const createMarketSlice: StateCreator<
  GameStore,
  [["zustand/immer", never]],
  [],
  MarketActions
> = (set, get) => ({
  acceptOffer: (index) => {
    const offer = get().notifications[index];
    if (!offer) return;
    let result: ReturnType<typeof evaluateTransferProposal> = {
      status: "rejected",
      message: "A oferta expirou ou não pôde ser processada.",
      clubAccepted: false,
      playerAccepted: false,
    };
    set((gameState) => {
      const draft = gameState as unknown as GameState;
      if (
        !offer.expiresAt ||
        offer.expiresAt < draft.currentDate ||
        !offer.contractOffer
      ) {
        result.message = "A oferta expirou.";
        gameState.notifications.splice(index, 1);
        return;
      }
      result = evaluateTransferProposal({
        draft,
        buyerTeamId: offer.buyerTeamId,
        proposal: {
          playerId: offer.playerId,
          sellerTeamId: offer.sellerTeamId,
          transferFee: offer.value,
          contractOffer: offer.contractOffer,
        },
      });
      gameState.notifications.splice(index, 1);
    });
    toast({
      message: result.message,
      type: result.status === "accepted" ? "ok" : "info",
    });
  },

  rejectOffer: (index) => {
    set((gameState) => {
      gameState.notifications.splice(index, 1);
    });
  },

  sellPlayer: (playerId) => {
    const state = get();
    const userTeam = state.teams[state.userTeamId!];
    if (!userTeam) return;

    if (userTeam.squad.playerIds.length <= 11) {
      toast({ message: "Elenco muito pequeno para vender!", type: "error" });
      return;
    }

    const player = state.players[playerId];
    if (!player) {
      toast({
        message: "Erro! Jogador não encontrado no elenco.",
        type: "error",
      });
      return;
    }

    get().makeTransfer({
      buyerTeamId: null,
      sellerTeamId: state.userTeamId,
      playerId,
      value: player.value,
    });
  },

  makeTransfer: (transferOffer) =>
    set((gameState) => {
      try {
        const message = makeTransfer({
          draft: gameState as unknown as GameState,
          transferOffer,
        });
        if (message) toast({ message, type: "ok" });
      } catch (error: any) {
        toast({ message: error.message, type: "error" });
      }
    }),

  generateOffer: () => {
    const { teams, userTeamId, notifications, players, currentDate } = get();
    const newOffer = generateOffer({
      teams: Object.values(teams),
      players,
      userTeamId,
      currentCount: notifications.length,
      currentDate,
    });

    if (newOffer) {
      set((gameState) => {
        gameState.notifications.push(newOffer);
      });
      toast({ message: "New transfer offer received!", type: "info" });
    }
  },

  aiManageMarket: () => {
    set((gameState) => {
      processAITransfers(gameState as unknown as GameState);
    });
  },

  submitTransferProposal: (proposal) => {
    const buyerTeamId = get().userTeamId;
    if (!buyerTeamId) {
      return {
        status: "rejected",
        message: "Nenhum clube controlado pelo usuário está selecionado.",
        clubAccepted: false,
        playerAccepted: false,
      };
    }

    let result = {
      status: "rejected",
      message: "A proposta não pôde ser processada.",
      clubAccepted: false,
      playerAccepted: false,
    } as ReturnType<typeof evaluateTransferProposal>;
    set((gameState) => {
      result = evaluateTransferProposal({
        draft: gameState as unknown as GameState,
        buyerTeamId,
        proposal,
      });
    });
    toast({
      message: result.message,
      type: result.status === "accepted" ? "ok" : "info",
    });
    return result;
  },
});
