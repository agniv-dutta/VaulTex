"use client";

import { ReactNode, useMemo } from "react";
import type { Role } from "@/types";
import { useAuthStore } from "@/store/authStore";

const RANK: Record<Role, number> = { VIEWER: 1, ANALYST: 2, ADMIN: 3 };

export function RequireRole({
  role,
  children,
  fallback = null,
}: {
  role: Role;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const current = useAuthStore((s) => s.role);

  const allowed = useMemo(() => {
    if (!current) return false;
    return RANK[current] >= RANK[role];
  }, [current, role]);

  return allowed ? <>{children}</> : <>{fallback}</>;
}

