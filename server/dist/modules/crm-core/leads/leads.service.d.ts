export interface CreateLeadDto {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    source?: string;
    score?: number;
    tags?: string[];
    inPool?: boolean;
}
export interface UpdateLeadDto {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    source?: string;
    status?: 'new' | 'contacted' | 'qualified' | 'lost';
    score?: number;
    tags?: string[];
    inPool?: boolean;
}
export interface UpdateLeadStatusDto {
    status: 'new' | 'contacted' | 'qualified' | 'lost';
    order?: number;
}
export interface BulkLeadActionDto {
    ids: number[];
    action: 'delete' | 'changeStatus' | 'assign' | 'moveToPool' | 'removeFromPool';
    status?: 'new' | 'contacted' | 'qualified' | 'lost';
    toUserId?: number;
}
export interface CreateReminderDto {
    date: string;
    time: string;
    note: string;
}
export interface UpdateReminderDto {
    status?: 'pending' | 'completed' | 'snoozed';
    date?: string;
    time?: string;
    note?: string;
}
export declare class LeadsService {
    private readonly logger;
    create(dto: CreateLeadDto, userId: number): Promise<any>;
    list(query: any, userId: number, userRole: string): Promise<any>;
    findById(id: number, userId: number, userRole: string): Promise<any>;
    update(id: number, dto: UpdateLeadDto, userId: number, userRole: string): Promise<any>;
    delete(id: number, userId: number, userRole: string): Promise<any>;
    updateStatus(id: number, dto: UpdateLeadStatusDto, userId: number, userRole: string): Promise<any>;
    bulkAction(dto: BulkLeadActionDto, userId: number, userRole: string): Promise<any>;
    listReminders(leadId: number): Promise<any>;
    createReminder(leadId: number, dto: CreateReminderDto, userId: number): Promise<any>;
    updateReminder(leadId: number, reminderId: number, dto: UpdateReminderDto): Promise<any>;
    deleteReminder(leadId: number, reminderId: number): Promise<any>;
    previewImport(file: any): Promise<any>;
    countByOwner(ownerId: number): Promise<number>;
    countUnassigned(): Promise<number>;
    countInPool(): Promise<number>;
    countByStatus(status: string, ownerId?: number): Promise<number>;
    countBySource(source: string, ownerId?: number): Promise<number>;
    searchForPicker(query: string, limit?: number): Promise<any[]>;
}
