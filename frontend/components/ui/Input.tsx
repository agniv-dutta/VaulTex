"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-card bg-surface px-3 text-[13px] text-[#E8E8E0] placeholder:text-[#5A5A7A] border-2 border-border outline-none",
        "focus:border-mint focus:shadow-glow-mint",
        className
      )}
      {...props}
    />
  );
});

