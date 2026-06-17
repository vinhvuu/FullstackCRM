"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockNotifications, markAsRead, markAllAsRead } from "@/lib/notifications";
import { useI18n } from "@/lib/i18n";
import { Notification } from "@/types";
import { useRouter } from "next/navigation";

const CURRENT_USER_ID = "1";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const router = useRouter();

  const loadNotifications = () => {
    const all = mockNotifications.filter((n) => n.userId === CURRENT_USER_ID);
    setNotifications(all);
    setUnreadCount(all.filter((n) => !n.isRead).length);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    markAllAsRead(CURRENT_USER_ID);
    loadNotifications();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
      setOpen(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={() => setOpen(!open)}>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-text-muted" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-80">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold">{t("notification.title")}</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs h-7">
                <Check className="w-3 h-3 mr-1" />
                {t("notification.markAllRead")}
              </Button>
            )}
          </div>
          <div className="h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-muted">{t("notification.empty")}</div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-3 text-left hover:bg-gray-50 flex gap-3 ${
                      !notification.isRead ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mt-2 bg-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? "font-medium" : ""}`}>
                        {notification.title}
                      </p>
                      {notification.body && (
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">{notification.body}</p>
                      )}
                      <p className="text-xs text-text-muted mt-1">{formatTime(notification.createdAt)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}