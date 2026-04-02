"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  CategoryBreakdownItem,
  DashboardSummary,
  MonthlyBreakdownItem,
} from "@/types";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const res = await api.get<{ data: DashboardSummary }>("/api/dashboard/summary");
      return res.data.data;
    },
  });
}

export function useDashboardByCategory() {
  return useQuery({
    queryKey: ["dashboard", "by-category"],
    queryFn: async () => {
      const res = await api.get<{ data: CategoryBreakdownItem[] }>(
        "/api/dashboard/by-category"
      );
      return res.data.data;
    },
  });
}

export function useDashboardMonthly() {
  return useQuery({
    queryKey: ["dashboard", "monthly"],
    queryFn: async () => {
      const res = await api.get<{ data: MonthlyBreakdownItem[] }>(
        "/api/dashboard/monthly"
      );
      return res.data.data;
    },
  });
}

