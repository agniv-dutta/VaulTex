"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useCreateRecord } from "@/hooks/useRecords";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import type { RecordType } from "@/types";

const CATEGORY_OPTIONS = [
  "Salary",
  "Freelance",
  "Bonus",
  "Investment",
  "Rent",
  "Groceries",
  "Utilities",
  "Transport",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Insurance",
  "Education",
  "Travel",
  "Other",
] as const;

const schema = z.object({
  amount: z.coerce.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Category is required").max(100),
  date: z.string().min(1),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.input<typeof schema>;

export default function NewRecordPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const toast = useToastStore((s) => s.show);
  const create = useCreateRecord();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "EXPENSE",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    },
  });

  const type = watch("type") as RecordType;

  if (role !== "ADMIN") {
    return (
      <Card>
        <div className="font-display text-[18px] tracking-[0.15em] uppercase text-danger">
          ACCESS DENIED
        </div>
        <div className="mt-2 text-[13px] text-[#5A5A7A]">
          Only ADMIN can create records on this API.
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-[760px] space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-display text-[24px] tracking-[0.15em] uppercase text-accent">
            NEW ENTRY
          </div>
          <div className="text-[12px] text-[#5A5A7A]">/api/records (POST)</div>
        </div>
        <Button variant="ghost" onClick={() => router.push("/records")}>
          BACK
        </Button>
      </div>

      <Card className="p-5">
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            if (!user) return;
            await create.mutateAsync({
              userId: user.id,
              amount: Number(values.amount),
              type: values.type as RecordType,
              category: values.category as string,
              date: values.date as string,
              notes: (values.notes as string | undefined) ?? null,
            });
            toast({ message: "ENTRY COMMITTED TO LEDGER.", tone: "success" });
            router.push("/records");
          })}
        >
          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              AMOUNT
            </div>
            <Input placeholder="100.00" {...register("amount")} />
            {errors.amount ? (
              <div className="mt-1 text-[12px] text-danger">{errors.amount.message}</div>
            ) : null}
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              TYPE
            </div>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={type === "INCOME" ? "primary" : "ghost"}
                onClick={() => setValue("type", "INCOME")}
              >
                INCOME
              </Button>
              <Button
                type="button"
                size="sm"
                variant={type === "EXPENSE" ? "primary" : "ghost"}
                onClick={() => setValue("type", "EXPENSE")}
              >
                EXPENSE
              </Button>
            </div>
            {errors.type ? (
              <div className="mt-1 text-[12px] text-danger">{errors.type.message}</div>
            ) : null}
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              CATEGORY
            </div>
            <Select {...register("category")}>
              <option value="">SELECT CATEGORY</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {errors.category ? (
              <div className="mt-1 text-[12px] text-danger">
                {errors.category.message}
              </div>
            ) : null}
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              DATE
            </div>
            <Input type="date" {...register("date")} />
            {errors.date ? (
              <div className="mt-1 text-[12px] text-danger">{errors.date.message}</div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              NOTES
            </div>
            <textarea
              placeholder="Optional..."
              rows={3}
              {...register("notes")}
              className="w-full rounded-card bg-surface px-3 py-2 text-[13px] text-[#E8E8E0] placeholder:text-[#5A5A7A] border-2 border-border outline-none focus:border-mint focus:shadow-glow-mint"
            />
            {errors.notes ? (
              <div className="mt-1 text-[12px] text-danger">{errors.notes.message}</div>
            ) : null}
          </div>

          {create.error ? (
            <div className="md:col-span-2 text-[12px] text-danger">
              COMMIT FAILED. CHECK FIELDS / PERMISSIONS.
            </div>
          ) : null}

          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "COMMITTING..." : "COMMIT ENTRY"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push("/records")}>
              CANCEL
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

