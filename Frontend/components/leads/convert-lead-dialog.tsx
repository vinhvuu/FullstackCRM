"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Building2, Contact, TrendingUp } from "lucide-react";
import { Lead, ConvertLeadData, DealStage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConvertLeadDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConvert: (data: ConvertLeadData) => void;
}

const defaultStages: { id: DealStage; label: string }[] = [
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
];

export function ConvertLeadDialog({ lead, open, onOpenChange, onConvert }: ConvertLeadDialogProps) {
  const [dealTitle, setDealTitle] = useState("");
  const [dealValue, setDealValue] = useState(0);
  const [dealStage, setDealStage] = useState<DealStage>("qualified");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [createContact, setCreateContact] = useState(true);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDealTitle(`${lead.company} - ${lead.name}`);
    setDealValue(0);
    setDealStage("qualified");
    setExpectedCloseDate("");
    setCreateContact(true);
  }, [lead, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onConvert({
      leadId: lead.id,
      dealTitle,
      dealValue,
      dealStage,
      expectedCloseDate,
      createContact,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Convert Lead to Deal
          </DialogTitle>
          <DialogDescription>
            Create a new deal from {lead.name} at {lead.company}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl bg-gray-50 p-4">
              <h4 className="flex items-center gap-2 font-semibold text-text-dark">
                <Contact className="w-4 h-4" />
                Lead Information
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-text-muted text-xs">Name</p>
                  <p className="font-medium text-text-dark">{lead.name}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Company</p>
                  <p className="font-medium text-text-dark flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {lead.company}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Email</p>
                  <p className="font-medium text-text-dark">{lead.email}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Phone</p>
                  <p className="font-medium text-text-dark">{lead.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-text-dark">
                <TrendingUp className="w-4 h-4" />
                Deal Information
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="dealTitle" className="text-sm font-medium text-text-dark">
                    Deal Title *
                  </label>
                  <Input
                    id="dealTitle"
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    placeholder="Enter deal title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dealValue" className="text-sm font-medium text-text-dark">
                    Deal Value (VND) *
                  </label>
                  <Input
                    id="dealValue"
                    type="number"
                    min="0"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dealStage" className="text-sm font-medium text-text-dark">
                    Stage
                  </label>
                  <select
                    id="dealStage"
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value as DealStage)}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {defaultStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="closeDate" className="text-sm font-medium text-text-dark">
                    Expected Close Date
                  </label>
                  <Input
                    id="closeDate"
                    type="date"
                    value={expectedCloseDate}
                    onChange={(e) => setExpectedCloseDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={createContact}
              onChange={(e) => setCreateContact(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary"
            />
            <span className="text-sm text-text-dark">Also create new contact record</span>
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <ArrowRight className="w-4 h-4" />
              Convert to Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
