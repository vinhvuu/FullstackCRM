# Detailed Implementation Plan: Tags / Custom Fields

## Overview
Add colored tags to leads for quick categorization (e.g., "VIP", "Hot", "Long-term"). Users can add/remove tags on leads via the lead form and view them on the leads table and detail page.

---

## 1. UI/UX Design

### 1.1 Tag Colors
| Tag | Color | Hex Code |
|-----|-------|----------|
| VIP | Purple | #8B5CF6 |
| Hot | Red | #EF4444 |
| Long-term | Blue | #3B82F6 |
| New | Green | #10B981 |
| Follow-up | Orange | #F59E0B |
| Inactive | Gray | #6B7280 |

### 1.2 Tag Display

**On Lead Table:**
```
| Lead      | Tags                    |
|-----------|-------------------------|
| Nguyễn Văn| [VIP] [Hot]            |
| Trần Thị  | [New]                   |
```

**On Lead Detail Card:**
- Tags displayed as colored pills below the lead info
- Clicking a tag filters leads by that tag

**On Lead Form:**
- Multi-select dropdown with predefined tags
- User can create custom tags (stored in local state)
- Tags displayed as removable pills

---

## 2. Technical Design

### 2.1 Types

In `types/index.ts`:
```typescript
export type LeadTag = "vip" | "hot" | "long-term" | "new" | "follow-up" | "inactive" | string;

export interface TagConfig {
  id: LeadTag;
  label: string;
  color: string;
  bgColor: string;
}

export const TAG_CONFIGS: TagConfig[] = [
  { id: "vip", label: "VIP", color: "#8B5CF6", bgColor: "#EDE9FE" },
  { id: "hot", label: "Hot", color: "#EF4444", bgColor: "#FEE2E2" },
  { id: "long-term", label: "Long-term", color: "#3B82F6", bgColor: "#DBEAFE" },
  { id: "new", label: "New", color: "#10B981", bgColor: "#D1FAE5" },
  { id: "follow-up", label: "Follow-up", color: "#F59E0B", bgColor: "#FEF3C7" },
  { id: "inactive", label: "Inactive", color: "#6B7280", bgColor: "#F3F4F6" },
];

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
  tags: LeadTag[];  // ADD THIS FIELD
}
```

### 2.2 Component Structure

#### `components/leads/lead-tags.tsx`
- Displays tags as colored pills
- Props:
  - `tags: LeadTag[]`
  - `size?: "sm" | "md"` (default: "md")
  - `clickable?: boolean` (for filtering)

#### `components/leads/lead-tag-input.tsx`
- Tag picker for forms
- Props:
  - `selectedTags: LeadTag[]`
  - `onChange: (tags: LeadTag[]) => void`
- Shows predefined tags + custom tag input

---

## 3. File Changes

### 3.1 NEW Files

#### `components/leads/lead-tags.tsx`
```typescript
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

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs" 
    : "px-3 py-1 text-sm";

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
```

#### `components/leads/lead-tag-input.tsx`
```typescript
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

  const availableTags = TAG_CONFIGS.filter(
    (tag) => !selectedTags.includes(tag.id)
  );

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
```

### 3.2 MODIFY Files

#### `types/index.ts`
Add at the top:
```typescript
export type LeadTag = "vip" | "hot" | "long-term" | "new" | "follow-up" | "inactive" | string;

export interface TagConfig {
  id: LeadTag;
  label: string;
  color: string;
  bgColor: string;
}

export const TAG_CONFIGS: TagConfig[] = [
  { id: "vip", label: "VIP", color: "#8B5CF6", bgColor: "#EDE9FE" },
  { id: "hot", label: "Hot", color: "#EF4444", bgColor: "#FEE2E2" },
  { id: "long-term", label: "Long-term", color: "#3B82F6", bgColor: "#DBEAFE" },
  { id: "new", label: "New", color: "#10B981", bgColor: "#D1FAE5" },
  { id: "follow-up", label: "Follow-up", color: "#F59E0B", bgColor: "#FEF3C7" },
  { id: "inactive", label: "Inactive", color: "#6B7280", bgColor: "#F3F4F6" },
];
```

Update Lead interface:
```typescript
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
  tags: LeadTag[];  // ADD THIS
}
```

#### `lib/mock-data.ts`
Add tags to lead data:
```typescript
export const leads: Lead[] = [
  {
    id: "1",
    name: "Nguyễn Văn Minh",
    company: "Công ty ABC",
    email: "minh.nv@abc.vn",
    phone: "0901234567",
    source: "Website",
    status: "qualified",
    score: 85,
    createdAt: "2026-03-01",
    assignee: "Hoàng An",
    tags: ["vip", "hot"],  // ADD
  },
  // ... add tags to other leads
];
```

#### `components/leads/lead-table.tsx`
- Import LeadTags
- Add Tags column in table header
- Add Tags cell in each row:
```tsx
<td className="px-6 py-4">
  <LeadTags tags={lead.tags} size="sm" />
</td>
```

#### `components/leads/lead-form.tsx`
- Import LeadTagInput
- Add tags field in the form
- Include in onSubmit data

#### `app/(dashboard)/leads/[id]/page.tsx`
- Import LeadTags
- Display tags in lead detail card:
```tsx
<div className="mt-4">
  <LeadTags tags={lead.tags} clickable onTagClick={(tag) => console.log(tag)} />
</div>
```

#### `app/(dashboard)/leads/page.tsx`
- Add tags filter in LeadFiltersComponent
- Add "My Tags" filter in QuickFilters

---

## 4. Implementation Order

1. Update `types/index.ts` with LeadTag type and TAG_CONFIGS
2. Add tags to lead data in `lib/mock-data.ts`
3. Create `lead-tags.tsx` component
4. Create `lead-tag-input.tsx` component
5. Update `lead-table.tsx` to show tags column
6. Update `lead-form.tsx` to add/edit tags
7. Update lead detail page to display tags

---

## 5. Verification

- [ ] Tags display as colored pills on table
- [ ] Tags display on lead detail page
- [ ] Can add tags in lead form
- [ ] Can remove tags in lead form
- [ ] Custom tags can be created
- [ ] Tags appear in CSV export
- [ ] Filter by tag works (if filter implemented)

---

## 6. Edge Cases

- Empty tags array shows nothing
- Unknown tag falls back to gray styling
- Maximum 10 tags per lead (prevent overflow)
- Tag names are case-insensitive for matching