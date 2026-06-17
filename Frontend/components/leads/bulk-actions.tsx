"use client";

import { Lead, LeadStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2, User, CheckCircle, X } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  selectedIds: string[];
  leads: Lead[];
  onDelete: (ids: string[]) => void;
  onChangeStatus: (ids: string[], status: LeadStatus) => void;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedCount,
  selectedIds,
  leads,
  onDelete,
  onChangeStatus,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  const handleStatusChange = (status: LeadStatus) => {
    onChangeStatus(selectedIds, status);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-text-dark text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
      <span className="font-medium">{selectedCount} selected</span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={() => handleStatusChange("new")}
        >
          New
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={() => handleStatusChange("contacted")}
        >
          Contacted
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={() => handleStatusChange("qualified")}
        >
          Qualified
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={() => handleStatusChange("lost")}
        >
          Lost
        </Button>
      </div>
      <div className="w-px h-6 bg-white/30" />
      <Button
        size="sm"
        variant="ghost"
        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
        onClick={() => onDelete(selectedIds)}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/20"
        onClick={onClearSelection}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}