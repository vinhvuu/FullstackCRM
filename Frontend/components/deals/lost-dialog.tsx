"use client";

import { useState } from "react";
import { LOSS_REASONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { XCircle } from "lucide-react";

interface LostDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (data: { lossReason: string; competitor?: string; note?: string }) => void;
  dealTitle: string;
}

export function LostDialog({ open, onOpenChange, onConfirm, dealTitle }: LostDialogProps) {
  const [lossReason, setLossReason] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lossReason) { setErr("Vui lòng chọn lý do"); return; }
    onConfirm({ lossReason, competitor, note });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" /> Đánh dấu Lost
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-text-muted">
            Deal: <span className="font-semibold text-text-dark">{dealTitle}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">
              Lý do thua <span className="text-red-500">*</span>
            </label>
            <select
              value={lossReason}
              onChange={(e) => setLossReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:outline-none text-sm bg-white"
            >
              <option value="">Chọn lý do...</option>
              {LOSS_REASONS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Đối thủ (nếu có)</label>
            <input
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="Tên đối thủ cạnh tranh"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">Xác nhận Lost</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
