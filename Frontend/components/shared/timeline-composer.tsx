"use client";

import { useState } from "react";
import { TimelineItemType, TimelineItem, RecordType, Activity } from "@/types";
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail, Calendar, FileText, CheckSquare } from "lucide-react";
import { MentionInput } from "@/components/comm/mention-input";
import { CallLogDialog } from "@/components/comm/call-log-dialog";
import { EmailComposerDialog } from "@/components/comm/email-composer-dialog";
import { mentionUsers } from "@/lib/mock-data";

const typeConfig: Record<
  TimelineItemType,
  { icon: React.ElementType; color: string; label: string }
> = {
  call: { icon: PhoneCall, color: "bg-blue-100 text-blue-600", label: "Cuộc gọi" },
  email: { icon: Mail, color: "bg-green-100 text-green-600", label: "Email" },
  meeting: { icon: Calendar, color: "bg-orange-100 text-orange-600", label: "Cuộc họp" },
  note: { icon: FileText, color: "bg-purple-100 text-purple-600", label: "Ghi chú" },
  task: { icon: CheckSquare, color: "bg-yellow-100 text-yellow-600", label: "Task" },
  system: { icon: FileText, color: "bg-gray-100 text-gray-600", label: "Hệ thống" },
};

interface TimelineComposerProps {
  recordType: RecordType;
  recordId: string;
  defaultTo?: string;
  ctx?: Record<string, string>;
  onSubmit: (item: TimelineItem, followUpTask?: Omit<Activity, "id">) => void;
}

export function TimelineComposer({
  recordType,
  recordId,
  defaultTo = "",
  ctx = {},
  onSubmit,
}: TimelineComposerProps) {
  const [activeType, setActiveType] = useState<TimelineItemType>("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);
  const [callOpen, setCallOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  const composableTypes: TimelineItemType[] = ["note", "call", "email", "meeting", "task"];

  const handleTabClick = (type: TimelineItemType) => {
    setActiveType(type);
    if (type === "call") { setCallOpen(true); return; }
    if (type === "email") { setEmailOpen(true); return; }
  };

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const item: TimelineItem = {
      id: `tl-${Date.now()}`,
      type: activeType,
      title: title.trim() || typeConfig[activeType].label,
      content: content.trim(),
      createdAt: new Date().toLocaleString("vi-VN"),
      createdBy: "Bạn",
      meta: mentions.length ? { mentions } : undefined,
    };
    onSubmit(item);
    setTitle("");
    setContent("");
    setMentions([]);
  };

  const isDialog = activeType === "call" || activeType === "email";

  return (
    <>
      <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex gap-2 flex-wrap">
          {composableTypes.map((type) => {
            const config = typeConfig[type];
            const Icon = config.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTabClick(type)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeType === type
                    ? `${config.color} ring-2 ring-offset-2 ring-indigo-500`
                    : "bg-white text-text-muted hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </button>
            );
          })}
        </div>

        {!isDialog && (
          <form onSubmit={handleInlineSubmit} className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề (tùy chọn)"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
            {activeType === "note" ? (
              <MentionInput
                value={content}
                onChange={setContent}
                onMentionsChange={setMentions}
                users={mentionUsers}
              />
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none"
              />
            )}
            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                Lưu lại
              </Button>
            </div>
          </form>
        )}
      </div>

      <CallLogDialog
        open={callOpen}
        onOpenChange={(v) => { setCallOpen(v); if (!v) setActiveType("note"); }}
        relatedType={recordType}
        relatedId={recordId}
        onLogged={(item, followUp) => { onSubmit(item, followUp); setActiveType("note"); }}
      />

      <EmailComposerDialog
        open={emailOpen}
        onOpenChange={(v) => { setEmailOpen(v); if (!v) setActiveType("note"); }}
        relatedType={recordType}
        relatedId={recordId}
        defaultTo={defaultTo}
        ctx={ctx}
        onLogged={(item) => { onSubmit(item); setActiveType("note"); }}
      />
    </>
  );
}

export { typeConfig };
