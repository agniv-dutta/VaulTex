"use client";

import { Card } from "@/components/ui/Card";
import { LCDNumber } from "@/components/ui/LCDNumber";
import {
  useDashboardByCategory,
  useDashboardMonthly,
  useDashboardSummary,
} from "@/hooks/useDashboard";
import { IncomeExpenseBar } from "@/components/charts/IncomeExpenseBar";
import { CategoryPie } from "@/components/charts/CategoryPie";
import { MonthlyLine } from "@/components/charts/MonthlyLine";

export default function DashboardPage() {
  const summary = useDashboardSummary();
  const byCategory = useDashboardByCategory();
  const monthly = useDashboardMonthly();

  const isLoading = summary.isLoading || byCategory.isLoading || monthly.isLoading;
  const hasMonthly = (monthly.data?.length ?? 0) > 0;
  const hasCategories = (byCategory.data?.length ?? 0) > 0;

  const totalIncome = summary.data?.totalIncome ?? 0;
  const totalExpenses = summary.data?.totalExpenses ?? 0;
  const net = summary.data?.netBalance ?? 0;

  return (
    <div className="space-y-4">
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
            <LCDNumber value={totalIncome} prefix="$" tone="mint" />
          </div>
        </Card>
        <Card>
          <div className="font-display text-[14px] tracking-[0.15em] uppercase text-[#5A5A7A]">
            TOTAL EXPENSES
          </div>
          <div className="mt-3">
            <LCDNumber value={totalExpenses} prefix="$" tone="danger" />
          </div>
        </Card>
        <Card>
          <div className="font-display text-[14px] tracking-[0.15em] uppercase text-[#5A5A7A]">
            NET BALANCE
          </div>
          <div className="mt-3">
            <LCDNumber value={net} prefix="$" tone={net >= 0 ? "accent" : "danger"} />
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
              <IncomeExpenseBar data={monthly.data ?? []} />
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
              <CategoryPie data={(byCategory.data ?? []).slice(0, 10)} />
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
            <MonthlyLine data={monthly.data ?? []} />
          ) : (
            <div className="text-[13px] text-[#5A5A7A]">No trend data found</div>
          )}
        </div>
      </Card>
    </div>
  );
}

