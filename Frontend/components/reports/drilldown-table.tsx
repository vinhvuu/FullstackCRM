"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface Props {
  bucketName: string;
  records: object[];
  onClose: () => void;
}

function renderValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return v > 100000 ? formatCurrency(v) : String(v);
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export function DrilldownTable({ bucketName, records, onClose }: Props) {
  if (!records.length) return null;

  const keys = Object.keys(records[0] as object).filter(
    (k) => !["id", "reminders", "recurrence"].includes(k)
  );

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <span className="text-sm font-semibold text-text-dark">
          Drill-down: <span className="text-primary">{bucketName}</span>
          <span className="ml-2 text-text-muted font-normal">({records.length} bản ghi)</span>
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="overflow-auto max-h-[260px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-white border-b">
            <tr>
              {keys.map((k) => (
                <th key={k} className="text-left py-2 px-3 font-medium text-text-muted capitalize">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((row, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                {keys.map((k) => (
                  <td key={k} className="py-1.5 px-3 max-w-[200px] truncate">
                    {renderValue((row as Record<string, unknown>)[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
