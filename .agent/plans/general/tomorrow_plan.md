# Plan: Leads Enhancement — Tomorrow (Jun 08, 2026)

## Goal
Add 4 high-value features to the Leads module over the next day.

---

## Task 1 — Kanban Board View

**Description:** Add a toggleable Kanban board view alongside the existing table view. Columns = lead statuses (New, Contacted, Qualified, Lost). Drag-and-drop cards to change status.

**Files involved:**
- `components/leads/lead-kanban.tsx` (NEW)
- `components/leads/lead-kanban-card.tsx` (NEW)
- `app/(dashboard)/leads/page.tsx` (MODIFY)

**Acceptance criteria:**
- User can toggle between table and kanban views
- Cards show lead name, company, score, source, assignee
- Dragging a card to another column updates its status
- Empty columns show "No leads" placeholder
- Score color-coding (high=green, mid=yellow, low=red)

---

## Task 2 — Convert Lead to Deal

**Description:** Add a "Convert to Deal" action on lead detail and bulk actions that creates a deal + contact record pre-filled with lead data.

**Files involved:**
- `components/leads/convert-lead-dialog.tsx` (NEW)
- `types/index.ts` (MODIFY — add `convertLeadToDeal` type)
- `lib/mock-data.ts` (MODIFY — add conversion helper)
- `app/(dashboard)/leads/[id]/page.tsx` (MODIFY)

**Acceptance criteria:**
- "Convert to Deal" button on lead detail page opens a dialog
- Dialog shows pre-filled deal fields (title, value, contact)
- User can edit before confirming
- After conversion, lead status changes to "qualified"
- Success toast notification

---

## Task 3 — Tags / Custom Fields

**Description:** Add colored tags to leads (e.g., "VIP", "Hot", "Long-term") for quick categorization.

**Files involved:**
- `types/index.ts` (MODIFY — add `tags` field to Lead)
- `lib/mock-data.ts` (MODIFY — add sample tags)
- `components/leads/lead-tags.tsx` (NEW)
- `components/leads/lead-tag-input.tsx` (NEW)
- `components/leads/lead-table.tsx` (MODIFY — show tags column)
- `components/leads/lead-form.tsx` (MODIFY — add tag picker)
- `app/(dashboard)/leads/[id]/page.tsx` (MODIFY — show tags)

**Acceptance criteria:**
- Tags display as colored pills on table rows and detail page
- User can add/remove tags in lead form
- Predefined tag colors: VIP=purple, Hot=red, Long-term=blue, New=green
- Tags appear in CSV export

---

## Task 4 — Follow-up Reminders

**Description:** Allow setting follow-up reminders on leads with a date/time and note. Show pending reminders on leads page.

**Files involved:**
- `types/index.ts` (MODIFY — add `LeadReminder` interface)
- `lib/mock-data.ts` (MODIFY — add sample reminders)
- `components/leads/lead-reminder-form.tsx` (NEW)
- `components/leads/lead-reminder-list.tsx` (NEW)
- `app/(dashboard)/leads/page.tsx` (MODIFY — reminder badge)
- `app/(dashboard)/leads/[id]/page.tsx` (MODIFY — reminder section)

**Acceptance criteria:**
- "Set Reminder" button on lead detail and list row
- Form with date picker, time, note
- Overdue reminders show with red badge
- Today's reminders shown at top of leads page
- Can mark reminder as done or snooze

---

## Verification

```bash
npx tsc --noEmit
npm run lint
```

Open browser and test:
1. Toggle Kanban view, drag cards between columns
2. Convert a lead to deal, verify deal + contact created
3. Add tags via lead form, see them on table and detail
4. Set a reminder, verify it shows on leads page
