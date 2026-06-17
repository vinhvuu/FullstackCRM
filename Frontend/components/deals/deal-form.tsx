"use client";

import { useState } from "react";
import { Deal, DealStage } from "@/types";
import { contacts } from "@/lib/mock-data";
import { DEAL_STAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DealFormProps {
  deal?: Deal | null;
  onClose: () => void;
  onSubmit: (deal: Deal) => void;
}

export function DealForm({ deal, onClose, onSubmit }: DealFormProps) {
  const [formData, setFormData] = useState<Partial<Deal>>(
    deal || {
      title: "",
      value: 0,
      stage: "lead",
      probability: 25,
      contactId: "",
      createdAt: new Date().toISOString().split("T")[0],
      expectedCloseDate: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal: Deal = {
      id: deal?.id || Math.random().toString(36).substring(7),
      title: formData.title || "",
      value: formData.value || 0,
      stage: formData.stage || "lead",
      probability: formData.probability || 25,
      contactId: formData.contactId || "",
      createdAt: formData.createdAt || new Date().toISOString().split("T")[0],
      expectedCloseDate: formData.expectedCloseDate || "",
    };
    onSubmit(newDeal);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Deal Title</label>
        <Input
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter deal title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Value (VND)</label>
          <Input
            type="number"
            value={formData.value || ""}
            onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Stage</label>
          <select
            value={formData.stage || ""}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {DEAL_STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Win Probability</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.probability || 25}
              onChange={(e) =>
                setFormData({ ...formData, probability: parseInt(e.target.value) })
              }
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-sm font-medium text-text-dark w-12">
              {formData.probability || 25}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Contact</label>
          <select
            value={formData.contactId || ""}
            onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Select contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Expected Close Date</label>
        <Input
          type="date"
          value={formData.expectedCloseDate || ""}
          onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="cta">
          {deal ? "Update Deal" : "Add Deal"}
        </Button>
      </div>
    </form>
  );
}
