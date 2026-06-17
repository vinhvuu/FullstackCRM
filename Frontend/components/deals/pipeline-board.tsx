"use client";

import { Deal, DealStage } from "@/types";
import { DEAL_STAGES } from "@/lib/constants";
import { DealCard } from "./deal-card";
import { cn } from "@/lib/utils";

interface PipelineBoardProps {
  deals: Deal[];
  onDragEnd: (dealId: string, newStage: DealStage) => void;
  onEdit: (deal: Deal) => void;
}

export function PipelineBoard({ deals, onDragEnd, onEdit }: PipelineBoardProps) {
  const getDealsByStage = (stage: DealStage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageValue = (stage: DealStage) => {
    return deals
      .filter((deal) => deal.stage === stage)
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {DEAL_STAGES.map((stage) => {
        const stageDeals = getDealsByStage(stage.id as DealStage);
        const stageValue = getStageValue(stage.id as DealStage);

        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
          >
            <div className="sticky top-0 bg-background z-10 pb-4">
              <div
                className="rounded-xl p-3 mb-4"
                style={{ backgroundColor: `${stage.color}15` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="font-semibold text-text-dark">{stage.label}</h3>
                  </div>
                  <span className="text-sm font-medium text-text-muted">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-sm font-bold" style={{ color: stage.color }}>
                  {formatCurrency(stageValue)} VND
                </p>
              </div>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {stageDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onDragEnd={onDragEnd}
                  onEdit={onEdit}
                />
              ))}

              {stageDeals.length === 0 && (
                <div className="flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-gray-200 text-text-muted text-sm">
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
