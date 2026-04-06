"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LCDNumber } from "@/components/ui/LCDNumber";
import {
  useDashboardByCategory,
  useDashboardMonthly,
  useDashboardSummary,
} from "@/hooks/useDashboard";
import { IncomeExpenseBar } from "@/components/charts/IncomeExpenseBar";
import { CategoryPie } from "@/components/charts/CategoryPie";
import { MonthlyLine } from "@/components/charts/MonthlyLine";
import { buildDashboardDemoData } from "@/lib/dashboardDemoData";

export default function DashboardPage() {
  const summary = useDashboardSummary();
  const byCategory = useDashboardByCategory();
  const monthly = useDashboardMonthly();
  const demoData = useMemo(() => buildDashboardDemoData(), []);

  const isLoading = summary.isLoading || byCategory.isLoading || monthly.isLoading;
  const hasSummarySignal =
    (summary.data?.totalIncome ?? 0) !== 0 ||
    (summary.data?.totalExpenses ?? 0) !== 0 ||
    (summary.data?.netBalance ?? 0) !== 0;
  const hasMonthlySignal = (monthly.data ?? []).some(
    (item) => item.income !== 0 || item.expense !== 0 || item.total !== 0
  );
  const hasCategorySignal = (byCategory.data ?? []).some(
    (item) => item.income !== 0 || item.expense !== 0 || item.total !== 0
  );
  const useDemoData = !isLoading && !(hasSummarySignal || hasMonthlySignal || hasCategorySignal);

  const dashboardSummary = useDemoData ? demoData.summary : summary.data;
  const dashboardMonthly = useDemoData ? demoData.monthly : monthly.data ?? [];
  const dashboardByCategory = useDemoData ? demoData.byCategory : byCategory.data ?? [];

  const hasMonthly = dashboardMonthly.length > 0;
  const hasCategories = dashboardByCategory.length > 0;

  const totalIncome = dashboardSummary?.totalIncome ?? 0;
  const totalExpenses = dashboardSummary?.totalExpenses ?? 0;
  const net = dashboardSummary?.netBalance ?? 0;

  return (
    <div className="space-y-4">
      {useDemoData ? (
        <div className="flex justify-end">
          <Badge tone="border">DEMO DATA</Badge>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card><div className="h-16 animate-pulse rounded-card bg-[#1A1A2A]" /></Card>
          <Card><div className="h-16 animate-pulse rounded-card bg-[#1A1A2A]" /></Card>
          <Card><div className="h-16 animate-pulse rounded-card bg-[#1A1A2A]" /></Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <div className="font-display text-[14px] tracking-[0.15em] uppercase text-[#5A5A7A]">
            TOTAL INCOME
          </div>
          <div className="mt-3">
            <LCDNumber value={totalIncome} prefix="INR " locale="en-IN" tone="mint" />
          </div>
        </Card>
        <Card>
          <div className="font-display text-[14px] tracking-[0.15em] uppercase text-[#5A5A7A]">
            TOTAL EXPENSES
          </div>
          <div className="mt-3">
            <LCDNumber value={totalExpenses} prefix="INR " locale="en-IN" tone="danger" />
          </div>
        </Card>
        <Card>
          <div className="font-display text-[14px] tracking-[0.15em] uppercase text-[#5A5A7A]">
            NET BALANCE
          </div>
          <div className="mt-3">
            <LCDNumber value={net} prefix="INR " locale="en-IN" tone={net >= 0 ? "accent" : "danger"} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div className="font-display text-[14px] tracking-[0.15em] uppercase text-accent">
              INCOME VS EXPENSE
            </div>
            <div className="text-[12px] text-[#5A5A7A]">MONTHLY</div>
          </div>
          <div className="mt-3">
            {hasMonthly ? (
              <IncomeExpenseBar data={dashboardMonthly} />
            ) : (
              <div className="text-[13px] text-[#5A5A7A]">No monthly data found</div>
            )}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div className="font-display text-[14px] tracking-[0.15em] uppercase text-accent">
              SPEND BY CATEGORY
            </div>
            <div className="text-[12px] text-[#5A5A7A]">TOP</div>
          </div>
          <div className="mt-3">
            {hasCategories ? (
              <CategoryPie data={dashboardByCategory.slice(0, 10)} />
            ) : (
              <div className="text-[13px] text-[#5A5A7A]">No category data found</div>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div className="font-display text-[14px] tracking-[0.15em] uppercase text-accent">
            12-MONTH TREND
          </div>
          <div className="text-[12px] text-[#5A5A7A]">TOTAL</div>
        </div>
        <div className="mt-3">
          {hasMonthly ? (
            <MonthlyLine data={dashboardMonthly} />
          ) : (
            <div className="text-[13px] text-[#5A5A7A]">No trend data found</div>
          )}
        </div>
      </Card>
    </div>
  );
}

