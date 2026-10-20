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
      pendingPlayerIds: notifications
        .filter((offer) => offer.sellerTeamId === userTeamId)
        .map((offer) => offer.playerId),
      currentDate,
    });

    if (newOffer) {
      set((gameState) => {
        gameState.notifications.push(newOffer);
      });
      toast({
        message: "Nova proposta de transferência recebida.",
        type: "info",
      });
    }
  },

  aiManageMarket: () => {
    set((gameState) => {
      processAITransfers(gameState as unknown as GameState);
    });
  },

  toggleTransferListing: (playerId) => {
    const { players, userTeamId } = get();
    const player = players[playerId];
    const userTeam = userTeamId ? get().teams[userTeamId] : undefined;
    if (
      !userTeamId ||
      userTeam?.type !== "club" ||
      !player ||
      player.currentTeamId !== userTeamId
    ) {
      toast({
        message: "Só é possível alterar o mercado de jogadores do seu clube.",
        type: "error",
      });
      return;
    }

    set((gameState) => {
      const current = gameState.players[playerId].market ?? {
        isTransferListed: false,
      };
      gameState.players[playerId].market = {
        isTransferListed: !current.isTransferListed,
      };
    });
    toast({
      message: player.market?.isTransferListed
        ? "Jogador removido da lista de transferências."
        : "Jogador listado para transferência.",
      type: "ok",
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
