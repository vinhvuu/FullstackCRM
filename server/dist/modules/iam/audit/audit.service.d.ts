export interface AuditLogDto {
    userId?: number | null;
    userName?: string | null;
    action: string;
    entityType: string;
    entityId?: number | null;
    details?: {
        before?: any;
        after?: any;
        meta?: any;
    };
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuditService {
    private readonly logger;
    list(query: any): Promise<any>;
    export(query: any): Promise<any>;
    log(input: AuditLogDto): Promise<void>;
}
