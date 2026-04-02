"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { FinancialRecord, RecordType, RecordsListResult } from "@/types";

export type RecordsFilters = {
  type?: RecordType;
  category?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
};

export function useRecords(filters: RecordsFilters) {
  return useQuery({
    queryKey: ["records", "list", filters],
    queryFn: async () => {
      const res = await api.get<RecordsListResult>("/api/records", {
        params: {
          type: filters.type,
          category: filters.category,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: filters.page,
          limit: filters.limit,
        },
      });
      return res.data;
    },
  });
}

export function useCreateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      userId: string;
      amount: number;
      type: RecordType;
      category: string;
      date: string;
      notes?: string | null;
    }) => {
      const res = await api.post<{ data: FinancialRecord }>("/api/records", input);
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["records"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<{ data: FinancialRecord }>(`/api/records/${id}`);
      return res.data.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["records"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

