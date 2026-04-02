"use client";

import type { RecordType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export type RecordFiltersValue = {
  type?: RecordType;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
};

export function RecordFilters({
  value,
  onChange,
  categories,
}: {
  value: RecordFiltersValue;
  onChange: (next: RecordFiltersValue) => void;
  categories: string[];
}) {
  return (
    <div className="border-2 border-border rounded-card p-4 bg-surface">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
            TYPE
          </div>
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant={value.type === "INCOME" ? "primary" : "ghost"}
              size="sm"
              onClick={() => onChange({ ...value, type: value.type === "INCOME" ? undefined : "INCOME" })}
            >
              INCOME
            </Button>
            <Button
              type="button"
              variant={value.type === "EXPENSE" ? "primary" : "ghost"}
              size="sm"
              onClick={() => onChange({ ...value, type: value.type === "EXPENSE" ? undefined : "EXPENSE" })}
            >
              EXPENSE
            </Button>
            <Button
              type="button"
              variant={!value.type ? "primary" : "ghost"}
              size="sm"
              onClick={() => onChange({ ...value, type: undefined })}
            >
              ALL
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
            CATEGORY
          </div>
          <div className="mt-2">
            <Select
              value={value.category ?? ""}
              onChange={(e) =>
                onChange({ ...value, category: e.target.value || undefined })
              }
            >
              <option value="">ALL</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
            START
          </div>
          <div className="mt-2">
            <Input
              type="date"
              value={value.startDate ?? ""}
              onChange={(e) =>
                onChange({ ...value, startDate: e.target.value || undefined })
              }
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
            END
          </div>
          <div className="mt-2">
            <Input
              type="date"
              value={value.endDate ?? ""}
              onChange={(e) =>
                onChange({ ...value, endDate: e.target.value || undefined })
              }
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
            SEARCH
          </div>
          <div className="mt-2">
            <Input
              placeholder="notes / category"
              value={value.search ?? ""}
              onChange={(e) => onChange({ ...value, search: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

