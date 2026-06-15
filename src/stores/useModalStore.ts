import { create } from "zustand";

export interface ModalProps {
  name: string;
  shield: string;
  description: string;
  onConfirm: () => void;
}

interface ModalStore {
  isOpen: boolean;
  name: string;
  shield: string;
  description: string;
  onConfirm: () => void;
  openModal: (data: ModalProps) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  name: "",
  shield: "",
  description: "",
  onConfirm: () => {},
  openModal: (data) =>
    set({
      isOpen: true,
      name: data.name,
      shield: data.shield,
      description: data.description,
      onConfirm: data.onConfirm,
    }),
  closeModal: () => set({ isOpen: false }),
}));
