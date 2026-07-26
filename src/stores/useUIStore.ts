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

interface UIState extends MatchModal, CardModal, MenuModal {
  closeAllModals: () => void;
}

const initialState = {
  activeMatch: null,
  isCardModalOpen: false,
  cardModalData: null,
  isMenuModalOpen: false,
};

const useUIStore = create<UIState>((set) => ({
  ...initialState,
  openMatchModal: (match) => set({ activeMatch: match }),
  closeMatchModal: () => set({ activeMatch: null }),
  openCardModal: (data) => set({ isCardModalOpen: true, cardModalData: data }),
  closeCardModal: () => set({ isCardModalOpen: false, cardModalData: null }),
  openMenuModal: () => set({ isMenuModalOpen: true }),
  closeMenuModal: () => set({ isMenuModalOpen: false }),
  closeAllModals: () => set(initialState),
}));

export default useUIStore;
