"use client";

import { cn } from "@/lib/utils";

interface DealScoreProps {
  score: number;
  className?: string;
}

export function DealScore({ score, className }: DealScoreProps) {
  const getColor = (score: number) => {
    if (score >= 75) return "text-cta bg-cta/10";
    if (score >= 50) return "text-primary bg-primary/10";
    if (score >= 25) return "text-yellow-500 bg-yellow-100";
    return "text-red-500 bg-red-100";
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span
        className={cn(
          "px-2 py-1 rounded-lg text-xs font-semibold",
          getColor(score)
        )}
      >
        {score}%
      </span>
      <span className="text-xs text-text-muted">win</span>
    </div>
  );
}
