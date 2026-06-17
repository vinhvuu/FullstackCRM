"use client";

import { Attachment, RecordType } from "@/types";
import { FileUploader, PendingFile } from "./file-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paperclip, Download, Trash2, FileText, Image } from "lucide-react";

interface AttachmentPanelProps {
  attachments: Attachment[];
  pendingFiles: PendingFile[];
  onPendingChange: (files: PendingFile[]) => void;
  onDelete?: (id: string) => void;
  onUpload?: () => void;
}

function fileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  return FileText;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentPanel({ attachments, pendingFiles, onPendingChange, onDelete, onUpload }: AttachmentPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Paperclip className="w-4 h-4" />
          Đính kèm ({attachments.length + pendingFiles.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((att) => {
              const Icon = fileIcon(att.mimeType);
              return (
                <div key={att.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                  <Icon className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-dark truncate">{att.fileName}</p>
                    <p className="text-xs text-text-muted">{formatBytes(att.sizeBytes)} · {att.uploadedBy}</p>
                  </div>
                  <div className="flex gap-1">
                    <a href={att.url} download={att.fileName} className="p-1 rounded hover:bg-gray-200 text-text-muted hover:text-indigo-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </a>
                    {onDelete && (
                      <button type="button" onClick={() => onDelete(att.id)} className="p-1 rounded hover:bg-gray-200 text-text-muted hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <FileUploader files={pendingFiles} onChange={onPendingChange} />
        {pendingFiles.length > 0 && onUpload && (
          <div className="flex justify-end">
            <Button type="button" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={onUpload}>
              Tải lên ({pendingFiles.length} file)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
