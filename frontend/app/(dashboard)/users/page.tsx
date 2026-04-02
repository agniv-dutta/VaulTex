"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Table, Th, Tr, Td } from "@/components/ui/Table";
import { useUsers, useUpdateUserRole } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types";

function roleTone(role: Role) {
  if (role === "ADMIN") return "danger";
  if (role === "ANALYST") return "accent";
  return "default";
}

export default function UsersPage() {
  const currentRole = useAuthStore((s) => s.role);

  const users = useUsers();
  const updateRole = useUpdateUserRole();

  if (currentRole !== "ADMIN") {
    return (
      <Card>
        <div className="font-display text-[18px] tracking-[0.15em] uppercase text-danger">
          ACCESS DENIED
        </div>
        <div className="mt-2 text-[13px] text-[#5A5A7A]">
          ADMIN role required.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="font-display text-[24px] tracking-[0.15em] uppercase text-accent">
          USERS
        </div>
        <div className="text-[12px] text-[#5A5A7A]">/api/users</div>
      </div>

      <Card className="p-4">
        {users.isLoading ? (
          <div className="text-[#5A5A7A]">LOADING...</div>
        ) : users.error ? (
          <div className="text-danger">FAILED TO LOAD USERS.</div>
        ) : (
          <Table
            header={
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            }
          >
            {(users.data ?? []).map((u) => (
              <Tr key={u.id} className="group/row">
                <Td hoverAccent>{u.name}</Td>
                <Td hoverAccent>{u.email}</Td>
                <Td hoverAccent>
                  <Badge tone={roleTone(u.role) as never}>{u.role}</Badge>
                </Td>
                <Td hoverAccent className="text-right">
                  <div className="flex justify-end">
                    <div className="w-[180px]">
                      <Select
                        value={u.role}
                        onChange={(e) =>
                          updateRole.mutate({ id: u.id, role: e.target.value as Role })
                        }
                      >
                        <option value="VIEWER">VIEWER</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="ADMIN">ADMIN</option>
                      </Select>
                    </div>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

