"use client";

import { useState } from "react";
import { Lead } from "@/types";
import { LEAD_SOURCES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadScore } from "./lead-score";
import { LeadTagInput } from "./lead-tag-input";

interface LeadFormProps {
  lead?: Lead | null;
  onClose: () => void;
}

export function LeadForm({ lead, onClose }: LeadFormProps) {
  const [formData, setFormData] = useState<Partial<Lead>>(
    lead || {
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "Website",
      status: "new",
      score: 50,
      assignee: "Hoàng An",
      tags: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleTagsChange = (tags: Lead["tags"]) => {
    setFormData({ ...formData, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Name</label>
          <Input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter lead name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Company</label>
          <Input
            value={formData.company || ""}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Email</label>
          <Input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Phone</label>
          <Input
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Source</label>
          <select
            value={formData.source || ""}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Status</label>
          <select
            value={formData.status || ""}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as Lead["status"] })
            }
            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">AI Score</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={formData.score || 50}
            onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <LeadScore score={formData.score || 50} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Tags</label>
        <LeadTagInput
          selectedTags={formData.tags || []}
          onChange={handleTagsChange}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="cta">
          {lead ? "Update Lead" : "Add Lead"}
        </Button>
      </div>
    </form>
  );
}
