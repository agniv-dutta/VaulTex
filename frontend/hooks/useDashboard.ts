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
      const res = await api.get<DashboardSummary | { data: DashboardSummary }>(
        "/api/dashboard/summary"
      );
      const payload = res.data;
      return "data" in payload ? payload.data : payload;
    },
    refetchOnMount: true,
  });
}

export function useDashboardByCategory() {
  return useQuery({
    queryKey: ["dashboard", "by-category"],
    queryFn: async () => {
      const res = await api.get<CategoryBreakdownItem[] | { data: CategoryBreakdownItem[] }>(
        "/api/dashboard/by-category"
      );
      const payload = res.data;
      return "data" in payload ? payload.data : payload;
    },
    refetchOnMount: true,
  });
}

export function useDashboardMonthly() {
  return useQuery({
    queryKey: ["dashboard", "monthly"],
    queryFn: async () => {
      const res = await api.get<MonthlyBreakdownItem[] | { data: MonthlyBreakdownItem[] }>(
        "/api/dashboard/monthly"
      );
      const payload = res.data;
      return "data" in payload ? payload.data : payload;
    },
    refetchOnMount: true,
  });
}

