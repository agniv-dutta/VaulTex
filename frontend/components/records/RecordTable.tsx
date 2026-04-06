"use client";

import type { FinancialRecord } from "@/types";
import { Table, Th } from "@/components/ui/Table";
import { RecordRow } from "@/components/records/RecordRow";

export function RecordTable({
  records,
  onDelete,
}: {
  records: FinancialRecord[];
  onDelete: (id: string) => void;
}) {
  if (records.length === 0) {
    return (
      <Table
        header={
          <tr>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th>Amount</Th>
            <Th>Notes</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        }
      >
        <tr>
          <td colSpan={6} className="px-3 py-8 text-center text-[#5A5A7A]">
            No records found
          </td>
        </tr>
      </Table>
    );
  }

  return (
    <Table
      header={
        <tr>
          <Th>Date</Th>
          <Th>Type</Th>
          <Th>Category</Th>
          <Th>Amount</Th>
          <Th>Notes</Th>
          <Th className="text-right">Actions</Th>
        </tr>
      }
    >
      {records.map((r) => (
        <RecordRow key={r.id} record={r} onDelete={onDelete} />
      ))}
    </Table>
  );
}

