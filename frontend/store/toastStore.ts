import { create } from "zustand";

export type ToastTone = "success" | "danger" | "info";

export type ToastState = {
  open: boolean;
  message: string;
  tone: ToastTone;
};

type ToastActions = {
  show: (input: { message: string; tone?: ToastTone; timeoutMs?: number }) => void;
  hide: () => void;
};

let toastTimer: number | null = null;

export const useToastStore = create<ToastState & ToastActions>((set, get) => ({
  open: false,
  message: "",
  tone: "info",
  show: ({ message, tone = "info", timeoutMs = 2400 }) => {
    set({ open: true, message, tone });
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => set({ open: false }), timeoutMs);
  },
  hide: () => set({ open: false }),
}));

