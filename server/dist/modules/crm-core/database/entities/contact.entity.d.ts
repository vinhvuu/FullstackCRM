export declare class CrmContact {
    id: number;
    owner_id: number;
    company_id: number | null;
    name: string;
    email: string | null;
    phone: string | null;
    position: string | null;
    tags: string[] | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
