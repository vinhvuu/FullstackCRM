"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Lead, LeadStatus } from "@/types";
import { LeadKanbanCard } from "./lead-kanban-card";

interface LeadKanbanColumnProps {
  id: LeadStatus;
  title: string;
  color: string;
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onMailClick?: (lead: Lead) => void;
}

export function LeadKanbanColumn({
  id,
  title,
  color,
  leads,
  onEdit,
  onMailClick,
}: LeadKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-xl p-3 min-h-[500px] flex flex-col ${
        isOver ? "ring-2 ring-indigo-500 bg-indigo-50" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="font-semibold text-text-dark">{title}</h3>
        <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-xs font-medium text-text-muted">
          {leads.length}
        </span>
      </div>
      <SortableContext
        items={leads.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 flex-1 overflow-y-auto">
          {leads.map((lead) => (
            <LeadKanbanCard
              key={lead.id}
              lead={lead}
              onEdit={onEdit}
              onMailClick={onMailClick}
            />
          ))}
        </div>
      </SortableContext>
      {leads.length === 0 && (
        <div className="flex-1 flex items-center justify-center min-h-[100px]">
          <p className="text-text-muted text-sm">Drop leads here</p>
        </div>
      )}
    </div>
  );
}