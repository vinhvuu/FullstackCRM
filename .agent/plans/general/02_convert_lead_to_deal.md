# Detailed Implementation Plan: Convert Lead to Deal

## Overview
Add functionality to convert a lead into a deal and contact with pre-filled data from the lead. This connects the leads pipeline to the deals pipeline.

---

## 1. UI/UX Design

### 1.1 User Flow
1. User opens lead detail page or selects lead(s) in bulk actions
2. Clicks "Convert to Deal" button
3. A dialog opens with pre-filled form:
   - Deal title (default: `"{Company} - {Lead Name}"`)
   - Deal value (user input)
   - Stage (default: "qualified")
   - Expected close date
   - Contact info pre-filled from lead
4. User edits and clicks "Convert"
5. Success: deal created, lead status → "qualified", toast notification

### 1.2 Dialog Design
```
+-----------------------------------------------------------+
|  Convert Lead to Deal                               [X]   |
+-----------------------------------------------------------+
|                                                            |
|  +--------------------+  +--------------------+             |
|  | LEAD INFO         |  | DEAL INFO          |             |
|  | Name: Nguyễn Văn  |  | Title: *           |             |
|  | Company: ABC Co   |  | Value: *           |             |
|  | Email: abc@...    |  | Stage: Qualified v |             |
|  | Phone: 090...     |  | Expected Close:    |             |
|  +--------------------+  +--------------------+             |
|                                                            |
|  [ ] Also create new contact record                       |
|                                                            |
+-----------------------------------------------------------+
|  [Cancel]                                    [Convert]    |
+-----------------------------------------------------------+
```

### 1.3 Button Placement
- Lead detail page: in Quick Actions card
- Leads list (bulk): in Bulk Actions bar after selecting leads
- Button text: "Convert to Deal" with icon: `ArrowRight` or `TrendingUp`

---

## 2. Technical Design

### 2.1 Types

In `types/index.ts`:
```typescript
export interface ConvertLeadData {
  leadId: string;
  dealTitle: string;
  dealValue: number;
  dealStage: DealStage;
  expectedCloseDate: string;
  createContact: boolean;
}
```

### 2.2 Component Structure

#### `components/leads/convert-lead-dialog.tsx`
- Dialog component for converting a lead
- Props:
  - `lead: Lead` - the lead to convert
  - `open: boolean`
  - `onOpenChange: (open: boolean) => void`
  - `onConvert: (data: ConvertLeadData) => void`
- Form fields:
  - Deal title (text input, required)
  - Deal value (number input, required)
  - Deal stage (select dropdown)
  - Expected close date (date input)
  - Create contact checkbox (default: true)

#### `components/leads/convert-lead-form.tsx` (optional, inline in dialog)
- The form content for the dialog

---

## 3. File Changes

### 3.1 NEW Files

#### `components/leads/convert-lead-dialog.tsx`
```typescript
"use client";

import { useState } from "react";
import { Lead, DealStage, ConvertLeadData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowRightRight, TrendingUp, Contact, Building2 } from "lucide-react";

interface ConvertLeadDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConvert: (data: ConvertLeadData) => void;
}

const DEFAULT_STAGES: { id: DealStage; label: string }[] = [
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
];

export function ConvertLeadDialog({
  lead,
  open,
  onOpenChange,
  onConvert,
}: ConvertLeadDialogProps) {
  const [dealTitle, setDealTitle] = useState(`${lead.company} - Deal`);
  const [dealValue, setDealValue] = useState(0);
  const [dealStage, setDealStage] = useState<DealStage>("qualified");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [createContact, setCreateContact] = useState(true);

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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Convert Lead to Deal
          </DialogTitle>
          <DialogDescription>
            Convert {lead.name} from {lead.company} into a deal opportunity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Lead Info */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-text-dark flex items-center gap-2">
                <Contact className="w-4 h-4" />
                Lead Information
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-text-muted text-xs">Name</Label>
                  <p className="font-medium text-text-dark">{lead.name}</p>
                </div>
                <div>
                  <Label className="text-text-muted text-xs">Company</Label>
                  <p className="font-medium text-text-dark">{lead.company}</p>
                </div>
                <div>
                  <Label className="text-text-muted text-xs">Email</Label>
                  <p className="font-medium text-text-dark">{lead.email}</p>
                </div>
                <div>
                  <Label className="text-text-muted text-xs">Phone</Label>
                  <p className="font-medium text-text-dark">{lead.phone}</p>
                </div>
              </div>
            </div>

            {/* Deal Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-text-dark flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Deal Information
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dealTitle">Deal Title *</Label>
                  <Input
                    id="dealTitle"
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    placeholder="Enter deal title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dealValue">Deal Value (VND) *</Label>
                  <Input
                    id="dealValue"
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    placeholder="Enter deal value"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dealStage">Stage</Label>
                  <Select
                    value={dealStage}
                    onValueChange={(v) => setDealStage(v as DealStage)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_STAGES.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="closeDate">Expected Close Date</Label>
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="createContact"
              checked={createContact}
              onChange={(e) => setCreateContact(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary"
            />
            <Label htmlFor="createContact" className="font-normal">
              Also create contact record from lead
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
```

### 3.2 MODIFY Files

#### `types/index.ts`
Add:
```typescript
export interface ConvertLeadData {
  leadId: string;
  dealTitle: string;
  dealValue: number;
  dealStage: DealStage;
  expectedCloseDate: string;
  createContact: boolean;
}
```

#### `lib/mock-data.ts`
Add helper function to create deal from lead:
```typescript
import { Lead, Deal, Contact, ConvertLeadData } from "@/types";

let dealsStore = [...deals];
let contactsStore = [...contacts];

export function convertLeadToDeal(data: ConvertLeadData, lead: Lead): { deal: Deal; contact?: Contact } {
  const newDeal: Deal = {
    id: Date.now().toString(),
    title: data.dealTitle,
    value: data.dealValue,
    stage: data.dealStage,
    probability: data.dealStage === "qualified" ? 40 : data.dealStage === "proposal" ? 60 : 75,
    contactId: "",
    createdAt: new Date().toISOString().split("T")[0],
    expectedCloseDate: data.expectedCloseDate,
  };

  let contact: Contact | undefined;
  
  if (data.createContact) {
    contact = {
      id: Date.now().toString(),
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      position: "",
      companyId: lead.id,
    };
    newDeal.contactId = contact.id;
    contactsStore.push(contact);
  }

  dealsStore.push(newDeal);
  
  return { deal: newDeal, contact };
}

export function getDeals(): Deal[] {
  return dealsStore;
}

export function getContacts(): Contact[] {
  return contactsStore;
}
```

#### `app/(dashboard)/leads/[id]/page.tsx`
- Import ConvertLeadDialog
- Add state: `const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);`
- Add "Convert to Deal" button in Quick Actions card:
```tsx
<Button 
  variant="outline" 
  className="w-full justify-start gap-3"
  onClick={() => setIsConvertDialogOpen(true)}
>
  <TrendingUp className="w-4 h-4 text-green-500" />
  Convert to Deal
</Button>
```
- Add ConvertLeadDialog component:
```tsx
<ConvertLeadDialog
  lead={lead}
  open={isConvertDialogOpen}
  onOpenChange={setIsConvertDialogOpen}
  onConvert={handleConvertToDeal}
/>
```
- Add handler:
```tsx
const handleConvertToDeal = (data: ConvertLeadData) => {
  const result = convertLeadToDeal(data, lead);
  // Update lead status to qualified
  // Show success toast
  console.log("Created deal:", result.deal);
  if (result.contact) {
    console.log("Created contact:", result.contact);
  }
};
```

#### `components/leads/bulk-actions.tsx`
- Add "Convert to Deal" button in bulk actions bar
- Opens dialog with first selected lead (or batch handle)

---

## 4. Implementation Order

1. Update `types/index.ts` with `ConvertLeadData` interface
2. Add helper functions to `lib/mock-data.ts`
3. Create `convert-lead-dialog.tsx`
4. Update lead detail page to add convert button and dialog
5. Update bulk actions to include convert option

---

## 5. Verification

- [ ] "Convert to Deal" button appears on lead detail page
- [ ] Dialog opens with pre-filled lead data
- [ ] Deal title defaults to "Company - Deal"
- [ ] Can edit all deal fields
- [ ] "Create contact" checkbox works
- [ ] After conversion, success toast appears
- [ ] Lead status updates to "qualified"
- [ ] New deal appears in deals list
- [ ] New contact appears in contacts list (if checked)

---

## 6. Edge Cases

- Handle conversion when lead already has a deal
- Handle duplicate contact detection by email
- Validate required fields before submit
- Show loading state during conversion
- Handle error states gracefully