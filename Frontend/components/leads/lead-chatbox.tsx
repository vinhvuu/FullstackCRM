"use client";

import { useState, useEffect, useRef } from "react";
import { Lead, ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { SendHorizontal, X } from "lucide-react";

interface LeadChatboxProps {
  lead: Lead;
  onClose: () => void;
}

const AUTO_REPLIES = [
  "Cảm ơn bạn đã phản hồi. Bên mình đang cân nhắc giải pháp AI của VanhCorp.",
  "Chi phí triển khai và thời gian tích hợp hệ thống mất khoảng bao lâu vậy bạn?",
  "Bạn có thể gửi tài liệu báo giá chi tiết qua email đăng ký của mình nhé.",
  "Tôi sẽ xem xét và phản hồi lại trong tuần này. Cảm ơn bạn!",
  "Có thể sắp xếp một buổi demo trực tiếp được không?",
  "Được rồi, tôi sẽ trao đổi với đội ngũ và phản hồi lại sớm nhất có thể.",
];

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getGreeting = (lead: Lead) => {
  const statusLabels: Record<string, string> = {
    new: "mới",
    contacted: "đã liên hệ",
    qualified: "tiềm năng cao",
    lost: "đã mất",
  };
  return `Chào bạn, tôi là đại diện từ ${lead.company}. Tôi thấy bạn đang quan tâm đến dịch vụ của VanhCorp (trạng thái: ${statusLabels[lead.status] || "mới"}). Tôi có thể hỗ trợ gì thêm không?`;
};

export function LeadChatbox({ lead, onClose }: LeadChatboxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: "1",
        sender: "lead",
        text: getGreeting(lead),
        timestamp: new Date(),
      },
      {
        id: "2",
        sender: "lead",
        text: "Xin chào! Rất vui được trò chuyện với bạn.",
        timestamp: new Date(),
      },
    ];
    setMessages(initialMessages);
  }, [lead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "seller",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const replyIndex = messages.length % AUTO_REPLIES.length;
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "lead",
        text: AUTO_REPLIES[replyIndex],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[480px] bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(lead.name)}
          </div>
          <div>
            <p className="font-semibold text-text-dark text-sm">{lead.name}</p>
            <p className="text-xs text-text-muted flex items-center gap-1">
              {lead.company}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "seller" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.sender === "seller"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-slate-100 text-text-dark rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-2 focus-visible:outline-none text-sm"
          />
          <Button
            type="submit"
            variant="default"
            size="icon"
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}