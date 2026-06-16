# Detailed Implementation Plan: Kanban Board View

## Overview
Add a toggleable Kanban board view to the leads page, allowing users to view and manage leads in a drag-and-drop board organized by status columns.

---

## 1. UI/UX Design

### 1.1 Layout
```
+-----------------------------------------------------------+
|  [Table View] [Kanban View]              [Export] [+ Add] |
+-----------------------------------------------------------+
|  [Search...]              [Filter] [Quick Filters...]     |
+-----------------------------------------------------------+
|  +----------+ +----------+ +----------+ +----------+    |
|  |   NEW    | |CONTACTED | |QUALIFIED | |   LOST   |    |
|  | (5)      | | (3)      | | (4)      | | (2)      |    |
|  +----------+ +----------+ +----------+ +----------+    |
|  | [Card]   | | [Card]   | | [Card]   | | [Card]   |    |
|  | [Card]   | | [Card]   | | [Card]   | | [Card]   |    |
|  | [Card]   | | [Card]   | | [Card]   | |          |    |
|  |          | |          | |          | |          |    |
|  +----------+ +----------+ +----------+ +----------+    |
+-----------------------------------------------------------+
```

### 1.2 Column Headers
- Each column shows status name, lead count badge
- Column colors:
  - New: `#3B82F6` (blue)
  - Contacted: `#6366F1` (indigo)
  - Qualified: `#10B981` (green)
  - Lost: `#EF4444` (red)

### 1.3 Lead Card Design
```
+----------------------------------+
| [Avatar] Nguyễn Văn Minh         |
|          Công ty ABC             |
+----------------------------------+
| Score: 85  [=======    ]         |
| Source: Website    Assignee: HAn |
| [Tag] [Tag]                       |
+----------------------------------+
| [Mail] [Phone] [View] [Edit]     |
+----------------------------------+
```

### 1.4 Score Color Coding
- 70-100: Green (#10B981)
- 40-69: Yellow (#F59E0B)
- 0-39: Red (#EF4444)

---

## 2. Technical Design

### 2.1 Types

In `types/index.ts`:
```typescript
export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export type ViewMode = "table" | "kanban";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  score: number;
  createdAt: string;
  assignee: string;
  // ... existing fields
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  color: string;
  leads: Lead[];
}
```

### 2.2 Component Structure

#### `components/leads/lead-kanban.tsx`
- Main kanban board container
- Props:
  - `leads: Lead[]` - all leads
  - `onStatusChange: (leadId: string, newStatus: LeadStatus) => void`
  - `onEdit: (lead: Lead) => void`
  - `onMailClick?: (lead: Lead) => void`
- Uses `@dnd-kit/core` for drag-and-drop
- Renders 4 columns based on LeadStatus
- Handles drag start, drag over, drop events

#### `components/leads/lead-kanban-card.tsx`
- Individual lead card
- Props:
  - `lead: Lead`
  - `onEdit: (lead: Lead) => void`
  - `onMailClick?: (lead: Lead) => void`
  - `onStatusChange?: (newStatus: LeadStatus) => void`
- Renders: avatar, name, company, score bar, source, assignee, tags, action buttons

---

## 3. Dependencies

Add `@dnd-kit` packages for drag-and-drop:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Check `package.json` first to see if already installed.

---

## 4. File Changes

### 4.1 NEW Files

#### `components/leads/lead-kanban.tsx`
```typescript
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Lead, LeadStatus } from "@/types";
import { LeadKanbanColumn } from "./lead-kanban-column";
import { LeadKanbanCard } from "./lead-kanban-card";

interface LeadKanbanProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onEdit: (lead: Lead) => void;
  onMailClick?: (lead: Lead) => void;
}

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
  { id: "new", title: "New", color: "#3B82F6" },
  { id: "contacted", title: "Contacted", color: "#6366F1" },
  { id: "qualified", title: "Qualified", color: "#10B981" },
  { id: "lost", title: "Lost", color: "#EF4444" },
];

export function LeadKanban({ leads, onStatusChange, onEdit, onMailClick }: LeadKanbanProps) {
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
    acc[col.id] = leads.filter((lead) => lead.status === col.id);
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

    // Check if we're over a column
    const overColumn = COLUMNS.find((col) => col.id === overId);
    if (overColumn) {
      // Just drag over, don't change status yet
      return;
    }

    // Find the lead being dragged
    const activeLead = leads.find((l) => l.id === activeId);
    if (!activeLead) return;

    // Check if we're over another lead's column
    const overLead = leads.find((l) => l.id === overId);
    if (overLead && activeLead.status !== overLead.status) {
      onStatusChange(activeId, overLead.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
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
      <div className="grid grid-cols-4 gap-4">
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
```

#### `components/leads/lead-kanban-column.tsx`
```typescript
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
      className={`bg-gray-50 rounded-xl p-4 min-h-[500px] ${
        isOver ? "ring-2 ring-indigo-500 bg-indigo-50" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="font-semibold text-text-dark">{title}</h3>
        <span
          className="ml-auto bg-white px-2 py-0.5 rounded-full text-xs font-medium text-text-muted"
        >
          {leads.length}
        </span>
      </div>
      <SortableContext
        items={leads.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
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
        <div className="text-center py-8 text-text-muted text-sm">
          No leads
        </div>
      )}
    </div>
  );
}
```

#### `components/leads/lead-kanban-card.tsx`
```typescript
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/types";
import { LeadScore } from "./lead-score";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Eye, Edit, GripVertical } from "lucide-react";
import Link from "next/link";

interface LeadKanbanCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onMailClick?: (lead: Lead) => void;
  isDragging?: boolean;
}

export function LeadKanbanCard({
  lead,
  onEdit,
  onMailClick,
  isDragging = false,
}: LeadKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow ${
        isCurrentlyDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Avatar fallback={lead.name.charAt(0)} size="sm" />
            <div className="min-w-0">
              <p className="font-semibold text-text-dark text-sm truncate">
                {lead.name}
              </p>
              <p className="text-xs text-text-muted truncate">
                {lead.company}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-muted">Score</span>
              <span className="font-medium text-text-dark">{lead.score}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getScoreColor(lead.score)}`}
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
            <span>{lead.source}</span>
            <span className="truncate max-w-[80px]">{lead.assignee}</span>
          </div>

          <div className="mt-3 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7"
              onClick={() => onMailClick?.(lead)}
            >
              <Mail className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="w-7 h-7">
              <Phone className="w-3 h-3" />
            </Button>
            <Link href={`/leads/${lead.id}`} className="ml-auto">
              <Button variant="ghost" size="icon" className="w-7 h-7">
                <Eye className="w-3 h-3" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7"
              onClick={() => onEdit(lead)}
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4.2 MODIFY Files

#### `types/index.ts`
Add ViewMode type (if not exists):
```typescript
export type ViewMode = "table" | "kanban";
```

#### `app/(dashboard)/leads/page.tsx`
- Import LeadKanban component
- Add ViewMode state: `const [viewMode, setViewMode] = useState<ViewMode>("table");`
- Add view toggle buttons near the page title
- Conditionally render table vs kanban:
```tsx
<div className="flex items-center gap-1 mb-4">
  <Button
    variant={viewMode === "table" ? "default" : "outline"}
    size="sm"
    onClick={() => setViewMode("table")}
  >
    Table
  </Button>
  <Button
    variant={viewMode === "kanban" ? "default" : "outline"}
    size="sm"
    onClick={() => setViewMode("kanban")}
  >
    Kanban
  </Button>
</div>

// In return JSX:
{viewMode === "table" ? (
  <LeadTable ... />
) : (
  <LeadKanban
    leads={filteredLeads}
    onStatusChange={handleStatusChange}
    onEdit={handleEditLead}
    onMailClick={setActiveChatLead}
  />
)}
```

- Add status change handler:
```tsx
const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
  setLeads(leads.map(lead =>
    lead.id === leadId ? { ...lead, status: newStatus } : lead
  ));
};
```

---

## 5. Implementation Order

1. Add `@dnd-kit` packages to `package.json`
2. Update `types/index.ts` with `ViewMode` type
3. Create `lead-kanban-card.tsx`
4. Create `lead-kanban-column.tsx`
5. Create `lead-kanban.tsx`
6. Update `leads/page.tsx` with view toggle and kanban integration

---

## 6. Verification

- [ ] Toggle between table and kanban views works
- [ ] Drag lead card to another column updates its status
- [ ] Column shows correct lead count
- [ ] Empty column shows "No leads" message
- [ ] Score color coding works (green/yellow/red)
- [ ] All action buttons work (view, edit, mail, phone)
- [ ] Responsive: stack columns on mobile

---

## 7. Edge Cases

- Handle dragging when column is empty
- Prevent dragging to same column (no-op)
- Show loading state during drag
- Mobile: disable drag-and-drop, show tap-to-change-status menu