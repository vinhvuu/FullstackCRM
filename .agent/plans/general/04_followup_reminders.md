# Detailed Implementation Plan: Follow-up Reminders

## Overview
Allow users to set follow-up reminders on leads with a date/time and note. Show pending reminders on the leads list page with overdue badges. Users can mark reminders as done or snooze them.

---

## 1. UI/UX Design

### 1.1 Reminder Badge on Leads List
- Small bell icon with count badge on leads that have reminders
- Red badge for overdue reminders
- Orange badge for today's reminders

### 1.2 Set Reminder Dialog
```
+-----------------------------------------------------------+
|  Set Follow-up Reminder                             [X]   |
+-----------------------------------------------------------+
|  Lead: Nguyễn Văn Minh (ABC Company)                     |
|                                                            |
|  Date:  [10/06/2026]                                       |
|  Time:  [09:00      ]                                      |
|                                                            |
|  Note:  [                            ]                    |
|         [Call to discuss pricing options                  ]|
|                                                            |
|  [ ] Remind me again if not completed                     |
|                                                            |
+-----------------------------------------------------------+
|  [Cancel]                                      [Save]      |
+-----------------------------------------------------------+
```

### 1.3 Reminder Section on Lead Detail
- Shows list of all reminders for the lead
- Each reminder shows: date/time, note, status
- Actions: Mark as Done, Snooze (1 day, 1 week)

### 1.4 Visual Indicators
- Overdue: Red background, "Overdue" label
- Today: Orange background, "Today" label
- Upcoming: Default styling
- Completed: Strikethrough, green checkmark

---

## 2. Technical Design

### 2.1 Types

In `types/index.ts`:
```typescript
export type ReminderStatus = "pending" | "completed" | "overdue" | "snoozed";

export interface LeadReminder {
  id: string;
  leadId: string;
  date: string;        // "2026-06-10"
  time: string;       // "09:00"
  note: string;
  status: ReminderStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Lead {
  // ... existing fields
  reminders: LeadReminder[];  // ADD THIS
}
```

### 2.2 Component Structure

#### `components/leads/lead-reminder-form.tsx`
- Form to create/edit a reminder
- Props:
  - `leadId: string`
  - `onSubmit: (reminder: Omit<LeadReminder, "id" | "createdAt" | "status">) => void`

#### `components/leads/lead-reminder-list.tsx`
- List of reminders for a lead
- Props:
  - `reminders: LeadReminder[]`
  - `onComplete: (id: string) => void`
  - `onSnooze: (id: string, days: number) => void`
  - `onDelete: (id: string) => void`

#### `components/leads/lead-reminder-badge.tsx`
- Small badge showing reminder count/status
- Props:
  - `reminders: LeadReminder[]`
  - `onClick?: () => void`

---

## 3. File Changes

### 3.1 NEW Files

#### `components/leads/lead-reminder-form.tsx`
```typescript
"use client";

import { useState } from "react";
import { LeadReminder } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Calendar, Clock } from "lucide-react";

interface LeadReminderFormProps {
  leadId: string;
  leadName: string;
  onSubmit: (data: Omit<LeadReminder, "id" | "createdAt" | "status">) => void;
  onCancel: () => void;
}

export function LeadReminderForm({
  leadId,
  leadName,
  onSubmit,
  onCancel,
}: LeadReminderFormProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [note, setNote] = useState("");
  const [remindAgain, setRemindAgain] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      leadId,
      date,
      time,
      note,
      completedAt: undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-text-muted">Lead</p>
        <p className="font-medium text-text-dark">{leadName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reminderDate">Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              id="reminderDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="reminderTime">Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              id="reminderTime"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="reminderNote">Note</Label>
        <Textarea
          id="reminderNote"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What do you need to follow up on?"
          rows={3}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remindAgain"
          checked={remindAgain}
          onChange={(e) => setRemindAgain(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-primary"
        />
        <Label htmlFor="remindAgain" className="font-normal text-sm">
          Remind me again if not completed
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Bell className="w-4 h-4 mr-2" />
          Set Reminder
        </Button>
      </div>
    </form>
  );
}
```

#### `components/leads/lead-reminder-list.tsx`
```typescript
"use client";

import { LeadReminder } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Trash2, Snooze, Bell } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

interface LeadReminderListProps {
  reminders: LeadReminder[];
  onComplete: (id: string) => void;
  onSnooze: (id: string, days: number) => void;
  onDelete: (id: string) => void;
}

export function LeadReminderList({
  reminders,
  onComplete,
  onSnooze,
  onDelete,
}: LeadReminderListProps) {
  const getStatusBadge = (reminder: LeadReminder) => {
    const now = new Date();
    const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reminderDay = new Date(
      reminderDate.getFullYear(),
      reminderDate.getMonth(),
      reminderDate.getDate()
    );

    if (reminder.status === "completed") {
      return <Badge variant="success">Completed</Badge>;
    }
    if (reminderDay < today) {
      return <Badge variant="error">Overdue</Badge>;
    }
    if (reminderDay.getTime() === today.getTime()) {
      return <Badge variant="warning">Today</Badge>;
    }
    return <Badge variant="default">Upcoming</Badge>;
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  if (reminders.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No reminders set</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedReminders.map((reminder) => (
        <div
          key={reminder.id}
          className={`p-4 rounded-xl border ${
            reminder.status === "completed"
              ? "bg-green-50 border-green-200"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-muted" />
              <span className="font-medium text-text-dark">
                {formatDate(reminder.date)} at {reminder.time}
              </span>
            </div>
            {getStatusBadge(reminder)}
          </div>
          
          <p className={`text-sm mb-3 ${
            reminder.status === "completed" ? "text-text-muted line-through" : "text-text-dark"
          }`}>
            {reminder.note}
          </p>

          {reminder.status !== "completed" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onComplete(reminder.id)}
              >
                <Check className="w-3 h-3 mr-1" />
                Done
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSnooze(reminder.id, 1)}
              >
                <Snooze className="w-3 h-3 mr-1" />
                +1 day
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => onDelete(reminder.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

#### `components/leads/lead-reminder-badge.tsx`
```typescript
"use client";

import { LeadReminder } from "@/types";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";

interface LeadReminderBadgeProps {
  reminders: LeadReminder[];
  onClick?: () => void;
}

export function LeadReminderBadge({ reminders, onClick }: LeadReminderBadgeProps) {
  const pendingReminders = reminders.filter((r) => r.status !== "completed");
  const overdueCount = pendingReminders.filter((r) => {
    const now = new Date();
    const reminderDate = new Date(`${r.date}T${r.time}`);
    return reminderDate < now;
  }).length;
  
  const todayCount = pendingReminders.filter((r) => {
    const now = new Date();
    const reminderDate = new Date(`${r.date}T${r.time}`);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reminderDay = new Date(
      reminderDate.getFullYear(),
      reminderDate.getMonth(),
      reminderDate.getDate()
    );
    return reminderDay.getTime() === today.getTime();
  }).length;

  if (pendingReminders.length === 0) return null;

  const button = (
    <Button variant="ghost" size="sm" className="gap-1" onClick={onClick}>
      {overdueCount > 0 ? (
        <>
          <Bell className="w-4 h-4 text-red-500" />
          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {overdueCount}
          </span>
        </>
      ) : todayCount > 0 ? (
        <>
          <Bell className="w-4 h-4 text-orange-500" />
          <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {todayCount}
          </span>
        </>
      ) : (
        <>
          <Bell className="w-4 h-4" />
          <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
            {pendingReminders.length}
          </span>
        </>
      )}
    </Button>
  );

  return onClick ? button : <span>{button}</span>;
}
```

### 3.2 MODIFY Files

#### `types/index.ts`
Add:
```typescript
export type ReminderStatus = "pending" | "completed" | "overdue" | "snoozed";

export interface LeadReminder {
  id: string;
  leadId: string;
  date: string;
  time: string;
  note: string;
  status: ReminderStatus;
  createdAt: string;
  completedAt?: string;
}
```

Update Lead interface:
```typescript
export interface Lead {
  // ... existing fields
  reminders: LeadReminder[];  // ADD THIS
}
```

#### `lib/mock-data.ts`
Add sample reminders to leads:
```typescript
export const leads: Lead[] = [
  {
    id: "1",
    // ... existing fields
    reminders: [
      {
        id: "r1",
        leadId: "1",
        date: "2026-06-08",
        time: "10:00",
        note: "Follow up on pricing discussion",
        status: "pending",
        createdAt: "2026-06-05",
      },
      {
        id: "r2",
        leadId: "1",
        date: "2026-06-01",
        time: "14:00",
        note: "Initial call",
        status: "completed",
        createdAt: "2026-05-30",
        completedAt: "2026-06-01",
      },
    ],
  },
];
```

#### `app/(dashboard)/leads/page.tsx`
- Add reminder state management
- Add "Set Reminder" button in BulkActions
- Show reminder badges on lead rows (integrate into table)

#### `app/(dashboard)/leads/[id]/page.tsx`
- Import LeadReminderList
- Add "Reminders" section in detail page
- Add "Set Reminder" button that opens a dialog

---

## 4. Implementation Order

1. Update `types/index.ts` with reminder types
2. Add sample reminders to `lib/mock-data.ts`
3. Create `lead-reminder-form.tsx`
4. Create `lead-reminder-list.tsx`
5. Create `lead-reminder-badge.tsx`
6. Update lead detail page with reminders section
7. Update leads page with reminder badges

---

## 5. Verification

- [ ] Can set a reminder from lead detail page
- [ ] Reminders show in list on lead detail
- [ ] Overdue reminders show red badge
- [ ] Today's reminders show orange badge
- [ ] Can mark reminder as done
- [ ] Can snooze reminder (+1 day)
- [ ] Can delete reminder
- [ ] Completed reminders show with strikethrough
- [ ] Reminder count badge shows on leads list

---

## 6. Edge Cases

- Handle empty reminders array
- Handle past dates (show as overdue)
- Handle timezone correctly
- Maximum 20 reminders per lead
- Reminder deletion requires confirmation