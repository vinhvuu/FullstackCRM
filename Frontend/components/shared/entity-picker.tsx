"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EntityOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface EntityPickerProps {
  options: EntityOption[];
  value?: string;
  onChange: (id: string) => void;
  onCreateNew?: (query: string) => void;
  placeholder?: string;
  createLabel?: string;
  className?: string;
}

export function EntityPicker({
  options,
  value,
  onChange,
  onCreateNew,
  placeholder = "Tìm kiếm...",
  createLabel = "Tạo mới",
  className,
}: EntityPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) ||
      (o.sublabel && o.sublabel.toLowerCase().includes(query.toLowerCase()))
  );

  const selected = options.find((o) => o.id === value);

  return (
    <div className={cn("relative", className)}>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 cursor-pointer hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 bg-white"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {open ? (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-sm outline-none bg-transparent"
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
        ) : (
          <span className={cn("flex-1 text-sm", selected ? "text-text-dark" : "text-gray-400")}>
            {selected ? selected.label : placeholder}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-text-muted text-center">Không tìm thấy</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={cn(
                  "w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-sm flex flex-col gap-0.5 transition-colors",
                  value === opt.id && "bg-indigo-50 text-indigo-700"
                )}
                onMouseDown={() => {
                  onChange(opt.id);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <span className="font-medium">{opt.label}</span>
                {opt.sublabel && <span className="text-xs text-text-muted">{opt.sublabel}</span>}
              </button>
            ))
          )}
          {onCreateNew && query.trim() && (
            <button
              type="button"
              className="w-full text-left px-4 py-2.5 hover:bg-green-50 text-sm text-green-700 flex items-center gap-2 border-t border-gray-100"
              onMouseDown={() => {
                onCreateNew(query.trim());
                setQuery("");
                setOpen(false);
              }}
            >
              <Plus className="w-4 h-4" />
              {createLabel} &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
