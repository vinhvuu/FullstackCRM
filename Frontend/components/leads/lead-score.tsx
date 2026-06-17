"use client";

import { cn } from "@/lib/utils";

interface LeadScoreProps {
  score: number;
  className?: string;
}

export function LeadScore({ score, className }: LeadScoreProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-cta bg-cta/10";
    if (score >= 60) return "text-primary bg-primary/10";
    if (score >= 40) return "text-yellow-500 bg-yellow-100";
    return "text-red-500 bg-red-100";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm",
          getColor(score)
        )}
      >
        {score}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-text-muted">AI Score</span>
        <div className="flex gap-0.5 mt-0.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i < Math.floor(score / 20)
                  ? score >= 80
                    ? "bg-cta"
                    : score >= 60
                    ? "bg-primary"
                    : score >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
                  : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
