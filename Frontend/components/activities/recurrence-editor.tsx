"use client";

import { useState } from "react";
import { RecurrenceRule, RecurrenceFreq } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react";

interface RecurrenceEditorProps {
  value?: RecurrenceRule;
  onChange: (rule: RecurrenceRule | undefined) => void;
}

const freqLabels: Record<RecurrenceFreq, string> = {
  daily: "Ngày",
  weekly: "Tuần",
  monthly: "Tháng",
};

export function RecurrenceEditor({ value, onChange }: RecurrenceEditorProps) {
  const [enabled, setEnabled] = useState(!!value);
  const [freq, setFreq] = useState<RecurrenceFreq>(value?.freq || "weekly");
  const [interval, setInterval] = useState(value?.interval || 1);
  const [until, setUntil] = useState(value?.until || "");

  const handleToggle = () => {
    if (enabled) {
      onChange(undefined);
    } else {
      onChange({ freq, interval, until: until || undefined });
    }
    setEnabled(!enabled);
  };

  const handleChange = (field: "freq" | "interval" | "until", newValue: string | number) => {
    const newRule: RecurrenceRule = {
      freq: field === "freq" ? (newValue as RecurrenceFreq) : freq,
      interval: field === "interval" ? Number(newValue) : interval,
      until: field === "until" ? newValue as string : until,
    };
    onChange(newRule);
  };

  const previewText = () => {
    if (!enabled) return "";
    const intervalText = interval === 1 ? "" : `${interval} `;
    return `Lặp mỗi ${intervalText}${freqLabels[freq]}${until ? ` đến ${until}` : ""}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={enabled ? "default" : "outline"}
          size="sm"
          onClick={handleToggle}
          className="gap-2"
        >
          <Repeat className="w-4 h-4" />
          Lặp lại
        </Button>
      </div>

      {enabled && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-text-muted">Tần suất</Label>
              <select
                value={freq}
                onChange={(e) => {
                  setFreq(e.target.value as RecurrenceFreq);
                  handleChange("freq", e.target.value);
                }}
                className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-text-muted">Mỗi</Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={interval}
                onChange={(e) => {
                  setInterval(Number(e.target.value));
                  handleChange("interval", e.target.value);
                }}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-text-muted">Kết thúc (tùy chọn)</Label>
            <Input
              type="date"
              value={until}
              onChange={(e) => {
                setUntil(e.target.value);
                handleChange("until", e.target.value);
              }}
              className="h-9"
            />
          </div>

          {previewText() && (
            <p className="text-xs text-primary font-medium">{previewText()}</p>
          )}
        </div>
      )}
    </div>
  );
}