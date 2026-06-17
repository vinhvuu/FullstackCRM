import { Notification } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "mention",
    title: "You were mentioned",
    body: "Hoàng An mentioned you in a note about Tech Corp",
    link: "/leads/1",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "1",
    type: "assignment",
    title: "New lead assigned",
    body: "A new lead from Website has been assigned to you",
    link: "/leads/2",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    userId: "1",
    type: "reminder",
    title: "Reminder: Call with Client",
    body: "You have a scheduled call with ABC Corp in 1 hour",
    link: "/activities/1",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    userId: "1",
    type: "deal_stage",
    title: "Deal stage changed",
    body: "Enterprise Deal moved to Negotiation stage",
    link: "/deals/1",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getNotifications(userId: string): Notification[] {
  return mockNotifications.filter((n) => n.userId === userId);
}

export function getUnreadCount(userId: string): number {
  return mockNotifications.filter((n) => n.userId === userId && !n.isRead).length;
}

export function markAsRead(notificationId: string): void {
  const notification = mockNotifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
}

export function markAllAsRead(userId: string): void {
  mockNotifications.forEach((n) => {
    if (n.userId === userId) {
      n.isRead = true;
    }
  });
}

export function createNotification(
  userId: string,
  type: Notification["type"],
  title: string,
  body?: string,
  link?: string
): Notification {
  const notification: Notification = {
    id: Date.now().toString(),
    userId,
    type,
    title,
    body,
    link,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  mockNotifications.unshift(notification);
  return notification;
}