"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import type { MonthlyBreakdownItem } from "@/types";

export function IncomeExpenseBar({ data }: { data: MonthlyBreakdownItem[] }) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#5A5A7A", fontSize: 12, fontFamily: "IBM Plex Mono" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#5A5A7A", fontSize: 12, fontFamily: "IBM Plex Mono" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(42,42,255,0.08)" }}
            content={<ChartTooltip />}
          />
          <Bar dataKey="income" name="INCOME" fill="#00FFAA" radius={[2, 2, 0, 0]} />
          <Bar
            dataKey="expense"
            name="EXPENSE"
            fill="#FF2D55"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

