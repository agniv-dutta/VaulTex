"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AuthResponse } from "@/types";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const res = await api.post<AuthResponse>("/api/auth/login", input);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth({ token: data.token, user: data.user });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: { name: string; email: string; password: string }) => {
      const res = await api.post<AuthResponse>("/api/auth/register", input);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth({ token: data.token, user: data.user });
    },
  });
}

