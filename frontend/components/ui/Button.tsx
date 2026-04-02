"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  size?: "md" | "sm" | "icon";
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.12em] transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const shape =
    "rounded-pill border-2 border-accent shadow-glow hover:scale-[1.03] hover:shadow-[0_0_16px_#FF6B0099] active:scale-[0.99]";

  const sizes: Record<NonNullable<Props["size"]>, string> = {
    md: "h-11 px-6 text-[13px]",
    sm: "h-9 px-4 text-[12px]",
    icon: "h-10 w-10 px-0",
  };

  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary:
      "bg-[linear-gradient(135deg,#FF6B00,#FFD700)] text-black",
    ghost:
      "bg-transparent border-2 border-border text-[#E8E8E0] hover:border-mint hover:shadow-glow-mint",
    danger:
      "bg-transparent border-2 border-danger text-danger hover:shadow-[0_0_12px_#FF2D5566]",
  };

  return (
    <button
      ref={ref}
      className={cn(base, shape, sizes[size], variants[variant], className)}
      {...props}
    />
  );
});

