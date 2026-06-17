"use client";

import { LeadReminder } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Trash2, Bell } from "lucide-react";
import { formatDate } from "@/lib/utils";

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