import { create } from "zustand";
import { Match } from "../types/match";
import { Trophies } from "../types/competition";
import { QuantityVariation } from "../filters/labels";

export interface CardModalProps {
  name: string;
  shield?: string;
  icon?: string;
  description: string;
  trophies?: Trophies;
  onConfirm: () => void;
  canCancel?: boolean;
}

interface MatchModal {
  activeMatch: Match | null;
  openMatchModal: (match: Match) => void;
  closeMatchModal: () => void;
}

interface CardModal {
  isCardModalOpen: boolean;
  cardModalData: CardModalProps[] | null;
  openCardModal: (data: CardModalProps[]) => void;
  closeCardModal: () => void;
}

interface MenuModal {
  isMenuModalOpen: boolean;
  openMenuModal: () => void;
  closeMenuModal: () => void;
}

interface ScoutModal {
  activeScoutTeamId: string | null;
  openScoutModal: (teamId: string) => void;
  closeScoutModal: () => void;
}

interface PlayerModal {
  activePlayerId: string | null;
  openPlayerModal: (playerId: string) => void;
  closePlayerModal: () => void;
}

interface UIState
  extends MatchModal, CardModal, MenuModal, ScoutModal, PlayerModal {
  closeAllModals: () => void;
}

const initialState = {
  activeMatch: null,
  isCardModalOpen: false,
  cardModalData: null,
  isMenuModalOpen: false,
  activeScoutTeamId: null,
  activePlayerId: null,
};

const useUIStore = create<UIState>((set) => ({
  ...initialState,
  openMatchModal: (match) => set({ activeMatch: match }),
  closeMatchModal: () => set({ activeMatch: null }),
  openCardModal: (data) => set({ isCardModalOpen: true, cardModalData: data }),
  closeCardModal: () => set({ isCardModalOpen: false, cardModalData: null }),
  openMenuModal: () => set({ isMenuModalOpen: true }),
  closeMenuModal: () => set({ isMenuModalOpen: false }),
  openScoutModal: (teamId) => set({ activeScoutTeamId: teamId }),
  closeScoutModal: () => set({ activeScoutTeamId: null }),
  openPlayerModal: (playerId) => set({ activePlayerId: playerId }),
  closePlayerModal: () => set({ activePlayerId: null }),
  closeAllModals: () => set(initialState),
}));

export default useUIStore;
