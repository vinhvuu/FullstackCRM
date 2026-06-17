"use client";

import { Users, Layers, Zap, CalendarCheck } from "lucide-react";
import { DistributionSummary } from "@/types";

interface DistributionSummaryCardsProps {
  summary: DistributionSummary | null;
  loading: boolean;
}

export function DistributionSummaryCards({ summary, loading }: DistributionSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Chưa gán",
      value: summary?.unassignedCount || 0,
      icon: Users,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "Trong pool",
      value: summary?.poolCount || 0,
      icon: Layers,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Luật đang bật",
      value: summary?.activeRuleCount || 0,
      icon: Zap,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Gán hôm nay",
      value: summary?.assignedTodayCount || 0,
      icon: CalendarCheck,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-sm text-text-muted">{card.label}</p>
              <p className="text-2xl font-bold text-text-dark">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}