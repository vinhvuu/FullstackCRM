"use client";

import { useState } from "react";
import { LeadFilters, LeadStatus } from "@/types";
import { LEAD_SOURCES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LeadFiltersProps {
  filters: LeadFilters;
  onApply: (filters: LeadFilters) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "lost", label: "Lost" },
];

export function LeadFiltersComponent({ filters, onApply, onClear }: LeadFiltersProps) {
  const [localFilters, setLocalFilters] = useState<LeadFilters>(filters);

  const handleStatusToggle = (status: LeadStatus) => {
    const newStatus = localFilters.status.includes(status)
      ? localFilters.status.filter((s) => s !== status)
      : [...localFilters.status, status];
    setLocalFilters({ ...localFilters, status: newStatus });
  };

  const handleSourceToggle = (source: string) => {
    const newSource = localFilters.source.includes(source)
      ? localFilters.source.filter((s) => s !== source)
      : [...localFilters.source, source];
    setLocalFilters({ ...localFilters, source: newSource });
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    const cleared: LeadFilters = {
      status: [],
      source: [],
      dateFrom: "",
      dateTo: "",
      assignee: "all",
      scoreMin: 0,
      scoreMax: 100,
    };
    setLocalFilters(cleared);
    onClear();
  };

  const activeFilterCount =
    localFilters.status.length +
    localFilters.source.length +
    (localFilters.dateFrom ? 1 : 0) +
    (localFilters.dateTo ? 1 : 0) +
    (localFilters.assignee !== "all" ? 1 : 0) +
    (localFilters.scoreMin > 0 || localFilters.scoreMax < 100 ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusToggle(option.value)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                localFilters.status.includes(option.value)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-muted border-gray-200 hover:border-primary/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Source</label>
        <div className="flex flex-wrap gap-2">
          {LEAD_SOURCES.map((source) => (
            <button
              key={source}
              onClick={() => handleSourceToggle(source)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                localFilters.source.includes(source)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-muted border-gray-200 hover:border-primary/50"
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Date Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={localFilters.dateFrom}
            onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
            className="text-sm"
          />
          <Input
            type="date"
            value={localFilters.dateTo}
            onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
            className="text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Score Range: {localFilters.scoreMin} - {localFilters.scoreMax}</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={localFilters.scoreMin}
            onChange={(e) => setLocalFilters({ ...localFilters, scoreMin: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <input
            type="range"
            min="0"
            max="100"
            value={localFilters.scoreMax}
            onChange={(e) => setLocalFilters({ ...localFilters, scoreMax: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      <div className="flex justify-between pt-3 border-t border-gray-100">
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear All
        </Button>
        <Button size="sm" onClick={handleApply}>
          Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>
    </div>
  );
}