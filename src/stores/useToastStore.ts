import { create } from "zustand";

export interface ToastItem {
  id: string;
  message: string;
  type: "ok" | "error" | "info";
}

export interface ToastState {
  toasts: ToastItem[];
  addToast: (message: string, type: "ok" | "error" | "info") => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3500);
  },
}));
export default useToastStore;

export function toast({
  message,
  type,
}: {
  message: string;
  type: "ok" | "error" | "info";
}): void {
  useToastStore.getState().addToast(message, type);
}
