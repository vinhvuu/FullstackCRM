"use client";

import { useState } from "react";
import { EmailTemplate } from "@/types";
import { emailTemplates } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText } from "lucide-react";

interface EmailTemplatePickerProps {
  onSelect: (tpl: EmailTemplate) => void;
}

export function EmailTemplatePicker({ onSelect }: EmailTemplatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1 text-xs"
        onClick={() => setOpen((v) => !v)}
      >
        <FileText className="w-3.5 h-3.5" />
        Template
        <ChevronDown className="w-3.5 h-3.5" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <p className="text-xs font-semibold text-text-muted px-3 py-2 border-b border-gray-100">
            Chọn template
          </p>
          {emailTemplates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 transition-colors"
              onClick={() => {
                onSelect(tpl);
                setOpen(false);
              }}
            >
              <p className="text-sm font-medium text-text-dark">{tpl.name}</p>
              <p className="text-xs text-text-muted truncate">{tpl.subject}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
