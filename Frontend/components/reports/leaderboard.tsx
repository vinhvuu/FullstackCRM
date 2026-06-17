"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deals, leads } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  name: string;
  revenue: number;
  dealsWon: number;
  rank: number;
}

export function Leaderboard({ periodKey }: { periodKey?: string }) {
  const entries = useMemo(() => {
    const userStats: Record<string, { name: string; revenue: number; dealsWon: number }> = {};

    deals.forEach((deal) => {
      if (deal.status === "won" && deal.wonAt) {
        if (!userStats[deal.ownerId]) {
          userStats[deal.ownerId] = { name: deal.ownerId, revenue: 0, dealsWon: 0 };
        }
        userStats[deal.ownerId].revenue += deal.value;
        userStats[deal.ownerId].dealsWon += 1;
      }
    });

    return Object.entries(userStats)
      .map(([userId, stats]) => ({
        userId,
        name: stats.name,
        revenue: stats.revenue,
        dealsWon: stats.dealsWon,
        rank: 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((entry, i) => ({ ...entry, rank: i + 1 }));
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="w-5 text-center text-text-muted">{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Bảng xếp hạng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                entry.rank <= 3 ? "bg-amber-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-dark truncate">{entry.name}</p>
                <p className="text-xs text-text-muted">{entry.dealsWon} deal thắng</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-text-dark">{formatCurrency(entry.revenue)}</p>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-sm text-text-muted text-center py-4">Chưa có dữ liệu</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}