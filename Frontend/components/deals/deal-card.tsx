"use client";

import { useState } from "react";
import { Deal, DealStage } from "@/types";
import { DEAL_STAGES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { isRotting } from "@/lib/deals";
import { DealScore } from "./deal-score";
import { DealRottingBadge } from "./deal-rotting-badge";
import { GripVertical, Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DealCardProps {
  deal: Deal;
  onDragEnd: (dealId: string, newStage: DealStage) => void;
  onEdit: (deal: Deal) => void;
}

export function DealCard({ deal, onDragEnd, onEdit }: DealCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("dealId", deal.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    const target = e.target as HTMLElement;
    const newStage = target.closest("[data-stage]")?.getAttribute("data-stage") as DealStage;
    if (newStage && newStage !== deal.stage) {
      onDragEnd(deal.id, newStage);
    }
  };

  const stageColor = DEAL_STAGES.find((s) => s.id === deal.stage)?.color || "#6366F1";

  return (
    <Card
      className={cn(
        "p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md",
        isDragging && "opacity-50 scale-95"
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-text-muted" />
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: stageColor }}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 -mr-1 -mt-1"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(deal);
          }}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex items-start gap-2 mb-2">
        <h4 className="font-semibold text-text-dark text-sm line-clamp-2 flex-1">
          {deal.title}
        </h4>
        {isRotting(deal) && <DealRottingBadge />}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-lg font-bold text-primary">
          {formatCurrency(deal.value)}
        </p>
        <DealScore score={deal.probability} />
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Calendar className="w-3 h-3" />
        <span>Close: {deal.expectedCloseDate}</span>
      </div>
    </Card>
  );
}
