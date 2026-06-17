"use client";

import { ReportEntity } from "@/types";
import { DEAL_STAGES, LEAD_SOURCES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Props {
  entity: ReportEntity;
  filters: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
}

export function ReportFilters({ entity, filters, onChange }: Props) {
  const set = (k: string, v: unknown) => onChange({ ...filters, [k]: v === "all" ? undefined : v });

  return (
    <div className="space-y-3">
      {entity === "deal" && (
        <>
          <div className="space-y-1">
            <Label className="text-xs text-text-muted">Trạng thái</Label>
            <Select value={(filters.status as string) || "all"} onValueChange={(v) => set("status", v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="open">Đang mở</SelectItem>
                <SelectItem value="won">Thắng</SelectItem>
                <SelectItem value="lost">Thua</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-text-muted">Giai đoạn</Label>
            <Select value={(filters.stage as string) || "all"} onValueChange={(v) => set("stage", v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {DEAL_STAGES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {entity === "lead" && (
        <div className="space-y-1">
          <Label className="text-xs text-text-muted">Nguồn</Label>
          <Select value={(filters.source as string) || "all"} onValueChange={(v) => set("source", v)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {entity === "activity" && (
        <div className="space-y-1">
          <Label className="text-xs text-text-muted">Loại</Label>
          <Select value={(filters.type as string) || "all"} onValueChange={(v) => set("type", v)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {["call", "email", "meeting", "task"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
