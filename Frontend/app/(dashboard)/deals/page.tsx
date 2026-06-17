"use client";

import { useState, useMemo } from "react";
import { deals as initialDeals } from "@/lib/mock-data";
import { Deal, DealStage } from "@/types";
import { PIPELINES } from "@/lib/constants";
import { isRotting } from "@/lib/deals";
import { PipelineBoard } from "@/components/deals/pipeline-board";
import { PipelineSelector } from "@/components/deals/pipeline-selector";
import { DealForm } from "@/components/deals/deal-form";
import { Button } from "@/components/ui/button";
import { Plus, Download, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activePipeline, setActivePipeline] = useState(PIPELINES[0].id);
  const [showRotting, setShowRotting] = useState(false);

  const filteredDeals = useMemo(() => {
    let list = deals.filter((d) => !d.status || d.status === "open");
    if (showRotting) list = list.filter((d) => isRotting(d));
    return list;
  }, [deals, showRotting]);

  const rottingCount = useMemo(() => deals.filter((d) => isRotting(d)).length, [deals]);

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedDeal(null);
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDeals([...deals, newDeal]);
    handleCloseModal();
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(deals.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
    handleCloseModal();
  };

  const handleDragEnd = (dealId: string, newStage: DealStage) => {
    setDeals(
      deals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Deals</h1>
          <p className="text-text-muted mt-1">Quản lý pipeline bán hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button variant="cta" className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedDeal ? "Chỉnh sửa Deal" : "Thêm Deal mới"}
                </DialogTitle>
              </DialogHeader>
              <DealForm
                deal={selectedDeal}
                onClose={handleCloseModal}
                onSubmit={selectedDeal ? handleUpdateDeal : handleAddDeal}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PipelineSelector value={activePipeline} onChange={setActivePipeline} />
        <div className="h-5 w-px bg-gray-200" />
        <button
          type="button"
          onClick={() => setShowRotting((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showRotting
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-text-muted hover:bg-gray-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Cần chú ý
          {rottingCount > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${showRotting ? "bg-orange-200" : "bg-orange-100 text-orange-600"}`}>
              {rottingCount}
            </span>
          )}
        </button>
      </div>

      <PipelineBoard deals={filteredDeals} onDragEnd={handleDragEnd} onEdit={handleEditDeal} />
    </div>
  );
}
