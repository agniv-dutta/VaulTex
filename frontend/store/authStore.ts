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
      "vaultex_token=; Path=/; Max-Age=0; SameSite=Lax; Secure=";
    return;
  }
  // Secure= will be ignored on http://localhost which is fine.
  document.cookie = `vaultex_token=${encodeURIComponent(
    token
  )}; Path=/; SameSite=Lax; Secure=`;
}

function syncAuthStorage(input: { token: string; user: User } | null) {
  if (typeof window === "undefined") return;
  if (!input) {
    localStorage.removeItem("vaultex_token");
    localStorage.removeItem("vaultex_user");
    return;
  }
  localStorage.setItem("vaultex_token", input.token);
  localStorage.setItem("vaultex_user", JSON.stringify(input.user));
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
        syncAuthStorage({ token, user });
        set({ token, user, role: user.role });
      },
      clearAuth: () => {
        setTokenCookie(null);
        syncAuthStorage(null);
        set({ token: null, user: null, role: null });
      },
      markHydrated: () => {
        if (get().isHydrated) return;
        set({ isHydrated: true });
      },
    }),
    {
      name: "vaultex_auth",
      partialize: (s) => ({ token: s.token, user: s.user, role: s.role }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

