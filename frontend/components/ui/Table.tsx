"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Table({
  header,
  children,
  className,
}: {
  header: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full overflow-x-auto border-2 border-border rounded-card", className)}>
      <table className="w-full border-collapse text-[13px] font-mono">
        <thead className="bg-[#0F0F16] text-[#5A5A7A]">{header}</thead>
        <tbody className="bg-surface">{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "border-t border-dashed border-[#2A2AFF33] transition-colors",
        "hover:bg-[#0F0F16]",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-3 py-3 text-left font-mono uppercase tracking-[0.12em] text-[12px]",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  hoverAccent = false,
}: {
  children: ReactNode;
  className?: string;
  hoverAccent?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-3 py-3 align-middle text-[#E8E8E0]",
        hoverAccent &&
          "group-hover/row:border-l-[3px] group-hover/row:border-mint group-hover/row:pl-[9px] border-l-[3px] border-transparent pl-3 transition-[padding,border-color] duration-150",
        className
      )}
    >
      {children}
    </td>
  );
}

