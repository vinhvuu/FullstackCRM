"use client";

import { useState } from "react";
import { Activity, ActivityType, ActivityStatus, ActivityPriority, RecordType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Calendar, CheckCircle, Clock, Bell } from "lucide-react";
import { RecurrenceEditor } from "./recurrence-editor";
import { RelatedRecordPicker } from "./related-record-picker";
import { PriorityBadge } from "./priority-badge";

interface ActivityFormProps {
  activity?: Activity | null;
  onClose: () => void;
  onSubmit: (activity: Omit<Activity, "id">) => void;
}

const typeOptions: { value: ActivityType; label: string; icon: React.ElementType }[] = [
  { value: "call", label: "Call", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "meeting", label: "Meeting", icon: Calendar },
  { value: "task", label: "Task", icon: CheckCircle },
];

const priorityOptions: { value: ActivityPriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function ActivityForm({ activity, onClose, onSubmit }: ActivityFormProps) {
  const [title, setTitle] = useState(activity?.title || "");
  const [type, setType] = useState<ActivityType>(activity?.type || "task");
  const [dueDate, setDueDate] = useState(activity?.dueDate || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [priority, setPriority] = useState<ActivityPriority>(activity?.priority || "medium");
  const [remindAt, setRemindAt] = useState(activity?.remindAt || "");
  const [related, setRelated] = useState<{ type: RecordType; id: string } | undefined>(
    activity?.relatedType && activity?.relatedId
      ? { type: activity.relatedType, id: activity.relatedId }
      : undefined
  );
  const [recurrence, setRecurrence] = useState(activity?.recurrence);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      type,
      title,
      description,
      dueDate,
      status: activity?.status || "pending",
      priority,
      remindAt: remindAt || undefined,
      relatedType: related?.type,
      relatedId: related?.id,
      recurrence,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-text-dark">Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter activity title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-text-dark">Type</Label>
        <div className="flex gap-2">
          {typeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  type === option.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-muted hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-text-dark">Priority</Label>
        <div className="flex gap-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPriority(option.value)}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                priority === option.value
                  ? option.value === "high"
                    ? "bg-red-500 text-white"
                    : option.value === "medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-gray-100 text-text-muted hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-text-dark">Due Date</Label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-text-dark">Remind At</Label>
          <Input
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
          />
        </div>
      </div>

      <RelatedRecordPicker value={related} onChange={setRelated} />

      <RecurrenceEditor value={recurrence} onChange={setRecurrence} />

      <div className="space-y-2">
        <Label className="text-text-dark">Description</Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="cta">
          {activity ? "Update Activity" : "Add Activity"}
        </Button>
      </div>
    </form>
  );
}