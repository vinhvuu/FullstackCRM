"use client";

import { useState } from "react";
import { TimelineItem, TimelineItemType, RecordType, Activity, Attachment } from "@/types";
import { TimelineComposer, typeConfig } from "./timeline-composer";
import { addTimelineItem } from "@/lib/timeline";
import { AttachmentPanel } from "@/components/comm/attachment-panel";
import { PendingFile } from "@/components/comm/file-uploader";
import { getAttachments, addAttachment, removeAttachment } from "@/lib/mock-data";
import { Paperclip } from "lucide-react";

const filterLabels: Record<TimelineItemType | "all", string> = {
  all: "Tất cả",
  note: "Ghi chú",
  call: "Cuộc gọi",
  email: "Email",
  meeting: "Cuộc họp",
  task: "Task",
  system: "Hệ thống",
};

interface RecordTimelineProps {
  recordType: RecordType;
  recordId: string;
  items: TimelineItem[];
  onItemsChange: (items: TimelineItem[]) => void;
  createdBy?: string;
  ctx?: Record<string, string>;
  defaultTo?: string;
}

export function RecordTimeline({
  recordType,
  recordId,
  items,
  onItemsChange,
  createdBy = "Bạn",
  ctx = {},
  defaultTo = "",
}: RecordTimelineProps) {
  const [filter, setFilter] = useState<TimelineItemType | "all">("all");
  const [tab, setTab] = useState<"activity" | "files">("activity");
  const [attachments, setAttachments] = useState<Attachment[]>(() =>
    getAttachments(recordType, recordId)
  );
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const filterTypes: (TimelineItemType | "all")[] = [
    "all", "note", "call", "email", "meeting", "task",
  ];

  const displayed = filter === "all" ? items : items.filter((i) => i.type === filter);

  const handleAdd = (item: TimelineItem, followUpTask?: Omit<Activity, "id">) => {
    const stored = addTimelineItem(recordType, recordId, {
      type: item.type,
      title: item.title,
      content: item.content,
      createdAt: new Date().toLocaleString("vi-VN"),
      createdBy,
      meta: item.meta,
    });
    if (followUpTask) {
      const taskItem = addTimelineItem(recordType, recordId, {
        type: "task",
        title: followUpTask.title,
        content: followUpTask.description,
        createdAt: new Date().toLocaleString("vi-VN"),
        createdBy,
        meta: { dueDate: followUpTask.dueDate, autoCreated: true },
      });
      onItemsChange([taskItem, stored, ...items]);
    } else {
      onItemsChange([stored, ...items]);
    }
  };

  const handleUpload = () => {
    if (!pendingFiles.length) return;
    const now = new Date().toLocaleDateString("vi-VN");
    const added: Attachment[] = pendingFiles.map((f) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      relatedType: recordType,
      relatedId: recordId,
      fileName: f.name,
      mimeType: f.type,
      sizeBytes: f.size,
      url: f.dataUrl,
      uploadedBy: createdBy,
      createdAt: now,
    }));
    added.forEach((a) => addAttachment(a));
    setAttachments((prev) => [...added, ...prev]);
    setPendingFiles([]);
  };

  const handleDeleteAttachment = (id: string) => {
    removeAttachment(id);
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2 border-b border-gray-100 pb-2">
        <button
          type="button"
          onClick={() => setTab("activity")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "activity" ? "bg-indigo-600 text-white" : "bg-gray-100 text-text-muted hover:bg-gray-200"
          }`}
        >
          Hoạt động
        </button>
        <button
          type="button"
          onClick={() => setTab("files")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "files" ? "bg-indigo-600 text-white" : "bg-gray-100 text-text-muted hover:bg-gray-200"
          }`}
        >
          <Paperclip className="w-3.5 h-3.5" />
          Files {attachments.length > 0 && `(${attachments.length})`}
        </button>
      </div>

      {tab === "files" ? (
        <AttachmentPanel
          attachments={attachments}
          pendingFiles={pendingFiles}
          onPendingChange={setPendingFiles}
          onDelete={handleDeleteAttachment}
          onUpload={handleUpload}
        />
      ) : (
        <>
          <TimelineComposer
            recordType={recordType}
            recordId={recordId}
            defaultTo={defaultTo}
            ctx={ctx}
            onSubmit={handleAdd}
          />

          <div className="flex gap-2 flex-wrap">
            {filterTypes.map((ft) => (
              <button
                key={ft}
                type="button"
                onClick={() => setFilter(ft)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === ft
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-text-muted hover:bg-gray-200"
                }`}
              >
                {filterLabels[ft]}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100" />
            <div className="space-y-6">
              {displayed.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8 pl-10">
                  Chưa có hoạt động nào
                </p>
              ) : (
                displayed.map((item) => {
                  const config = typeConfig[item.type];
                  const Icon = config.icon;
                  const attachedFiles = item.meta?.attachments as string[] | undefined;
                  return (
                    <div key={item.id} className="relative flex gap-4 pl-10">
                      <div
                        className={`absolute left-2 w-6 h-6 rounded-full ${config.color} flex items-center justify-center`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-text-dark text-sm">{item.title}</h4>
                          <span className="text-xs text-text-muted">{item.createdAt}</span>
                        </div>
                        <p className="text-sm text-text-dark mb-2">{item.content}</p>
                        {attachedFiles && attachedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {attachedFiles.map((f) => (
                              <span key={f} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-text-muted rounded px-2 py-0.5">
                                <Paperclip className="w-3 h-3" />{f}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-text-muted">bởi {item.createdBy}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
