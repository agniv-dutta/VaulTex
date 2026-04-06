"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthRehydrate() {
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) return;
    document.cookie = `vaultex_token=${encodeURIComponent(
      token
    )}; Path=/; SameSite=Lax; Secure=`;
  }, [token, isHydrated]);

  return null;
}

