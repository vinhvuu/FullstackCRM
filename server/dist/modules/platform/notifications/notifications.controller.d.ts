import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    list(query: any, user: any): Promise<any>;
    getUnreadCount(user: any): Promise<any>;
    markAsRead(id: number, user: any): Promise<any>;
    markAllAsRead(user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
}
