"use client";

import CountUp from "react-countup";
import { cn } from "@/lib/cn";

export function LCDNumber({
  value,
  prefix,
  suffix,
  className,
  tone = "accent",
  decimals = 2,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  tone?: "accent" | "mint" | "danger";
  decimals?: number;
}) {
  const tones: Record<NonNullable<typeof tone>, string> = {
    accent: "text-accent shadow-glow-gold",
    mint: "text-mint shadow-glow-mint",
    danger: "text-danger shadow-[0_0_10px_#FF2D5566]",
  };

  return (
    <div
      className={cn(
        "font-data text-[40px] leading-none tracking-[0.04em] drop-shadow-[0_0_8px_#FFD70066]",
        tones[tone],
        className
      )}
    >
      <CountUp
        end={value}
        duration={0.9}
        decimals={decimals}
        separator=","
        prefix={prefix}
        suffix={suffix}
      />
    </div>
  );
}

