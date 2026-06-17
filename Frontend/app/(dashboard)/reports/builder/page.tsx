"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DIMENSIONS, MEASURES, CHART_COLORS } from "@/lib/constants";
import { runReport, drilldown, ReportRow } from "@/lib/analytics";
import { leads, deals, activities, quotes, reportDefs } from "@/lib/mock-data";
import { ReportEntity, ChartType, ReportDef } from "@/types";
import { ReportChart } from "@/components/reports/report-chart";
import { ReportFilters } from "@/components/reports/report-filters";
import { DrilldownTable } from "@/components/reports/drilldown-table";
import {
  ArrowLeft,
  Save,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table,
  Calculator,
} from "lucide-react";
import Link from "next/link";

const DEFAULT_DEF: Partial<ReportDef> = {
  entity: "deal",
  chartType: "bar",
  dimension: "stage",
  measure: "sum_value",
  filters: {},
};

export default function ReportBuilderPage() {
  const [def, setDef] = useState<ReportDef>({
    id: "new",
    name: "Báo cáo mới",
    ...DEFAULT_DEF,
  } as ReportDef);

  const [drilldownBucket, setDrilldownBucket] = useState<string | null>(null);

  const data = useMemo(
    () => ({
      leads,
      deals,
      activities,
      quotes,
    }),
    [],
  );

  const chartData = useMemo(() => {
    if (!def.entity || !def.dimension || !def.measure) return [];
    return runReport(def, data);
  }, [def, data]);

  const drilldownData = useMemo(() => {
    if (!drilldownBucket || !def.entity || !def.dimension) return [];
    return drilldown(def, drilldownBucket, data);
  }, [drilldownBucket, def, data]);

  const update = (updates: Partial<ReportDef>) => {
    setDef((prev) => ({ ...prev, ...updates, id: prev.id || "new" }));
  };

  const chartTypes: { id: ChartType; label: string; icon: typeof BarChart3 }[] =
    [
      { id: "bar", label: "Cột", icon: BarChart3 },
      { id: "line", label: "Đường", icon: LineChartIcon },
      { id: "pie", label: "Tròn", icon: PieChartIcon },
      { id: "table", label: "Bảng", icon: Table },
      { id: "kpi", label: "KPI", icon: Calculator },
    ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-poppins text-text-dark">
              Tạo báo cáo
            </h1>
            <p className="text-text-muted mt-1">Xây dựng báo cáo tùy chỉnh</p>
          </div>
        </div>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Lưu báo cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cấu hình</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-text-muted">Tên báo cáo</Label>
              <input
                type="text"
                value={def.name}
                onChange={(e) => update({ name: e.target.value })}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-text-muted">Đối tượng</Label>
              <Select
                value={def.entity}
                onValueChange={(v) =>
                  update({
                    entity: v as ReportEntity,
                    dimension: "",
                    measure: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deal">Deal</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="activity">Hoạt động</SelectItem>
                  <SelectItem value="quote">Báo giá</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-text-muted">Loại biểu đồ</Label>
              <div className="grid grid-cols-3 gap-2">
                {chartTypes.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => update({ chartType: ct.id })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-md border text-xs transition-colors ${
                      def.chartType === ct.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-input hover:bg-gray-50"
                    }`}
                  >
                    <ct.icon className="w-4 h-4" />
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-text-muted">
                Chiều (Dimension)
              </Label>
              <Select
                value={def.dimension || ""}
                onValueChange={(v) => update({ dimension: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chiều" />
                </SelectTrigger>
                <SelectContent>
                  {(
                    DIMENSIONS[def.entity as keyof typeof DIMENSIONS] || []
                  ).map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-text-muted">
                Đo lường (Measure)
              </Label>
              <Select
                value={def.measure || ""}
                onValueChange={(v) => update({ measure: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đo lường" />
                </SelectTrigger>
                <SelectContent>
                  {(MEASURES[def.entity as keyof typeof MEASURES] || []).map(
                    (m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <ReportFilters
              entity={def.entity}
              filters={def.filters}
              onChange={(filters) => update({ filters })}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {def.name || "Xem trước"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReportChart
              data={chartData}
              chartType={def.chartType}
              measure={def.measure}
              onBarClick={(name) => setDrilldownBucket(name)}
            />
          </CardContent>
        </Card>
      </div>

      {drilldownBucket && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Chi tiết: {drilldownBucket}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DrilldownTable
              records={drilldownData}
              entity={def.entity}
              onClose={() => setDrilldownBucket(null)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
