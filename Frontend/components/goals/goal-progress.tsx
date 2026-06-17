"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  progress: { actual: number; pct: number; pace: number; daysLeft: number };
}

export function GoalProgress({ progress }: Props) {
  const { pct, pace, daysLeft } = progress;

  const getPaceColor = () => {
    if (pace > 1.1) return "text-green-500";
    if (pace < 0.9) return "text-red-500";
    return "text-amber-500";
  };

  const getPaceIcon = () => {
    if (pace > 1.1) return TrendingUp;
    if (pace < 0.9) return TrendingDown;
    return Minus;
  };

  const PaceIcon = getPaceIcon();

  return (
    <div className="space-y-2">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            pct >= 100 ? "bg-green-500" : pct >= 75 ? "bg-primary" : pct >= 50 ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${getPaceColor()} flex items-center gap-1`}>
          <PaceIcon className="w-3 h-3" />
          {pace > 1.1 ? "Vượt đà" : pace < 0.9 ? "Chậm đà" : "Đúng đà"}
        </span>
        <span className="text-text-muted">{daysLeft} ngày còn lại</span>
      </div>
    </div>
  );
}