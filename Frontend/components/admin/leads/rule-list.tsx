"use client";

import { useState } from "react";
import { DistributionRule, RuleField, RuleOp, RuleStrategy } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Plus, MoreVertical, Edit, Trash2, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RuleListProps {
  rules: DistributionRule[];
  loading: boolean;
  onToggle: (id: number) => void;
  onEdit: (rule: DistributionRule) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

const FIELD_LABELS: Record<RuleField, string> = {
  source: "Nguồn",
  score: "Score",
  status: "Trạng thái",
  company: "Công ty",
  tag: "Tag",
  email_domain: "Email domain",
};

const STRATEGY_LABELS: Record<RuleStrategy, string> = {
  round_robin: "Luân phiên",
  least_load: "Ít tải nhất",
  first_available: "Người đầu tiên",
  pool: "Về pool",
};

const ACTION_LABELS: Record<string, string> = {
  assign: "Gán",
};

function getConditionSummary(conditions: { field: RuleField; op: RuleOp; value: string | number | string[] }[]): string {
  if (conditions.length === 0) return "Không có điều kiện";
  return conditions
    .map((c) => {
      const opLabels: Record<RuleOp, string> = {
        eq: "=",
        ne: "!=",
        in: "trong",
        not_in: "không trong",
        gte: ">=",
        lte: "<=",
        contains: "chứa",
      };
      return `${FIELD_LABELS[c.field]} ${opLabels[c.op]} ${c.value}`;
    })
    .join(", ");
}

export function RuleList({ rules, loading, onToggle, onEdit, onDelete, onCreate }: RuleListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-50" />
        <p className="text-text-muted mb-4">Chưa có luật chia lead nào</p>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo luật đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">Thứ tự ưu tiên từ trên xuống</p>
        <Button size="sm" onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo luật
        </Button>
      </div>
      {rules.map((rule) => (
        <Card key={rule.id} className={!rule.isActive ? "opacity-60" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="cursor-grab">
                <GripVertical className="w-5 h-5 text-text-muted" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">#{rule.priority}</span>
                  <span className="font-medium text-text-dark">{rule.name}</span>
                  {!rule.isActive && <Badge variant="outline">Tắt</Badge>}
                </div>
                <p className="text-sm text-text-muted mt-1">
                  {getConditionSummary(rule.conditions)}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {ACTION_LABELS[rule.action.type]}: {rule.action.targets.length} người • {STRATEGY_LABELS[rule.action.strategy]}
                </p>
              </div>
              <Switch checked={rule.isActive} onCheckedChange={() => onToggle(rule.id)} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(rule)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(rule.id)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}