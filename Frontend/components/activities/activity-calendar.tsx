"use client";

import { useState, useMemo } from "react";
import { Activity, ActivityType } from "@/types";
import { computeStatus } from "@/lib/activities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
} from "lucide-react";

type CalendarView = "month" | "week" | "day";

const typeColors: Record<ActivityType, string> = {
  call: "bg-blue-500",
  email: "bg-purple-500",
  meeting: "bg-orange-500",
  task: "bg-green-500",
};

const typeIcons: Record<ActivityType, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckCircle,
};

interface ActivityCalendarProps {
  activities: Activity[];
  view: CalendarView;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSelectActivity: (activity: Activity) => void;
  onMoveActivity?: (activityId: string, newDate: string) => void;
}

export function ActivityCalendar({
  activities,
  view,
  currentDate,
  onDateChange,
  onSelectActivity,
  onMoveActivity,
}: ActivityCalendarProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const monthDays = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const getActivitiesForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return activities.filter((a) => {
      const activityDate = a.dueDate.split("T")[0];
      return activityDate === dateStr;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onDateChange(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const formatHeader = () => {
    if (view === "month") {
      return currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
    } else if (view === "week") {
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })} - ${end.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" })}`;
    } else {
      return currentDate.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    }
  };

  const weekDaysHeaders = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  if (view === "month") {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={navigatePrev}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="font-semibold text-text-dark">{formatHeader()}</h3>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDaysHeaders.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-text-muted">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {monthDays.map(({ date, isCurrentMonth }, idx) => {
            const dayActivities = getActivitiesForDate(date);
            const today = isToday(date);
            return (
              <div
                key={idx}
                className={`min-h-[100px] p-2 border-r border-b border-gray-100 ${
                  !isCurrentMonth ? "bg-gray-50" : ""
                } ${today ? "bg-blue-50" : ""}`}
              >
                <div className={`text-sm mb-1 ${today ? "font-bold text-primary" : "text-text-muted"}`}>
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayActivities.slice(0, 3).map((a) => {
                    const Icon = typeIcons[a.type];
                    return (
                      <button
                        key={a.id}
                        onClick={() => onSelectActivity(a)}
                        className={`w-full text-xs text-white px-1.5 py-0.5 rounded truncate ${typeColors[a.type]} hover:opacity-90 text-left flex items-center gap-1`}
                      >
                        <Icon className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{a.title}</span>
                      </button>
                    );
                  })}
                  {dayActivities.length > 3 && (
                    <div className="text-xs text-text-muted">+{dayActivities.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "week" || view === "day") {
    const days = view === "week" ? weekDays : [currentDate];
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={navigatePrev}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="font-semibold text-text-dark">{formatHeader()}</h3>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <div className="flex">
            <div className="w-16 flex-shrink-0 border-r border-gray-200" />
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`flex-1 min-w-[100px] p-2 text-center border-r border-gray-200 ${
                  isToday(day) ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-xs text-text-muted">
                  {day.toLocaleDateString("vi-VN", { weekday: "short" })}
                </div>
                <div className={`text-lg font-semibold ${isToday(day) ? "text-primary" : ""}`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="flex border-b border-gray-100">
                <div className="w-16 flex-shrink-0 p-2 text-xs text-text-muted border-r border-gray-200">
                  {hour}:00
                </div>
                {days.map((day, idx) => {
                  const dayActivities = getActivitiesForDate(day).filter((a) => {
                    const activityHour = new Date(a.dueDate).getHours();
                    return activityHour === hour;
                  });
                  return (
                    <div
                      key={idx}
                      className="flex-1 min-h-[40px] p-1 border-r border-gray-100 hover:bg-gray-50"
                    >
                      {dayActivities.map((a) => {
                        const Icon = typeIcons[a.type];
                        return (
                          <button
                            key={a.id}
                            onClick={() => onSelectActivity(a)}
                            className={`w-full text-xs text-white px-1.5 py-0.5 rounded mb-1 ${typeColors[a.type]} hover:opacity-90 text-left flex items-center gap-1`}
                          >
                            <Icon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{a.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}