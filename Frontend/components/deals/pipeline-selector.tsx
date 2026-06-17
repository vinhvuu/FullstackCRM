"use client";

import { PIPELINES } from "@/lib/constants";

interface PipelineSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export function PipelineSelector({ value, onChange }: PipelineSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-muted font-medium">Pipeline:</span>
      <div className="flex gap-1">
        {PIPELINES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              value === p.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-text-muted hover:bg-gray-200"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
