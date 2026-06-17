"use client";

import { useState } from "react";
import { RecordType, TimelineItem } from "@/types";
import { renderTemplate } from "@/lib/templates";
import { PendingFile, FileUploader } from "./file-uploader";
import { EmailTemplatePicker } from "./email-template-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail } from "lucide-react";

interface EmailComposerDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  relatedType: RecordType;
  relatedId: string;
  defaultTo?: string;
  ctx?: Record<string, string>;
  onLogged: (item: TimelineItem) => void;
}

export function EmailComposerDialog({
  open,
  onOpenChange,
  defaultTo = "",
  ctx = {},
  onLogged,
}: EmailComposerDialogProps) {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [showCc, setShowCc] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject) return;
    onLogged({
      id: `email-${Date.now()}`,
      type: "email",
      title: `Email: ${subject}`,
      content: body,
      createdAt: new Date().toLocaleString("vi-VN"),
      createdBy: "Bạn",
      meta: { to, cc, attachments: files.map((f) => f.name) },
    });
    setTo(defaultTo);
    setCc("");
    setSubject("");
    setBody("");
    setFiles([]);
    onOpenChange(false);
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            Soạn Email
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted w-8">Đến</span>
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="email@example.com" className={`${inputCls} flex-1`} required />
            <button type="button" onClick={() => setShowCc((v) => !v)} className="text-xs text-indigo-600 hover:underline whitespace-nowrap">CC</button>
          </div>
          {showCc && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted w-8">CC</span>
              <input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="email@example.com" className={`${inputCls} flex-1`} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted w-8">Tiêu đề</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Tiêu đề email..." className={`${inputCls} flex-1`} required />
            <EmailTemplatePicker
              onSelect={(tpl) => {
                setSubject(renderTemplate(tpl.subject, ctx));
                setBody(renderTemplate(tpl.body, ctx));
              }}
            />
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Nội dung email..."
            className={`${inputCls} resize-none`}
          />
          <FileUploader files={files} onChange={setFiles} />
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Mail className="w-4 h-4" /> Ghi log Email
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
