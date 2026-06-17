"use client";

import { LeadTag, TAG_CONFIGS } from "@/types";

interface LeadTagsProps {
  tags: LeadTag[];
  size?: "sm" | "md";
  clickable?: boolean;
  onTagClick?: (tag: LeadTag) => void;
}

export function LeadTags({ tags, size = "md", clickable = false, onTagClick }: LeadTagsProps) {
  if (!tags || tags.length === 0) return null;

  const getTagConfig = (tagId: string) => {
    return TAG_CONFIGS.find((t) => t.id === tagId) || {
      id: tagId,
      label: tagId,
      color: "#6B7280",
      bgColor: "#F3F4F6",
    };
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => {
        const config = getTagConfig(tag);
        const Component = clickable ? "button" : "span";
        return (
          <Component
            key={tag}
            type={clickable ? "button" : undefined}
            onClick={clickable ? () => onTagClick?.(tag) : undefined}
            className={`${sizeClasses} rounded-full font-medium transition-colors ${
              clickable ? "hover:opacity-80 cursor-pointer" : ""
            }`}
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
            }}
          >
            {config.label}
          </Component>
        );
      })}
    </div>
  );
}