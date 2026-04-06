"use client";

import { Trash2, Pencil } from "lucide-react";
import type { FinancialRecord } from "@/types";
import { Td, Tr } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { formatCurrencyINR } from "@/lib/currency";

export function RecordRow({
  record,
  onDelete,
}: {
  record: FinancialRecord;
  onDelete: (id: string) => void;
}) {
  const amountTone = record.type === "INCOME" ? "text-mint" : "text-danger";
  const formattedDate = new Date(record.date).toLocaleDateString();

  return (
    <Tr className="group/row">
      <Td hoverAccent>{formattedDate}</Td>
      <Td hoverAccent>{record.type}</Td>
      <Td hoverAccent>{record.category}</Td>
      <Td hoverAccent className={`font-data drop-shadow-[0_0_8px_#FFD70066] ${amountTone}`}>
        {formatCurrencyINR(record.amount)}
      </Td>
      <Td hoverAccent className="text-[#5A5A7A]">
        {record.notes || "—"}
      </Td>
      <Td hoverAccent className="whitespace-nowrap">
        <div className="flex items-center gap-2 justify-end">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            title="Edit (not implemented)"
            onClick={() => {}}
            className="h-9 w-9"
          >
            <Pencil size={16} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="danger"
            title="Delete"
            onClick={() => onDelete(record.id)}
            className="h-9 w-9"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </Td>
    </Tr>
  );
}

