"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { leads as initialLeads, convertLeadToDeal } from "@/lib/mock-data";
import { getTimeline } from "@/lib/timeline";
import { Lead, TimelineItem, LeadReminder, ConvertLeadData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadScore } from "@/components/leads/lead-score";
import { LeadTags } from "@/components/leads/lead-tags";
import { ConvertLeadDialog } from "@/components/leads/convert-lead-dialog";
import { LeadReminderList } from "@/components/leads/lead-reminder-list";
import { LeadReminderForm } from "@/components/leads/lead-reminder-form";
import { RecordTimeline } from "@/components/shared/record-timeline";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  User,
  Edit,
  Trash2,
  MessageSquare,
  FileText,
  PhoneCall,
  MapPin,
  TrendingUp,
  Bell,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LeadDetailPage() {
  const params = useParams();
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id;
  const initialLead = initialLeads.find((l) => l.id === paramId) || null;

  const [lead, setLead] = useState<Lead | null>(initialLead);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setLead(initialLead);
    setStatusMessage(null);
  }, [initialLead]);

  useEffect(() => {
    if (initialLead) {
      setTimelineItems(getTimeline("lead", initialLead.id));
    }
  }, [initialLead]);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-text-muted mb-4">Lead not found</p>
        <Link href="/leads">
          <Button variant="outline">Back to Leads</Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
      new: "info",
      contacted: "default",
      qualified: "success",
      lost: "error",
    };
    const labels: Record<string, string> = {
      new: "New",
      contacted: "Contacted",
      qualified: "Qualified",
      lost: "Lost",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleConvertToDeal = (data: ConvertLeadData) => {
    const result = convertLeadToDeal(data, lead);

    const updatedLead = { ...lead, status: "qualified" as const };
    setLead(updatedLead);
    setTimelineItems((current) => [
      {
        id: Date.now().toString(),
        type: "note" as const,
        title: "Converted to deal",
        content: `Converted to deal ${result.deal.title}${result.contact ? " and created a contact record" : ""}.`,
        createdAt: new Date().toLocaleString("vi-VN"),
        createdBy: lead.assignee,
      },
      ...current,
    ]);
    setStatusMessage(`Created deal ${result.deal.title} successfully.`);
    setIsConvertDialogOpen(false);
  };

  const handleAddReminder = (data: Omit<LeadReminder, "id" | "createdAt" | "status">) => {
    if (!lead) return;
    
    const newReminder: LeadReminder = {
      ...data,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    
    const updatedReminders = [...(lead.reminders || []), newReminder];
    setLead({ ...lead, reminders: updatedReminders });
    setIsReminderDialogOpen(false);
  };

  const handleCompleteReminder = (reminderId: string) => {
    if (!lead) return;
    
    const updatedReminders = lead.reminders.map(r => 
      r.id === reminderId 
        ? { ...r, status: "completed" as const, completedAt: new Date().toISOString().split("T")[0] }
        : r
    );
    setLead({ ...lead, reminders: updatedReminders });
  };

  const handleSnoozeReminder = (reminderId: string, days: number) => {
    if (!lead) return;
    
    const reminder = lead.reminders.find(r => r.id === reminderId);
    if (!reminder) return;
    
    const newDate = new Date(reminder.date);
    newDate.setDate(newDate.getDate() + days);
    
    const updatedReminders = lead.reminders.map(r =>
      r.id === reminderId
        ? { ...r, date: newDate.toISOString().split("T")[0] }
        : r
    );
    setLead({ ...lead, reminders: updatedReminders });
  };

  const handleDeleteReminder = (reminderId: string) => {
    if (!lead) return;
    
    const updatedReminders = lead.reminders.filter(r => r.id !== reminderId);
    setLead({ ...lead, reminders: updatedReminders });
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {statusMessage}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link href="/leads">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Leads
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
            <Button variant="ghost" className="gap-2 text-red-600 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-xl font-bold">
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{lead.name}</CardTitle>
                    <p className="text-text-muted flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4" />
                      {lead.company}
                    </p>
                  </div>
                </div>
                {getStatusBadge(lead.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Email</p>
                  <p className="font-medium text-text-dark flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Phone</p>
                  <p className="font-medium text-text-dark flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {lead.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Source</p>
                  <p className="font-medium text-text-dark">{lead.source}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Created</p>
                  <p className="font-medium text-text-dark flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(lead.createdAt)}
                  </p>
                </div>
              </div>

              {lead.tags && lead.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-text-muted mb-2">Tags</p>
                  <LeadTags tags={lead.tags} clickable onTagClick={(tag) => console.log("Filter by:", tag)} />
                </div>
              )}

              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-text-dark mb-4">Lead Score Analysis</h4>
                <div className="flex items-center gap-6">
                  <LeadScore score={lead.score} />
                  <div className="flex-1">
                    <p className="text-sm text-text-muted mb-2">AI-powered analysis</p>
                    <p className="text-sm text-text-dark">
                      {lead.score >= 80
                        ? "Highly qualified lead with strong conversion potential."
                        : lead.score >= 60
                        ? "Good lead with moderate conversion potential."
                        : "Requires more nurturing before conversion."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Lịch sử tương tác & Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <RecordTimeline
                recordType="lead"
                recordId={lead.id}
                items={timelineItems}
                onItemsChange={setTimelineItems}
                createdBy={lead.assignee}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <Phone className="w-4 h-4 text-blue-500" />
                Call Lead
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <Mail className="w-4 h-4 text-green-500" />
                Send Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <MessageSquare className="w-4 h-4 text-purple-500" />
                Add Note
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <Calendar className="w-4 h-4 text-orange-500" />
                Schedule Meeting
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => setIsConvertDialogOpen(true)}
              >
                <TrendingUp className="w-4 h-4 text-green-500" />
                Convert to Deal
              </Button>
              <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                  >
                    <Bell className="w-4 h-4 text-orange-500" />
                    Set Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Set Follow-up Reminder</DialogTitle>
                  </DialogHeader>
                  <LeadReminderForm
                    leadId={lead.id}
                    leadName={lead.name}
                    onSubmit={handleAddReminder}
                    onCancel={() => setIsReminderDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadReminderList
                reminders={lead.reminders || []}
                onComplete={handleCompleteReminder}
                onSnooze={handleSnoozeReminder}
                onDelete={handleDeleteReminder}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {lead.assignee
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-text-dark">{lead.assignee}</p>
                  <p className="text-sm text-text-muted">Sales Representative</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConvertLeadDialog
        lead={lead}
        open={isConvertDialogOpen}
        onOpenChange={setIsConvertDialogOpen}
        onConvert={handleConvertToDeal}
      />
    </div>
  );
}
