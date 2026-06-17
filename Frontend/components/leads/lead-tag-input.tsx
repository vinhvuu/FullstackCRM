"use client";

import { useState } from "react";
import { LeadTag, TAG_CONFIGS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface LeadTagInputProps {
  selectedTags: LeadTag[];
  onChange: (tags: LeadTag[]) => void;
}

export function LeadTagInput({ selectedTags, onChange }: LeadTagInputProps) {
  const [customTag, setCustomTag] = useState("");

  const handleAddTag = (tagId: LeadTag) => {
    if (!selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId: LeadTag) => {
    onChange(selectedTags.filter((t) => t !== tagId));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      onChange([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const availableTags = TAG_CONFIGS.filter((tag) => !selectedTags.includes(tag.id));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => {
          const config = TAG_CONFIGS.find((t) => t.id === tag) || {
            id: tag,
            label: tag,
            color: "#6B7280",
            bgColor: "#F3F4F6",
          };
          return (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: config.bgColor,
                color: config.color,
              }}
            >
              {config.label}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-text-muted">Add tags:</p>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleAddTag(tag.id)}
              className="px-3 py-1 rounded-full text-sm font-medium border border-dashed border-gray-300 hover:border-gray-400 transition-colors"
              style={{
                backgroundColor: tag.bgColor,
                color: tag.color,
              }}
            >
              <Plus className="w-3 h-3 inline mr-1" />
              {tag.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Custom tag name"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag()}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCustomTag}
            disabled={!customTag.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}