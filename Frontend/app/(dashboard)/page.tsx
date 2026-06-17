"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardStats, recentDeals, aiInsights, chartData } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Lightbulb,
  AlertCircle,
  Clock,
  Zap,
  Briefcase,
  CalendarDays,
  ChevronRight,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const stats = [
  {
    label: "Total Leads",
    value: dashboardStats.totalLeads,
    growth: dashboardStats.leadsGrowth,
    icon: Users,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500",
  },
  {
    label: "Active Deals",
    value: dashboardStats.totalDeals,
    growth: dashboardStats.dealsGrowth,
    icon: Briefcase,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
  },
  {
    label: "Revenue",
    value: dashboardStats.revenue,
    growth: dashboardStats.revenueGrowth,
    icon: DollarSign,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    isCurrency: true,
  },
  {
    label: "Conversion Rate",
    value: dashboardStats.conversionRate,
    growth: dashboardStats.conversionGrowth,
    icon: Target,
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    isPercent: true,
  },
];

function StatCard({
  label,
  value,
  growth,
  icon: Icon,
  color,
  bgColor,
  isCurrency,
  isPercent,
}: (typeof stats)[0]) {
  const isPositive = growth > 0;

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor}/5 to-transparent`} />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${bgColor}/10 to-${bgColor}/5 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {Math.abs(growth)}%
          </div>
        </div>
        <div className="mt-5">
          <p className="text-3xl font-bold font-poppins bg-gradient-to-r from-text-dark to-text-dark/70 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300 bg-clip-text text-transparent">
            {isCurrency
              ? formatCurrency(value)
              : isPercent
              ? `${value}%`
              : formatNumber(value)}
          </p>
          <p className="text-sm text-text-muted mt-1.5 font-medium">{label}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </CardContent>
    </Card>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function AITransformationScore() {
  const score = 78;
  const scoreData = [
    { month: "T1", score: 65 },
    { month: "T2", score: 68 },
    { month: "T3", score: 72 },
    { month: "T4", score: 70 },
    { month: "T5", score: 75 },
    { month: "T6", score: 78 },
  ];

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-0">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <CardContent className="p-8 relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/90">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">AI Transformation Score</span>
            </div>
            <div className="mt-4">
              <span className="text-6xl font-bold text-white font-poppins">{score}</span>
              <span className="text-2xl text-white/70">/100</span>
            </div>
            <p className="text-white/70 text-sm mt-2">+13 điểm so với tháng trước</p>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${score * 2.83} 283`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        <div className="mt-6 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scoreData}>
              <Area
                type="monotone"
                dataKey="score"
                stroke="rgba(255,255,255,0.8)"
                fill="rgba(255,255,255,0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function AIInsightsPanel() {
  const getIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-amber-500";
      default:
        return "border-l-indigo-500";
    }
  };

  const getBgColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50/50 hover:bg-red-50";
      case "medium":
        return "bg-amber-50/50 hover:bg-amber-50";
      default:
        return "bg-indigo-50/50 hover:bg-indigo-50";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          AI Insights
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-2xl border-l-4 ${getBorderColor(
                insight.priority
              )} ${getBgColor(insight.priority)} hover:shadow-md transition-all duration-200 cursor-pointer group`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(insight.priority)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-dark text-sm group-hover:text-indigo-600 transition-colors">
                    {insight.title}
                  </h4>
                  <p className="text-text-muted text-xs mt-1 line-clamp-2">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TrendChart() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100">
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            Leads & Deals Trend
          </CardTitle>
          <p className="text-xs text-text-muted mt-1">Performance over 6 months</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-xs text-text-muted">Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-text-muted">Deals</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  padding: "12px 16px",
                }}
                itemStyle={{ fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#6366F1"
                strokeWidth={3}
                fill="url(#colorLeads)"
                name="Leads"
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="deals"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#colorDeals)"
                name="Deals"
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentDealsTable() {
  const getStageBadge = (stage: string) => {
    const variants: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
      negotiation: "warning",
      proposal: "info",
      qualified: "default",
      lead: "default",
      won: "success",
      lost: "error",
    };
    return variants[stage] || "default";
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      negotiation: "from-amber-500/10 to-amber-500/5",
      proposal: "from-blue-500/10 to-blue-500/5",
      qualified: "from-indigo-500/10 to-indigo-500/5",
      lead: "from-gray-500/10 to-gray-500/5",
      won: "from-emerald-500/10 to-emerald-500/5",
      lost: "from-red-500/10 to-red-500/5",
    };
    return colors[stage] || "from-gray-500/10 to-gray-500/5";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100">
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            Recent Deals
          </CardTitle>
          <p className="text-xs text-text-muted mt-1">{recentDeals.length} deals tracked</p>
        </div>
        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDeals.map((deal) => (
            <div
              key={deal.id}
              className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${getStageColor(
                deal.stage
              )} hover:shadow-md transition-all duration-200 cursor-pointer group`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark group-hover:text-indigo-600 transition-colors">
                    {deal.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CalendarDays className="w-3.5 h-3.5 text-text-muted" />
                    <p className="text-xs text-text-muted">
                      Expected close: {deal.expectedCloseDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-text-dark group-hover:text-indigo-600 transition-colors">
                  {formatCurrency(deal.value)}
                </p>
                <Badge variant={getStageBadge(deal.stage)} className="mt-1.5 capitalize text-xs">
                  {deal.stage}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    { icon: Users, label: "Add Lead", color: "bg-indigo-500" },
    { icon: Briefcase, label: "New Deal", color: "bg-emerald-500" },
    { icon: CalendarDays, label: "Schedule", color: "bg-purple-500" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-200 group cursor-pointer"
            >
              <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-text-dark">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-text-muted mt-1">Welcome back! Here&apos;s your sales overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Updates
          </div>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Analysis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AITransformationScore />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div>
          <AIInsightsPanel />
        </div>
      </div>

      <RecentDealsTable />
    </div>
  );
}