export declare class CrmLead {
    id: number;
    owner_id: number;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    source: string | null;
    status: 'new' | 'contacted' | 'qualified' | 'lost';
    score: number;
    in_pool: boolean;
    order: number;
    created_at: Date;
    updated_at: Date;
    created_by: number | null;
    updated_by: number | null;
    deleted_at: Date | null;
}
