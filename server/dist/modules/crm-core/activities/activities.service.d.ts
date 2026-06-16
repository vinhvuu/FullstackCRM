export interface CreateActivityDto {
    type: 'call' | 'email' | 'meeting' | 'task';
    title: string;
    description?: string;
    leadId?: number;
    contactId?: number;
    companyId?: number;
    dealId?: number;
    relatedType?: 'lead' | 'contact' | 'company' | 'deal' | 'quote';
    relatedId?: number;
    dueDate?: string;
    remindAt?: string;
    priority?: 'high' | 'medium' | 'low';
    recurrence?: {
        freq: 'daily' | 'weekly' | 'monthly';
        interval: number;
        until?: string;
    };
}
export interface UpdateActivityDto {
    title?: string;
    description?: string;
    dueDate?: string;
    remindAt?: string;
    priority?: 'high' | 'medium' | 'low';
    status?: 'pending' | 'completed';
    recurrence?: {
        freq: 'daily' | 'weekly' | 'monthly';
        interval: number;
        until?: string;
    };
}
export declare class ActivitiesService {
    private readonly logger;
    create(dto: CreateActivityDto, userId: number): Promise<any>;
    list(query: any, userId: number, userRole: string): Promise<any>;
    findById(id: number, userId: number, userRole: string): Promise<any>;
    update(id: number, dto: UpdateActivityDto, userId: number, userRole: string): Promise<any>;
    complete(id: number, userId: number): Promise<any>;
    delete(id: number, userId: number, userRole: string): Promise<any>;
    countByDeal(dealId: number): Promise<number>;
    countPendingByOwner(ownerId: number): Promise<number>;
    countByStage(stage: string, from: Date, to: Date): Promise<number>;
}
