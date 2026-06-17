"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Users } from "lucide-react";
import { SavedView, RecordType } from "@/types";
import { getSavedViews } from "@/lib/saved-views";

interface SavedViewTabsProps {
  entity: RecordType;
  currentViewId?: string;
  onViewChange: (view: SavedView | null) => void;
  onSaveView?: () => void;
}

const CURRENT_USER_ID = "1";

export function SavedViewTabs({ entity, currentViewId, onViewChange, onSaveView }: SavedViewTabsProps) {
  const [views] = useState<SavedView[]>(() => getSavedViews(CURRENT_USER_ID, entity));

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant={!currentViewId ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(null)}
        >
          All
        </Button>
        {views.map((view) => (
          <Button
            key={view.id}
            variant={currentViewId === view.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view)}
            className="gap-1"
          >
            {view.name}
            {view.isShared && <Users className="w-3 h-3" />}
          </Button>
        ))}
      </div>
      {onSaveView && (
        <Button variant="ghost" size="sm" onClick={onSaveView} className="gap-1">
          <Plus className="w-3 h-3" />
          Save
        </Button>
      )}
    </div>
  );
}