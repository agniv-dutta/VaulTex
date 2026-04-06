"use client";

import { cn } from "@/lib/cn";
import { formatCurrencyINR } from "@/lib/currency";

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className={cn("bg-surface border-2 border-border rounded-card px-3 py-2 font-mono text-[12px]")}>
      {label ? (
        <div className="font-display text-[11px] tracking-[0.15em] uppercase text-[#5A5A7A]">
          {label}
        </div>
      ) : null}
      <div className="mt-1 space-y-1">
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-[2px]"
              style={{ background: p.color || "#FFD700" }}
            />
            <span className="text-[#E8E8E0]">
              {(p.name || "VALUE").toString().toUpperCase()}
            </span>
            <span className="ml-auto font-data text-accent drop-shadow-[0_0_8px_#FFD70066]">
              {typeof p.value === "number" ? formatCurrencyINR(p.value) : "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

