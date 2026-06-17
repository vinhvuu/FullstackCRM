"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Goal } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { GoalProgress } from "@/components/goals/goal-progress";
import { DollarSign, Trophy } from "lucide-react";

interface Props {
  goal: Goal & { progress: { actual: number; pct: number; pace: number; daysLeft: number } };
}

export function GoalCard({ goal }: Props) {
  const periodLabel = goal.period === "month" 
    ? `Tháng ${goal.periodKey.slice(5)}` 
    : `Quý ${goal.periodKey.split("-Q")[1]}`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {goal.metric === "revenue" ? (
              <DollarSign className="w-4 h-4 text-cta" />
            ) : (
              <Trophy className="w-4 h-4 text-amber-500" />
            )}
            <span className="text-sm font-medium text-text-dark">
              {goal.metric === "revenue" ? "Doanh thu" : "Deal thắng"}
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-text-muted">
            {periodLabel}
          </span>
        </div>

        <div className="text-center py-2">
          <p className="text-2xl font-bold font-poppins text-text-dark">
            {goal.metric === "revenue" ? formatCurrency(goal.progress.actual) : goal.progress.actual}
          </p>
          <p className="text-sm text-text-muted">
            / {goal.metric === "revenue" ? formatCurrency(goal.target) : goal.target}
          </p>
        </div>

        <GoalProgress progress={goal.progress} />
      </CardContent>
    </Card>
  );
}