import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/types";

type AuthState = {
  token: string | null;
  user: User | null;
  role: Role | null;
  isHydrated: boolean;
};

type AuthActions = {
  setAuth: (input: { token: string; user: User }) => void;
  clearAuth: () => void;
  markHydrated: () => void;
};

function setTokenCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (!token) {
    document.cookie =
      "finledger_token=; Path=/; Max-Age=0; SameSite=Lax; Secure=";
    return;
  }
  // Secure= will be ignored on http://localhost which is fine.
  document.cookie = `finledger_token=${encodeURIComponent(
    token
  )}; Path=/; SameSite=Lax; Secure=`;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      role: null,
      isHydrated: false,
      setAuth: ({ token, user }) => {
        setTokenCookie(token);
        set({ token, user, role: user.role });
      },
      clearAuth: () => {
        setTokenCookie(null);
        set({ token: null, user: null, role: null });
      },
      markHydrated: () => {
        if (get().isHydrated) return;
        set({ isHydrated: true });
      },
    }),
    {
      name: "finledger_auth",
      partialize: (s) => ({ token: s.token, user: s.user, role: s.role }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

