"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { goals as allGoals, deals } from "@/lib/mock-data";
import { goalProgress } from "@/lib/forecast";
import { Goal } from "@/types";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalFormDialog } from "@/components/goals/goal-form-dialog";
import { Target, TrendingUp } from "lucide-react";

export default function GoalsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const goalData = useMemo(() => {
    return allGoals.map((goal) => ({
      ...goal,
      progress: goalProgress(goal, deals),
    }));
  }, []);

  const personalGoals = goalData.filter((g) => !g.isTeam);
  const teamGoals = goalData.filter((g) => g.isTeam);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Mục tiêu & Chỉ tiêu</h1>
          <p className="text-text-muted mt-1">Quản lý mục tiêu cá nhân và đội nhóm</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Target className="w-4 h-4" />
          Tạo mục tiêu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-poppins text-text-dark">{personalGoals.length}</p>
                <p className="text-sm text-text-muted">Mục tiêu cá nhân</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cta/10">
                <TrendingUp className="w-6 h-6 text-cta" />
              </div>
              <div>
                <p className="text-2xl font-bold font-poppins text-text-dark">{teamGoals.length}</p>
                <p className="text-sm text-text-muted">Mục tiêu đội nhóm</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-poppins text-text-dark">
                  {Math.round(personalGoals.reduce((s, g) => s + g.progress.pct, 0) / Math.max(1, personalGoals.length))}%
                </p>
                <p className="text-sm text-text-muted">Trung bình đạt được</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {personalGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mục tiêu cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </CardContent>
        </Card>
      )}

      {teamGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mục tiêu đội nhóm</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </CardContent>
        </Card>
      )}

      <GoalFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}