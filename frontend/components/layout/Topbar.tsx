"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/authStore";

export function Topbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.clearAuth);

  const roleTone =
    role === "ADMIN" ? "danger" : role === "ANALYST" ? "accent" : "default";

  return (
    <header className="h-14 border-b-2 border-border bg-[#0C0C13] px-4 flex items-center justify-end gap-3">
      {user ? (
        <>
          <Badge tone="border">{user.email}</Badge>
          {role ? <Badge tone={roleTone as never}>{role}</Badge> : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            LOGOUT
          </Button>
        </>
      ) : null}
    </header>
  );
}

