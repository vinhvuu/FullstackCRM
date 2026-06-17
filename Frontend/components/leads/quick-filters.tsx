"use client";

import { QuickFilter } from "@/types";
import { Button } from "@/components/ui/button";
import { Users, Star, Clock, Filter } from "lucide-react";

interface QuickFiltersProps {
  activeFilter: QuickFilter;
  onFilterChange: (filter: QuickFilter) => void;
}

const QUICK_FILTERS: { value: QuickFilter; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: Filter },
  { value: "new", label: "New", icon: Users },
  { value: "recent", label: "Recent", icon: Clock },
  { value: "highScore", label: "High Score", icon: Star },
];

export function QuickFilters({ activeFilter, onFilterChange }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_FILTERS.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.value;
        return (
          <Button
            key={filter.value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className="gap-1.5"
          >
            <Icon className="w-4 h-4" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}