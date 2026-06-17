import { Activity, ActivityStatus, RecurrenceRule, LeadReminder, RecordType } from "@/types";

export function computeStatus(a: Activity, now: Date = new Date()): ActivityStatus {
  if (a.status === "completed") return "completed";
  return new Date(a.dueDate) < now ? "overdue" : "pending";
}

export function getMyDay(
  activities: Activity[],
  reminders: LeadReminder[],
  now: Date = new Date()
) {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
  const upcomingStart = new Date(todayEnd.getTime() + 1);

  const overdue: Activity[] = [];
  const today: Activity[] = [];
  const upcoming: Activity[] = [];

  const relevantReminders = reminders.filter((r) => {
    const reminderDate = new Date(`${r.date}T${r.time || "00:00"}`);
    return r.status !== "completed" && reminderDate >= todayStart && reminderDate <= todayEnd;
  });

  for (const activity of activities) {
    const status = computeStatus(activity, now);
    const activityDate = new Date(activity.dueDate);

    if (status === "completed") continue;

    if (activityDate < todayStart) {
      overdue.push(activity);
    } else if (activityDate <= todayEnd) {
      today.push(activity);
    } else if (activityDate >= upcomingStart && activityDate < new Date(upcomingStart.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      upcoming.push(activity);
    }
  }

  return {
    overdue,
    today,
    upcoming,
    reminders: relevantReminders,
  };
}

export function nextOccurrence(a: Activity): Activity | null {
  if (!a.recurrence) return null;

  const { freq, interval, until } = a.recurrence;
  const currentDueDate = new Date(a.dueDate);
  const now = new Date();

  if (until) {
    const untilDate = new Date(until);
    if (currentDueDate >= untilDate) return null;
  }

  let nextDate: Date;
  switch (freq) {
    case "daily":
      nextDate = new Date(currentDueDate.getTime() + interval * 24 * 60 * 60 * 1000);
      break;
    case "weekly":
      nextDate = new Date(currentDueDate.getTime() + interval * 7 * 24 * 60 * 60 * 1000);
      break;
    case "monthly":
      nextDate = new Date(currentDueDate);
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
    default:
      return null;
  }

  if (nextDate <= now && !until) {
    return nextOccurrence({ ...a, dueDate: nextDate.toISOString().split("T")[0] });
  }

  return {
    ...a,
    id: `${a.id}-${nextDate.toISOString().split("T")[0]}`,
    dueDate: nextDate.toISOString().split("T")[0],
    status: "pending" as ActivityStatus,
    completedAt: undefined,
  };
}

export function getRecordLink(relatedType?: RecordType, relatedId?: string): string | null {
  if (!relatedType || !relatedId) return null;
  switch (relatedType) {
    case "lead": return `/leads/${relatedId}`;
    case "contact": return `/contacts/${relatedId}`;
    case "deal": return `/deals/${relatedId}`;
    case "company": return `/companies/${relatedId}`;
    default: return null;
  }
}