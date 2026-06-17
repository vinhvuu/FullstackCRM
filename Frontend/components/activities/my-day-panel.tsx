"use client";

import { Activity, LeadReminder } from "@/types";
import { getMyDay, computeStatus, getRecordLink } from "@/lib/activities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Phone, Mail, Calendar, CheckCircle, AlertCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MyDayPanelProps {
  activities: Activity[];
  reminders?: LeadReminder[];
  onCompleteActivity?: (activityId: string) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckCircle,
};

export function MyDayPanel({ activities, reminders = [], onCompleteActivity }: MyDayPanelProps) {
  const router = useRouter();
  const { overdue, today, upcoming, reminders: todayReminders } = getMyDay(activities, reminders);

  const handleSnooze = (activityId: string, days: number) => {
    console.log("Snooze activity", activityId, "by", days, "days");
  };

  const handleRecordClick = (relatedType?: string, relatedId?: string) => {
    const link = getRecordLink(relatedType as any, relatedId);
    if (link) router.push(link);
  };

  const renderActivityItem = (activity: Activity, showDate: boolean = false) => {
    const Icon = typeIcons[activity.type] || CheckCircle;
    const status = computeStatus(activity);
    const recordLink = getRecordLink(activity.relatedType, activity.relatedId);

    return (
      <div
        key={activity.id}
        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
      >
        <input
          type="checkbox"
          checked={activity.status === "completed"}
          onChange={() => onCompleteActivity?.(activity.id)}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <div className={`p-2 rounded-lg ${activity.type === 'call' ? 'bg-blue-500/10' : activity.type === 'email' ? 'bg-purple-500/10' : activity.type === 'meeting' ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
          <Icon className={`w-4 h-4 ${activity.type === 'call' ? 'text-blue-500' : activity.type === 'email' ? 'text-purple-500' : activity.type === 'meeting' ? 'text-orange-500' : 'text-green-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium text-text-dark ${activity.status === 'completed' ? 'line-through text-text-muted' : ''}`}>
              {activity.title}
            </span>
            {activity.priority === 'high' && (
              <Badge variant="destructive" className="text-xs">High</Badge>
            )}
            {activity.recurrence && (
              <Badge variant="outline" className="text-xs">Recurring</Badge>
            )}
          </div>
          {activity.description && (
            <p className="text-sm text-text-muted truncate mt-0.5">{activity.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {showDate && (
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(activity.dueDate)}
              </span>
            )}
            {recordLink && (
              <button
                onClick={() => handleRecordClick(activity.relatedType, activity.relatedId)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View record <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        {status === 'overdue' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSnooze(activity.id, 1)}
            className="text-xs"
          >
            Snooze
          </Button>
        )}
      </div>
    );
  };

  const renderReminderItem = (reminder: LeadReminder) => (
    <div
      key={`reminder-${reminder.id}`}
      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100"
    >
      <div className="p-2 rounded-lg bg-yellow-500/10">
        <Clock className="w-4 h-4 text-yellow-500" />
      </div>
      <div className="flex-1">
        <span className="font-medium text-text-dark">{reminder.note}</span>
        <p className="text-xs text-text-muted mt-0.5">
          {reminder.date} {reminder.time}
        </p>
      </div>
      <Link href={`/leads/${reminder.leadId}`} className="text-xs text-primary hover:underline">
        View lead
      </Link>
    </div>
  );

  const totalItems = overdue.length + today.length + upcoming.length + todayReminders.length;

  if (totalItems === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-text-muted">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>You're all caught up!</p>
            <p className="text-sm mt-1">No tasks due today or overdue.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          My Day
          {overdue.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {overdue.length} overdue
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {overdue.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-600 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4" />
              Overdue ({overdue.length})
            </h4>
            <div className="space-y-2">
              {overdue.map((a) => renderActivityItem(a, true))}
            </div>
          </div>
        )}

        {today.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-dark flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" />
              Today ({today.length})
            </h4>
            <div className="space-y-2">
              {today.map((a) => renderActivityItem(a))}
            </div>
          </div>
        )}

        {todayReminders.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-yellow-600 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" />
              Reminders ({todayReminders.length})
            </h4>
            <div className="space-y-2">
              {todayReminders.map(renderReminderItem)}
            </div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-muted flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" />
              Upcoming ({upcoming.length})
            </h4>
            <div className="space-y-2">
              {upcoming.map((a) => renderActivityItem(a, true))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}