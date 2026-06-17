"use client";

import { useState, useMemo } from "react";
import { activities as initialActivities, leads } from "@/lib/mock-data";
import { Activity, ActivityStatus, ActivityType, ActivityPriority } from "@/types";
import { computeStatus, nextOccurrence } from "@/lib/activities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { ActivityForm } from "@/components/activities/activity-form";
import { ActivityCalendar } from "@/components/activities/activity-calendar";
import { MyDayPanel } from "@/components/activities/my-day-panel";
import { PriorityBadge } from "@/components/activities/priority-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  List,
  LayoutGrid,
  Sun,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ViewMode = "list" | "calendar" | "today";

const typeIcons: Record<ActivityType, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckCircle,
};

const typeColors: Record<ActivityType, string> = {
  call: "bg-blue-500/10 text-blue-500",
  email: "bg-purple-500/10 text-purple-500",
  meeting: "bg-orange-500/10 text-orange-500",
  task: "bg-green-500/10 text-green-500",
};

export default function ActivitiesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filter, setFilter] = useState<ActivityStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ActivityPriority | "all">("all");
  const [activityList, setActivityList] = useState<Activity[]>(initialActivities);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const allReminders = useMemo(() => {
    return leads.flatMap((l) => l.reminders);
  }, []);

  const filteredActivities = useMemo(() => {
    return activityList.filter((activity) => {
      const computedStatus = computeStatus(activity);
      if (filter !== "all" && computedStatus !== filter) return false;
      if (typeFilter !== "all" && activity.type !== typeFilter) return false;
      if (priorityFilter !== "all" && activity.priority !== priorityFilter) return false;
      return true;
    });
  }, [activityList, filter, typeFilter, priorityFilter]);

  const handleAddActivity = (activity: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivityList([newActivity, ...activityList]);
    setIsAddModalOpen(false);
  };

  const handleUpdateActivity = (activity: Omit<Activity, "id">) => {
    if (editingActivity) {
      setActivityList(
        activityList.map((a) =>
          a.id === editingActivity.id ? { ...a, ...activity } : a
        )
      );
      setEditingActivity(null);
    }
  };

  const handleDeleteActivity = (id: string) => {
    setActivityList(activityList.filter((a) => a.id !== id));
  };

  const handleCompleteActivity = (id: string) => {
    setActivityList(
      activityList.map((a) => {
        if (a.id === id) {
          const completed = { ...a, status: "completed" as ActivityStatus, completedAt: new Date().toISOString() };
          if (a.recurrence) {
            const next = nextOccurrence(a);
            if (next) {
              setActivityList((prev) => [...prev, next]);
            }
          }
          return completed;
        }
        return a;
      })
    );
  };

  const handleSelectActivity = (activity: Activity) => {
    setEditingActivity(activity);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Activities</h1>
          <p className="text-text-muted mt-1">Track your tasks, calls, emails and meetings</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button variant="cta" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
            </DialogHeader>
            <ActivityForm onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddActivity} />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Activity</DialogTitle>
            </DialogHeader>
            <ActivityForm activity={editingActivity} onClose={() => setEditingActivity(null)} onSubmit={handleUpdateActivity} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-1"
              >
                <List className="w-4 h-4" />
                List
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="gap-1"
              >
                <LayoutGrid className="w-4 h-4" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "today" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("today")}
                className="gap-1"
              >
                <Sun className="w-4 h-4" />
                Today
              </Button>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2 hidden lg:block" />

            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className="gap-1"
            >
              <Filter className="w-4 h-4" />
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("pending")}
              className="gap-1"
            >
              <Clock className="w-4 h-4" />
              Pending
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("completed")}
              className="gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              Completed
            </Button>
            <Button
              variant={filter === "overdue" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("overdue")}
              className="gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              Overdue
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ActivityType | "all")}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
            >
              <option value="all">All Types</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as ActivityPriority | "all")}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity}
                  onEdit={() => setEditingActivity(activity)}
                  onDelete={() => handleDeleteActivity(activity.id)}
                  onComplete={() => handleCompleteActivity(activity.id)}
                />
              ))}
            </div>
          )}

          {viewMode === "calendar" && (
            <ActivityCalendar
              activities={filteredActivities}
              view="month"
              currentDate={calendarDate}
              onDateChange={setCalendarDate}
              onSelectActivity={handleSelectActivity}
            />
          )}

          {viewMode === "today" && (
            <MyDayPanel
              activities={activityList}
              reminders={allReminders}
              onCompleteActivity={handleCompleteActivity}
            />
          )}

          {viewMode === "list" && filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">No activities found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ 
  activity, 
  onEdit, 
  onDelete,
  onComplete,
}: { 
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}) {
  const Icon = typeIcons[activity.type];
  const computedStatus = computeStatus(activity);

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${typeColors[activity.type]}`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-text-dark">{activity.title}</h3>
                <p className="text-sm text-text-muted mt-1">{activity.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={computedStatus === "completed" ? "success" : computedStatus === "overdue" ? "destructive" : "warning"}
                  className="capitalize"
                >
                  {computedStatus}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {computedStatus !== "completed" && (
                      <DropdownMenuItem className="gap-2" onClick={onComplete}>
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="gap-2" onClick={onEdit}>
                      <Edit className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-red-600" onClick={onDelete}>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(activity.dueDate)}</span>
              </div>
              <Badge variant="default" className="capitalize">
                {activity.type}
              </Badge>
              {activity.priority && (
                <PriorityBadge priority={activity.priority} />
              )}
              {activity.recurrence && (
                <Badge variant="outline" className="text-xs">Recurring</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}