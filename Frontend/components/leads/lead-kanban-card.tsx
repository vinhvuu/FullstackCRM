"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  const getScoreTextColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow ${
        isCurrentlyDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {lead.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-text-dark text-sm truncate">
                {lead.name}
              </p>
              <p className="text-xs text-text-muted truncate">
                {lead.company}
              </p>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-muted">Score</span>
              <span className={`font-semibold ${getScoreTextColor(lead.score)}`}>
                {lead.score}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getScoreColor(lead.score)}`}
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <span className="truncate">{lead.source}</span>
            <span className="truncate max-w-[70px]">{lead.assignee}</span>
          </div>

          <div className="flex items-center gap-0.5">
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
            <Link href={`/leads/${lead.id}`}>
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