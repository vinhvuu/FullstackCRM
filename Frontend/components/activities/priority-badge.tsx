"use client";

import { ActivityPriority } from "@/types";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const priorityVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        high: "bg-red-100 text-red-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-green-100 text-green-700",
      },
    },
    defaultVariants: {
      variant: "medium",
    },
  }
);

interface PriorityBadgeProps extends VariantProps<typeof priorityVariants> {
  priority: ActivityPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const labels: Record<ActivityPriority, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <span className={cn(priorityVariants({ variant: priority }), className)}>
      {labels[priority]}
    </span>
  );
}