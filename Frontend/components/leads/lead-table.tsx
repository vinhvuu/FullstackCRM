"use client";

import { Lead, SortField, SortDirection } from "@/types";
import { LeadScore } from "./lead-score";
import { LeadTags } from "./lead-tags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Phone, Mail, MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onMailClick?: (lead: Lead) => void;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  sort?: { field: SortField; direction: SortDirection };
  onSortChange?: (field: SortField) => void;
}

export function LeadTable({ 
  leads, 
  onEdit, 
  onMailClick,
  selectedIds,
  onSelect,
  onSelectAll,
  sort,
  onSortChange,
}: LeadTableProps) {
  const getStatusBadge = (status: Lead["status"]) => {
    const variants: Record<Lead["status"], "default" | "success" | "warning" | "error" | "info"> = {
      new: "info",
      contacted: "default",
      qualified: "success",
      lost: "error",
    };
    const labels: Record<Lead["status"], string> = {
      new: "New",
      contacted: "Contacted",
      qualified: "Qualified",
      lost: "Lost",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const allSelected = leads.length > 0 && selectedIds.length === leads.length;

  const handleSort = (field: SortField) => {
    onSortChange?.(field);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort?.field !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-300" />;
    }
    return (
      <ArrowUpDown className={`w-4 h-4 ml-1 ${sort.direction === "asc" ? "text-primary" : "text-primary"}`} />
    );
  };

  const HeaderCell = ({ field, label }: { field: SortField; label: string }) => (
    <th 
      className="text-left px-6 py-4 text-sm font-semibold text-text-dark cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-4 text-sm font-semibold text-text-dark w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <HeaderCell field="name" label="Lead" />
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-dark">
                Tags
              </th>
              <HeaderCell field="source" label="Source" />
              <HeaderCell field="status" label="Status" />
              <HeaderCell field="score" label="Score" />
              <HeaderCell field="createdAt" label="Date" />
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-dark">
                Assignee
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-text-dark">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                  selectedIds.includes(lead.id) ? "bg-indigo-50/50" : ""
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(lead.id)}
                    onChange={() => onSelect(lead.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-text-dark">{lead.name}</p>
                    <p className="text-sm text-text-muted">{lead.company}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <LeadTags tags={lead.tags} size="sm" />
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{lead.source}</td>
                <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                <td className="px-6 py-4">
                  <LeadScore score={lead.score} />
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{lead.assignee}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                      onClick={() => onMailClick?.(lead)}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" asChild>
                          <Link href={`/leads/${lead.id}`}>
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => onEdit(lead)}>
                          <Edit className="w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">No leads found</p>
        </div>
      )}
    </div>
  );
}