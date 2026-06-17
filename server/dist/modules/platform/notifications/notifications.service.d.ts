export declare class NotificationsService {
    private readonly logger;
    list(query: any, userId: number): Promise<any>;
    getUnreadCount(userId: number): Promise<any>;
    markAsRead(id: number, userId: number): Promise<any>;
    markAllAsRead(userId: number): Promise<any>;
    delete(id: number, userId: number): Promise<any>;
    create(input: any): Promise<any>;
    createMany(userIds: number[], input: any): Promise<void>;
    countUnread(userId: number): Promise<number>;
    notifyAdminsOfNewLead(leadId: number): Promise<void>;
    notifyOwnerOfAssignment(leadId: number, ownerId: number): Promise<void>;
    notifyDealStageChange(dealId: number, newStage: string): Promise<void>;
    notifyQuoteAccepted(quoteId: number): Promise<void>;
}
