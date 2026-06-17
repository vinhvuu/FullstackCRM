"use client";

import { useState } from "react";
import { RecordType, TimelineItem, Activity, ActivityType } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone } from "lucide-react";

type CallOutcome = "connected" | "no_answer" | "busy" | "voicemail" | "wrong_number";

const OUTCOMES: { value: CallOutcome; label: string }[] = [
  { value: "connected", label: "Đã kết nối" },
  { value: "no_answer", label: "Không bắt máy" },
  { value: "busy", label: "Máy bận" },
  { value: "voicemail", label: "Để lại tin nhắn" },
  { value: "wrong_number", label: "Sai số" },
];

interface CallLogDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  relatedType: RecordType;
  relatedId: string;
  onLogged: (item: TimelineItem, followUpTask?: Omit<Activity, "id">) => void;
}

export function CallLogDialog({ open, onOpenChange, relatedType, relatedId, onLogged }: CallLogDialogProps) {
  const [outcome, setOutcome] = useState<CallOutcome>("connected");
  const [direction, setDirection] = useState<"out" | "in">("out");
  const [durationMin, setDurationMin] = useState("");
  const [note, setNote] = useState("");
  const [createFollowUp, setCreateFollowUp] = useState(false);
  const [followUpDays, setFollowUpDays] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const outcomeLabel = OUTCOMES.find((o) => o.value === outcome)?.label || outcome;
    const item: TimelineItem = {
      id: `call-${Date.now()}`,
      type: "call",
      title: `${direction === "out" ? "Gọi đi" : "Gọi đến"}: ${outcomeLabel}`,
      content: note,
      createdAt: new Date().toLocaleString("vi-VN"),
      createdBy: "Bạn",
      meta: { outcome, direction, durationMin: durationMin ? Number(durationMin) : undefined },
    };

    let followUp: Omit<Activity, "id"> | undefined;
    if (createFollowUp) {
      const due = new Date();
      due.setDate(due.getDate() + followUpDays);
      followUp = {
        type: "task" as ActivityType,
        title: "Follow up cuộc gọi",
        description: note,
        dueDate: due.toISOString().split("T")[0],
        status: "pending",
        priority: "medium",
        relatedType,
        relatedId,
      };
    }

    onLogged(item, followUp);
    setNote("");
    setDurationMin("");
    setCreateFollowUp(false);
    onOpenChange(false);
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Ghi log Cuộc gọi
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {(["out", "in"] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDirection(d)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${direction === d ? "bg-blue-600 text-white" : "bg-gray-100 text-text-muted hover:bg-gray-200"}`}>
                {d === "out" ? "Gọi đi" : "Gọi đến"}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Kết quả</label>
            <select value={outcome} onChange={(e) => setOutcome(e.target.value as CallOutcome)} className={inputCls}>
              {OUTCOMES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Thời lượng (phút)</label>
            <input type="number" min={0} value={durationMin} onChange={(e) => setDurationMin(e.target.value)} placeholder="VD: 5" className={inputCls} />
          </div>

          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Ghi chú</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Nội dung cuộc gọi..." />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <input type="checkbox" id="followup" checked={createFollowUp} onChange={(e) => setCreateFollowUp(e.target.checked)} className="w-4 h-4 rounded accent-indigo-600" />
            <label htmlFor="followup" className="text-sm text-text-dark flex-1">Tạo task follow-up sau</label>
            {createFollowUp && (
              <input type="number" min={1} value={followUpDays} onChange={(e) => setFollowUpDays(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center" />
            )}
            {createFollowUp && <span className="text-sm text-text-muted">ngày</span>}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Lưu cuộc gọi</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
