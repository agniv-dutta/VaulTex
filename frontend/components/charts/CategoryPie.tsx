"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import type { CategoryBreakdownItem } from "@/types";

const COLORS = ["#FFD700", "#00FFAA", "#2A2AFF", "#FF6B00", "#FF2D55"];

export function CategoryPie({ data }: { data: CategoryBreakdownItem[] }) {
  const pieData = data.map((d) => ({ name: d.category, value: d.expense || d.total }));

  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            innerRadius={45}
            stroke="transparent"
          >
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

