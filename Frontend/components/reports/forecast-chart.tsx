"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deals } from "@/lib/mock-data";
import { forecast } from "@/lib/forecast";
import { formatCurrency } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const bucketLabels: Record<string, string> = {
  committed: "Cam kết",
  best_case: "Tốt nhất",
  pipeline: "Pipeline",
};

export function ForecastChart({ periodKey }: { periodKey?: string }) {
  const period = periodKey || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  const data = useMemo(() => {
    return forecast(deals, period).map((b) => ({
      name: bucketLabels[b.category],
      value: b.value,
    }));
  }, [period]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Dự báo ({period})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barSize={32}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} width={80} />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-3 pt-3 border-t text-sm">
          <span className="text-text-muted">Tổng pipeline</span>
          <span className="font-semibold text-text-dark">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}