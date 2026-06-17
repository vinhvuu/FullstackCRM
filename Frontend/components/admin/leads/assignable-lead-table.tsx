"use client";

import { useState } from "react";
import { Lead } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";

interface LeadAssignmentFiltersProps {
  filters: {
    search: string;
    source: string;
    status: string;
  };
  onChange: (filters: { search: string; source: string; status: string }) => void;
  onClear: () => void;
}

const SOURCE_OPTIONS = [
  { value: "all", label: "Tất cả nguồn" },
  { value: "Website", label: "Website" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Facebook", label: "Facebook" },
  { value: "Referral", label: "Referral" },
  { value: "Zalo", label: "Zalo" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "new", label: "Mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "qualified", label: "Đã qualify" },
];

export function LeadAssignmentFilters({
  filters,
  onChange,
  onClear,
}: LeadAssignmentFiltersProps) {
  const hasFilters = filters.search || filters.source !== "all" || filters.status !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input
          placeholder="Tìm theo tên, công ty, email..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <select
        value={filters.source}
        onChange={(e) => onChange({ ...filters, source: e.target.value })}
        className="px-3 py-2 rounded-md border border-gray-300 text-sm"
      >
        {SOURCE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="px-3 py-2 rounded-md border border-gray-300 text-sm"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-text-muted">
          <X className="w-4 h-4 mr-1" />
          Xóa
        </Button>
      )}
    </div>
  );
}

interface LeadTableProps {
  leads: Lead[];
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  loading: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Đã qualify",
  lost: "Thất bại",
};

export function AssignableLeadTable({
  leads,
  selectedIds,
  onSelect,
  onSelectAll,
  loading,
}: LeadTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Không có lead phù hợp bộ lọc</p>
      </div>
    );
  }

  const allSelected = leads.length > 0 && leads.every((l) => selectedIds.includes(l.id));
  const someSelected = leads.some((l) => selectedIds.includes(l.id)) && !allSelected;

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 w-10">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Lead</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Công ty</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Nguồn</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Score</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Ngày tạo</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Checkbox
                  checked={selectedIds.includes(lead.id)}
                  onCheckedChange={(checked) => onSelect(lead.id, !!checked)}
                />
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-text-dark">{lead.name}</p>
                  <p className="text-xs text-text-muted">{lead.email}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-text-dark">{lead.company}</td>
              <td className="px-4 py-3">
                <Badge variant="outline">{lead.source}</Badge>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    lead.score >= 80
                      ? "bg-green-100 text-green-700"
                      : lead.score >= 60
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {lead.score}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-text-muted">
                {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}