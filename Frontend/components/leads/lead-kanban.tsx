"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Lead, LeadStatus, ViewMode } from "@/types";
import { LeadKanbanColumn } from "./lead-kanban-column";
import { LeadKanbanCard } from "./lead-kanban-card";

interface LeadKanbanProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onReorder: (leadId: string, newStatus: LeadStatus, newOrder: number) => void;
  onEdit: (lead: Lead) => void;
  onMailClick?: (lead: Lead) => void;
}

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
  { id: "new", title: "New", color: "#3B82F6" },
  { id: "contacted", title: "Contacted", color: "#6366F1" },
  { id: "qualified", title: "Qualified", color: "#10B981" },
  { id: "lost", title: "Lost", color: "#EF4444" },
];

export function LeadKanban({ leads, onStatusChange, onReorder, onEdit, onMailClick }: LeadKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const leadsByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = leads.filter((lead) => lead.status === col.id).sort((a, b) => (a.order || 0) - (b.order || 0));
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeLead = leads.find((l) => l.id === activeId);
    if (!activeLead) return;

    const overColumn = COLUMNS.find((col) => col.id === overId);
    if (overColumn) {
      if (activeLead.status !== overColumn.id) {
        onStatusChange(activeId, overColumn.id);
      }
      return;
    }

    const overLead = leads.find((l) => l.id === overId);
    if (overLead && activeLead.status !== overLead.status) {
      onStatusChange(activeId, overLead.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeLead = leads.find((l) => l.id === activeId);
    if (!activeLead) return;

    const overColumn = COLUMNS.find((col) => col.id === overId);
    if (overColumn) {
      const columnLeads = leadsByStatus[overColumn.id];
      const newOrder = columnLeads.length;
      onReorder(activeId, overColumn.id, newOrder);
      return;
    }

    const overLead = leads.find((l) => l.id === overId);
    if (overLead) {
      const columnLeads = leadsByStatus[overLead.status];
      const overIndex = columnLeads.findIndex(l => l.id === overId);
      onReorder(activeId, overLead.status, overIndex);
    }
  };

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <LeadKanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            leads={leadsByStatus[column.id]}
            onEdit={onEdit}
            onMailClick={onMailClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <LeadKanbanCard
            lead={activeLead}
            onEdit={onEdit}
            onMailClick={onMailClick}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}