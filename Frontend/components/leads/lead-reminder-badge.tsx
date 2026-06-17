"use client";

import { LeadReminder } from "@/types";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

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