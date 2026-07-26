import { create } from "zustand";

export interface ToastItem {
  id: string;
  message: string;
  type: "ok" | "error" | "info";
}

export interface ToastState {
  toasts: ToastItem[];
  addToast: ({ message, type }: ToastProps) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: ({ message, type }) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3500);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
export default useToastStore;

interface ToastProps {
  message: string;
  type: "ok" | "error" | "info";
}

export function toast({ message, type }: ToastProps): void {
  useToastStore.getState().addToast({ message, type });
}
