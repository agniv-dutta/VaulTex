"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RecordFilters, type RecordFiltersValue } from "@/components/records/RecordFilters";
import { RecordTable } from "@/components/records/RecordTable";
import { useDeleteRecord, useRecords } from "@/hooks/useRecords";
import { useAuthStore } from "@/store/authStore";
import { RequireRole } from "@/components/auth/RequireRole";

export default function RecordsPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);

  const [filters, setFilters] = useState<RecordFiltersValue>({
    type: undefined,
    category: undefined,
    startDate: undefined,
    endDate: undefined,
    search: "",
  });
  const [page, setPage] = useState(1);

  const recordsQuery = useRecords({
    type: filters.type,
    category: filters.category,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page,
    limit: 20,
  });

  const del = useDeleteRecord();

  const categories = useMemo(() => {
    const set = new Set<string>();
    (recordsQuery.data?.data ?? []).forEach((r) => set.add(r.category));
    return [...set.values()].sort((a, b) => a.localeCompare(b));
  }, [recordsQuery.data?.data]);

  const filteredClient = useMemo(() => {
    const term = (filters.search ?? "").trim().toLowerCase();
    if (!term) return recordsQuery.data?.data ?? [];
    return (recordsQuery.data?.data ?? []).filter((r) => {
      return (
        r.category.toLowerCase().includes(term) ||
        (r.notes ?? "").toLowerCase().includes(term)
      );
    });
  }, [recordsQuery.data?.data, filters.search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-display text-[24px] tracking-[0.15em] uppercase text-accent">
            RECORDS
          </div>
          <div className="text-[12px] text-[#5A5A7A]">/api/records</div>
        </div>

        <RequireRole role="ADMIN">
          <Button onClick={() => router.push("/records/new")}>NEW ENTRY</Button>
        </RequireRole>
      </div>

      <RecordFilters
        value={filters}
        onChange={(next) => {
          setPage(1);
          setFilters(next);
        }}
        categories={categories}
      />

      <Card className="p-4">
        {recordsQuery.isLoading ? (
          <div className="text-[#5A5A7A]">LOADING...</div>
        ) : recordsQuery.error ? (
          <div className="text-danger">FAILED TO LOAD RECORDS.</div>
        ) : (
          <>
            <RecordTable
              records={filteredClient}
              onDelete={(id) => {
                if (role !== "ADMIN") return;
                del.mutate(id);
              }}
            />
            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                PREV
              </Button>
              <div className="text-[12px] text-[#5A5A7A] font-mono">
                PAGE {recordsQuery.data?.meta.page ?? page} /{" "}
                {recordsQuery.data?.meta.totalPages ?? 1}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    Math.min(recordsQuery.data?.meta.totalPages ?? p + 1, p + 1)
                  )
                }
                disabled={page >= (recordsQuery.data?.meta.totalPages ?? 1)}
              >
                NEXT
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

