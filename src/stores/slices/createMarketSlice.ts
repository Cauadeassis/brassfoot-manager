import { StateCreator } from "zustand";
import { GameState, TransferOffer } from "../../types/state";
import {
  makeTransfer,
  processAITransfers,
  generateOffer,
} from "../../gameEngine/market";
import { toast } from "../useToastStore";
import { GameStore } from "../useGameStore";

export interface MarketActions {
  acceptOffer: (index: number) => void;
  rejectOffer: (index: number) => void;
  sellPlayer: (playerId: string) => void;
  makeTransfer: (transfer: TransferOffer) => void;
  generateOffer: () => void;
  aiManageMarket: () => void;
}

export const createMarketSlice: StateCreator<
  GameStore,
  [["zustand/immer", never]],
  [],
  MarketActions
> = (set, get) => ({
  acceptOffer: (index) => {
    const offer = get().notifications[index];
    if (!offer) return;

    get().makeTransfer({
      buyerTeamId: offer.buyerTeamId,
      sellerTeamId: offer.sellerTeamId,
      playerId: offer.playerId,
      value: offer.value,
    });

    set((gameState) => {
      gameState.notifications.splice(index, 1);
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
    const { teams, userTeamId, notifications, players } = get();
    const newOffer = generateOffer({
      teams: Object.values(teams),
      players,
      userTeamId,
      currentCount: notifications.length,
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
});
