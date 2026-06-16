export interface CreateTimelineItemDto {
    recordType: 'lead' | 'contact' | 'company' | 'deal' | 'quote' | 'activity';
    recordId: number;
    type: 'note' | 'call' | 'email' | 'meeting' | 'task' | 'system';
    title?: string;
    content: string;
    meta?: Record<string, any>;
    mentions?: number[];
}
export declare class TimelineService {
    private readonly logger;
    list(query: any): Promise<any>;
    create(dto: CreateTimelineItemDto, userId: number): Promise<any>;
    getFilters(): Promise<any>;
    add(input: any): Promise<any>;
    listByRecord(recordType: string, recordId: number, type?: string, page?: number, limit?: number): Promise<any>;
}
