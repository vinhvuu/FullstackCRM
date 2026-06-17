"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoalFormDialog({ open, onOpenChange }: Props) {
  const [metric, setMetric] = useState<string>("revenue");
  const [period, setPeriod] = useState<string>("month");
  const [isTeam, setIsTeam] = useState(false);

  const currentYear = new Date().getFullYear();
  const periods = period === "month"
    ? Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        return { value: `${currentYear}-${m.toString().padStart(2, "0")}`, label: `Tháng ${m}` };
      })
    : Array.from({ length: 4 }, (_, i) => {
        return { value: `${currentYear}-Q${i + 1}`, label: `Q${i + 1}` };
      });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo mục tiêu mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Loại mục tiêu</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="team-goal"
                checked={isTeam}
                onCheckedChange={(checked) => setIsTeam(checked as boolean)}
              />
              <label htmlFor="team-goal" className="text-sm text-text-muted cursor-pointer">
                Mục tiêu đội nhóm
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Chỉ tiêu</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Doanh thu</SelectItem>
                <SelectItem value="deals_won">Deal thắng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Kỳ</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Theo tháng</SelectItem>
                <SelectItem value="quarter">Theo quý</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Thời gian</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mục tiêu ({metric === "revenue" ? "VND" : "Số deal"})</Label>
            <Input type="number" placeholder={metric === "revenue" ? "100000000" : "10"} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Tạo mục tiêu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}