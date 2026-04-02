"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-card bg-surface px-3 text-[13px] text-[#E8E8E0] border-2 border-border outline-none",
        "focus:border-mint focus:shadow-glow-mint",
        className
      )}
      {...props}
    />
  );
});

