"use client";

import { useState } from "react";
import { LeadReminder } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          <label htmlFor="reminderDate" className="text-sm font-medium text-text-dark block mb-1">Date</label>
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
          <label htmlFor="reminderTime" className="text-sm font-medium text-text-dark block mb-1">Time</label>
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
        <label htmlFor="reminderNote" className="text-sm font-medium text-text-dark block mb-1">Note</label>
        <textarea
          id="reminderNote"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What do you need to follow up on?"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm resize-none"
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
        <label htmlFor="remindAgain" className="font-normal text-sm">
          Remind me again if not completed
        </label>
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