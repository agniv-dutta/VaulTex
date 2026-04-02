"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Role, User } from "@/types";

export function useUsers() {
  return useQuery({
    queryKey: ["users", "list"],
    queryFn: async () => {
      const res = await api.get<{ data: User[] }>("/api/users");
      return res.data.data;
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; role: Role }) => {
      const res = await api.patch<{ data: User }>(`/api/users/${input.id}/role`, {
        role: input.role,
      });
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

