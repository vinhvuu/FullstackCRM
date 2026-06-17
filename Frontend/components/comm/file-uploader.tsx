"use client";

import { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";

export interface PendingFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

interface FileUploaderProps {
  files: PendingFile[];
  onChange: (files: PendingFile[]) => void;
  maxSizeMB?: number;
  accept?: string;
}

const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "text/plain",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploader({
  files,
  onChange,
  maxSizeMB = 10,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt",
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFiles = (fileList: FileList) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    const newFiles: PendingFile[] = [];
    for (const file of Array.from(fileList)) {
      if (!ALLOWED_MIME.includes(file.type)) {
        alert(`Loại file không được hỗ trợ: ${file.name}`);
        continue;
      }
      if (file.size > maxBytes) {
        alert(`File quá lớn (tối đa ${maxSizeMB}MB): ${file.name}`);
        continue;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        newFiles.push({ name: file.name, size: file.size, type: file.type, dataUrl: e.target?.result as string });
        if (newFiles.length === fileList.length) onChange([...files, ...newFiles]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
          dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files); }}
      >
        <Paperclip className="w-4 h-4 mx-auto text-text-muted mb-1" />
        <p className="text-xs text-text-muted">Kéo-thả hoặc click để đính kèm</p>
        <p className="text-xs text-text-muted opacity-60">Tối đa {maxSizeMB}MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => { if (e.target.files) processFiles(e.target.files); }}
      />
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
              <Paperclip className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="text-xs text-text-dark truncate flex-1">{f.name}</span>
              <span className="text-xs text-text-muted flex-shrink-0">{formatBytes(f.size)}</span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="text-text-muted hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
