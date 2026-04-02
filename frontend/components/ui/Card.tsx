"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface border-2 border-border p-4 transition-colors duration-150",
        "hover:border-mint",
        className
      )}
      {...props}
    />
  );
}

