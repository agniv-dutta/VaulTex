"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { RequireRole } from "@/components/auth/RequireRole";

const nav = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/records", label: "RECORDS" },
] as const;

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "block px-4 py-3 border-2 border-border rounded-card transition-colors duration-150",
        "hover:border-mint",
        active ? "border-accent shadow-glow-gold text-accent" : "text-[#E8E8E0]"
      )}
    >
      <div className="font-display text-[14px] tracking-[0.15em] uppercase">
        {label}
      </div>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="w-[260px] shrink-0 border-r-2 border-border bg-[#0C0C13] p-4">
      <div className="mb-6">
        <div className="font-display text-[18px] tracking-[0.18em] uppercase text-accent drop-shadow-[0_0_8px_#FFD70066]">
          FINLEDGER
        </div>
        <div className="mt-2 border-t border-dashed border-[#2A2AFF33]" />
      </div>

      <nav className="space-y-3">
        {nav.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
        <RequireRole role="ADMIN">
          <NavLink href="/users" label="USERS" />
        </RequireRole>
      </nav>
    </aside>
  );
}

