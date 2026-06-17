"use client";

import { useState, useRef, useEffect } from "react";
import { MentionUser } from "@/types";
import { parseMentions } from "@/lib/mentions";

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onMentionsChange?: (ids: string[]) => void;
  users: MentionUser[];
  placeholder?: string;
  rows?: number;
}

export function MentionInput({
  value,
  onChange,
  onMentionsChange,
  users,
  placeholder = "Nhập ghi chú... (@mention đồng nghiệp)",
  rows = 4,
}: MentionInputProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = query
    ? users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pos = (e.target as HTMLTextAreaElement).selectionStart;
    setCursorPos(pos);
    const textBefore = value.slice(0, pos);
    const atMatch = textBefore.match(/@(\w*)$/);
    if (atMatch) {
      setQuery(atMatch[1]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setQuery("");
    }
  };

  const insertMention = (user: MentionUser) => {
    const textBefore = value.slice(0, cursorPos);
    const atMatch = textBefore.match(/@(\w*)$/);
    if (!atMatch) return;
    const start = cursorPos - atMatch[0].length;
    const newValue = value.slice(0, start) + `@${user.name} ` + value.slice(cursorPos);
    onChange(newValue);
    onMentionsChange?.(parseMentions(newValue, users));
    setShowSuggestions(false);
    setQuery("");
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    onMentionsChange?.(parseMentions(e.target.value, users));
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden mt-1">
          {suggestions.map((u) => (
            <button
              key={u.id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insertMention(u); }}
              className="w-full text-left px-3 py-2 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">
                {u.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-text-dark">{u.name}</p>
                {u.email && <p className="text-xs text-text-muted">{u.email}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
