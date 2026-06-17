"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardStats, chartData, leads, deals, activities, quotes, reportDefs } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { ReportDef } from "@/types";
import { runReport } from "@/lib/analytics";
import { Download, TrendingUp, Users, Target, DollarSign, Plus, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table, Calculator } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const leadSourceData = leads.reduce((acc, lead) => {
  const source = lead.source;
  const existing = acc.find((item) => item.name === source);
  if (existing) {
    existing.value++;
  } else {
    acc.push({ name: source, value: 1 });
  }
  return acc;
}, [] as { name: string; value: number }[]);

const dealStageData = deals.reduce((acc, deal) => {
  const stage = deal.stage;
  const existing = acc.find((item) => item.name === stage);
  if (existing) {
    existing.value++;
  } else {
    acc.push({ name: stage, value: 1 });
  }
  return acc;
}, [] as { name: string; value: number }[]);

export default function ReportsPage() {
  const data = useMemo(() => ({ leads, deals, activities, quotes }), []);

  const presetCharts = useMemo(() => {
    return reportDefs.slice(0, 6).map((def) => ({
      def,
      data: runReport(def, data),
    }));
  }, [data]);

  const statsCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(dashboardStats.revenue),
      growth: dashboardStats.revenueGrowth,
      icon: DollarSign,
      color: "text-cta",
      bgColor: "bg-cta/10",
    },
    {
      label: "Conversion Rate",
      value: `${dashboardStats.conversionRate}%`,
      growth: dashboardStats.conversionGrowth,
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Total Leads",
      value: dashboardStats.totalLeads.toString(),
      growth: dashboardStats.leadsGrowth,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Deals",
      value: dashboardStats.totalDeals.toString(),
      growth: dashboardStats.dealsGrowth,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Reports</h1>
          <p className="text-text-muted mt-1">Analytics and insights for your sales performance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports/builder">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo báo cáo
            </Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Báo cáo nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetCharts.map(({ def, data: chartData }) => (
              <Card key={def.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{def.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {def.chartType === "bar" ? (
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Bar dataKey="value" fill={COLORS[0]} radius={[2, 2, 0, 0]} />
                        </BarChart>
                      ) : def.chartType === "line" ? (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Line type="monotone" dataKey="value" stroke={COLORS[0]} dot={false} />
                        </LineChart>
                      ) : def.chartType === "pie" ? (
                        <PieChart>
                          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={50}>
                            {chartData.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      ) : def.chartType === "table" ? (
                        <div className="overflow-auto text-xs">
                          <table className="w-full">
                            <tbody>
                              {chartData.slice(0, 5).map((row, i) => (
                                <tr key={i} className="border-b">
                                  <td className="py-1">{row.name}</td>
                                  <td className="text-right">{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-2xl font-bold text-primary">
                            {chartData.reduce((s, r) => s + r.value, 0).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-cta">+{stat.growth}%</span>
              </div>
              <p className="text-2xl font-bold font-poppins text-text-dark mt-4">
                {stat.value}
              </p>
              <p className="text-sm text-text-muted mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="deals"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ fill: "#6366F1", strokeWidth: 2 }}
                    name="Deals"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads vs Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="leads" fill="#6366F1" radius={[4, 4, 0, 0]} name="Leads" />
                  <Bar dataKey="deals" fill="#10B981" radius={[4, 4, 0, 0]} name="Deals" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Stages Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealStageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {dealStageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
