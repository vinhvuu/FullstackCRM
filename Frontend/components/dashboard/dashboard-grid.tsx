"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardWidget } from "@/types";
import { dashboardLayout, dashboardStats, deals, activities, goals } from "@/lib/mock-data";
import { goalProgress } from "@/lib/forecast";
import { formatCurrency } from "@/lib/utils";
import { ForecastChart } from "@/components/reports/forecast-chart";
import { GoalProgress } from "@/components/goals/goal-progress";
import { TrendingUp, DollarSign, Users, Target, Calendar, AlertCircle } from "lucide-react";

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: "w1", type: "kpi", title: "Doanh thu tháng", w: 1, h: 1, x: 0, y: 0 },
  { id: "w2", type: "kpi", title: "Lead mới", w: 1, h: 1, x: 1, y: 0 },
  { id: "w3", type: "kpi", title: "Deal đang mở", w: 1, h: 1, x: 2, y: 0 },
  { id: "w4", type: "kpi", title: "Tỷ lệ chuyển đổi", w: 1, h: 1, x: 3, y: 0 },
  { id: "w5", type: "forecast", title: "Dự báo", w: 2, h: 2, x: 0, y: 1 },
  { id: "w6", type: "quota", title: "Mục tiêu tháng", w: 2, h: 2, x: 2, y: 1 },
  { id: "w7", type: "my-day", title: "Việc hôm nay", w: 2, h: 2, x: 0, y: 3 },
  { id: "w8", type: "saved-report", title: "Cần chú ý", w: 2, h: 2, x: 2, y: 3 },
];

interface Props {
  editable?: boolean;
}

export function DashboardGrid({ editable = false }: Props) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(dashboardLayout.widgets.length > 0 ? dashboardLayout.widgets : DEFAULT_WIDGETS);

  const goalData = useMemo(() => {
    const monthlyGoal = goals.find((g) => g.period === "month" && !g.isTeam);
    if (!monthlyGoal) return null;
    return { ...monthlyGoal, progress: goalProgress(monthlyGoal, deals) };
  }, []);

  const todayActivities = useMemo(() => {
    return activities.filter((a) => a.status === "pending").slice(0, 5);
  }, []);

  const attentionDeals = useMemo(() => {
    return deals.filter((d) => d.status === "open" && d.probability >= 50).slice(0, 5);
  }, []);

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case "kpi":
        return (
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {widget.title.includes("Doanh thu") && <DollarSign className="w-5 h-5 text-cta" />}
                {widget.title.includes("Lead") && <Users className="w-5 h-5 text-primary" />}
                {widget.title.includes("Deal") && <TrendingUp className="w-5 h-5 text-purple-500" />}
                {widget.title.includes("Chuyển") && <Target className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <p className="text-xl font-bold font-poppins text-text-dark">
                  {widget.title.includes("Doanh thu") && formatCurrency(dashboardStats.revenue)}
                  {widget.title.includes("Lead") && dashboardStats.totalLeads}
                  {widget.title.includes("Deal") && dashboardStats.totalDeals}
                  {widget.title.includes("Chuyển") && `${dashboardStats.conversionRate}%`}
                </p>
                <p className="text-xs text-text-muted">{widget.title}</p>
              </div>
            </div>
          </CardContent>
        );

      case "forecast":
        return <ForecastChart />;

      case "quota":
        return (
          <CardContent className="p-4">
            {goalData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-dark">Mục tiêu tháng</span>
                  <Target className="w-4 h-4 text-cta" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold font-poppins text-text-dark">
                    {formatCurrency(goalData.progress.actual)}
                  </p>
                  <p className="text-xs text-text-muted">
                    / {formatCurrency(goalData.target)}
                  </p>
                </div>
                <GoalProgress progress={goalData.progress} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                Chưa có mục tiêu
              </div>
            )}
          </CardContent>
        );

      case "my-day":
        return (
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-text-dark">
                <Calendar className="w-4 h-4" />
                Việc hôm nay
              </div>
              {todayActivities.length > 0 ? (
                <ul className="space-y-2">
                  {todayActivities.map((a) => (
                    <li key={a.id} className="text-sm text-text-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {a.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-muted">Không có việc nào</p>
              )}
            </div>
          </CardContent>
        );

      case "saved-report":
        return (
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-text-dark">
                <AlertCircle className="w-4 h-4" />
                Deal cần chú ý
              </div>
              {attentionDeals.length > 0 ? (
                <ul className="space-y-2">
                  {attentionDeals.map((d) => (
                    <li key={d.id} className="text-sm text-text-muted flex items-center justify-between">
                      <span className="truncate">{d.name}</span>
                      <span className="text-xs">{d.probability}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-muted">Không có deal nào</p>
              )}
            </div>
          </CardContent>
        );

      default:
        return <CardContent className="p-4 text-text-muted">Widget không xác định</CardContent>;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={`${
            widget.w === 2 ? "col-span-2" : "col-span-1"
          } ${widget.h === 2 ? "row-span-2" : "row-span-1"}`}
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            {widget.title && (
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
              </CardHeader>
            )}
            {renderWidget(widget)}
          </Card>
        </div>
      ))}
    </div>
  );
}