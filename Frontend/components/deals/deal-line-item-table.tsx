"use client";

import { DealLineItem } from "@/types";
import { lineItemTotal, dealTotals } from "@/lib/deals";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface DealLineItemTableProps {
  dealId: string;
  items: DealLineItem[];
  onChange: (items: DealLineItem[]) => void;
}

export function DealLineItemTable({ dealId, items, onChange }: DealLineItemTableProps) {
  const addRow = () => {
    const item: DealLineItem = {
      id: `li-${Date.now()}`,
      dealId,
      name: "",
      qty: 1,
      unitPrice: 0,
      discountPct: 0,
      taxPct: 10,
      total: 0,
    };
    onChange([...items, item]);
  };

  const updateRow = (id: string, field: keyof DealLineItem, value: string | number) => {
    const updated = items.map((it) => {
      if (it.id !== id) return it;
      const next = { ...it, [field]: value };
      next.total = lineItemTotal(next);
      return next;
    });
    onChange(updated);
  };

  const removeRow = (id: string) => onChange(items.filter((it) => it.id !== id));

  const { subtotal, tax, total } = dealTotals(items);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-text-muted text-xs">
              <th className="text-left px-3 py-2 font-medium">Sản phẩm / Dịch vụ</th>
              <th className="text-right px-3 py-2 font-medium w-16">SL</th>
              <th className="text-right px-3 py-2 font-medium w-32">Đơn giá</th>
              <th className="text-right px-3 py-2 font-medium w-20">CK%</th>
              <th className="text-right px-3 py-2 font-medium w-32">Thành tiền</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-gray-50">
                <td className="px-3 py-2">
                  <input
                    value={it.name}
                    onChange={(e) => updateRow(it.id, "name", e.target.value)}
                    placeholder="Tên sản phẩm..."
                    className="w-full focus:outline-none text-sm bg-transparent"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) => updateRow(it.id, "qty", Number(e.target.value))}
                    className="w-full text-right focus:outline-none text-sm bg-transparent"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={it.unitPrice}
                    onChange={(e) => updateRow(it.id, "unitPrice", Number(e.target.value))}
                    className="w-full text-right focus:outline-none text-sm bg-transparent"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={it.discountPct}
                    onChange={(e) => updateRow(it.id, "discountPct", Number(e.target.value))}
                    className="w-full text-right focus:outline-none text-sm bg-transparent"
                  />
                </td>
                <td className="px-3 py-2 text-right font-medium text-text-dark">
                  {formatCurrency(it.total)}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(it.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-text-muted text-sm">
                  Chưa có sản phẩm. Thêm dòng đầu tiên.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addRow}>
        <Plus className="w-3.5 h-3.5" /> Thêm dòng
      </Button>

      {items.length > 0 && (
        <div className="space-y-1 text-sm text-right border-t border-gray-100 pt-3">
          <div className="flex justify-between text-text-muted">
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Thuế (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-text-dark text-base">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
