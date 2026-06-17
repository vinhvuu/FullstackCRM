"use client";

import { useState } from "react";
import { Company } from "@/types";
import { INDUSTRIES, COMPANY_SIZES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Company>;
  onSubmit: (data: Omit<Company, "id" | "createdAt">) => void;
}

export function CompanyFormDialog({ open, onOpenChange, initial, onSubmit }: CompanyFormDialogProps) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    website: initial?.website || "",
    industry: initial?.industry || "",
    size: initial?.size || "",
    phone: initial?.phone || "",
    address: initial?.address || "",
    taxCode: initial?.taxCode || "",
    description: initial?.description || "",
    ownerId: initial?.ownerId || "u1",
  });
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Tên công ty là bắt buộc");
      return;
    }
    setError("");
    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Chỉnh sửa công ty" : "Thêm công ty mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">
              Tên công ty <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="Nhập tên công ty"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Website</label>
              <input
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                placeholder="example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Điện thoại</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                placeholder="028xxxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Ngành nghề</label>
              <select
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white"
              >
                <option value="">Chọn ngành</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Quy mô</label>
              <select
                value={form.size}
                onChange={(e) => set("size", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white"
              >
                <option value="">Chọn quy mô</option>
                {COMPANY_SIZES.map((s) => (
                  <option key={s} value={s}>{s} nhân viên</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Địa chỉ</label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="Địa chỉ công ty"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Mã số thuế</label>
            <input
              value={form.taxCode}
              onChange={(e) => set("taxCode", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none"
              placeholder="Mô tả ngắn về công ty"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              {initial?.id ? "Cập nhật" : "Thêm công ty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
