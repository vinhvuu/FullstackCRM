export declare class IamAuditLog {
    id: number;
    user_id: number | null;
    user_name: string | null;
    action: string;
    entity_type: string;
    entity_id: number | null;
    details: Record<string, any> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: Date;
}
