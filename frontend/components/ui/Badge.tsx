"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "mint" | "danger" | "accent" | "border";
}) {
  const tones: Record<NonNullable<typeof tone>, string> = {
    default: "border-border text-[#E8E8E0]",
    mint: "border-mint text-mint",
    danger: "border-danger text-danger",
    accent: "border-accent text-accent",
    border: "border-border text-[#5A5A7A]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border-2 px-3 py-1 text-[12px] font-mono uppercase tracking-[0.12em]",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

