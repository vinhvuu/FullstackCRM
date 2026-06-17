"use client";

import { Button } from "@/components/ui/button";
import { Users, Layers, X, LogOut } from "lucide-react";

interface LeadBulkActionBarProps {
  selectedCount: number;
  onAssign: () => void;
  onMoveToPool?: () => void;
  onRemoveFromPool?: () => void;
  onClearSelection: () => void;
}

export function LeadBulkActionBar({
  selectedCount,
  onAssign,
  onMoveToPool,
  onRemoveFromPool,
  onClearSelection,
}: LeadBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-between px-4 py-3 bg-primary text-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        <span className="font-medium">{selectedCount} lead đã chọn</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onAssign} className="bg-white/20 text-white hover:bg-white/30">
          <Users className="w-4 h-4 mr-2" />
          Gán cho
        </Button>
        {onMoveToPool && (
          <Button variant="secondary" size="sm" onClick={onMoveToPool} className="bg-white/20 text-white hover:bg-white/30">
            <Layers className="w-4 h-4 mr-2" />
            Đẩy vào pool
          </Button>
        )}
        {onRemoveFromPool && (
          <Button variant="secondary" size="sm" onClick={onRemoveFromPool} className="bg-white/20 text-white hover:bg-white/30">
            <LogOut className="w-4 h-4 mr-2" />
            Gỡ khỏi pool
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-white hover:bg-white/20">
          <X className="w-4 h-4 mr-1" />
          Bỏ chọn
        </Button>
      </div>
    </div>
  );
}