"use client";

import { ReportRow } from "@/lib/analytics";
import { ChartType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Props {
  data: ReportRow[];
  chartType: ChartType;
  measure: string;
  onBarClick?: (name: string) => void;
}

const tooltipStyle = {
  borderRadius: "12px",
  border: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

function isCurrency(measure: string) {
  return measure === "sum_value" || measure === "weighted_value";
}

export function ReportChart({ data, chartType, measure, onBarClick }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">
        Không có dữ liệu
      </div>
    );
  }

  if (chartType === "kpi") {
    const total = data.reduce((s, r) => s + r.value, 0);
    return (
      <div className="flex items-center justify-center h-[280px]">
        <div className="text-center">
          <p className="text-5xl font-bold text-primary font-poppins">
            {isCurrency(measure) ? formatCurrency(total) : total.toLocaleString("vi-VN")}
          </p>
          <p className="text-text-muted mt-2">{data.length} nhóm</p>
        </div>
      </div>
    );
  }

  if (chartType === "table") {
    return (
      <div className="overflow-auto max-h-[280px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white border-b">
            <tr>
              <th className="text-left py-2 px-3 font-medium text-text-muted">Nhóm</th>
              <th className="text-right py-2 px-3 font-medium text-text-muted">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => onBarClick?.(row.name)}
              >
                <td className="py-2 px-3">{row.name}</td>
                <td className="py-2 px-3 text-right font-medium">
                  {isCurrency(measure) ? formatCurrency(row.value) : row.value.toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const fmtY = (v: number) =>
    isCurrency(measure) ? `${(v / 1_000_000).toFixed(0)}M` : v.toString();

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            onClick={(entry) => onBarClick?.(entry.name as string)}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => isCurrency(measure) ? formatCurrency(v) : v} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748B" }} tickFormatter={fmtY} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => isCurrency(measure) ? formatCurrency(v) : v} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ fill: CHART_COLORS[0] }} name="Giá trị" onClick={(p) => onBarClick?.(p.name as string)} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // default: bar
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} onClick={(e) => e?.activeLabel && onBarClick?.(e.activeLabel as string)}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
        <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={fmtY} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => isCurrency(measure) ? formatCurrency(v) : v} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Giá trị">
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
