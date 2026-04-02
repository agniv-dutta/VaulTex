"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import type { MonthlyBreakdownItem } from "@/types";

export function MonthlyLine({ data }: { data: MonthlyBreakdownItem[] }) {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
            cursor={{ stroke: "#2A2AFF", strokeDasharray: "4 4" }}
            content={<ChartTooltip />}
          />
          <Line
            type="monotone"
            dataKey="total"
            name="TOTAL"
            stroke="#FFD700"
            strokeWidth={2.5}
            dot={{ fill: "#FF6B00", stroke: "#FFD700", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

