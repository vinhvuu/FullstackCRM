export declare class CrmActivity {
    id: number;
    owner_id: number;
    type: 'call' | 'email' | 'meeting' | 'task';
    title: string;
    description: string | null;
    lead_id: number | null;
    contact_id: number | null;
    company_id: number | null;
    deal_id: number | null;
    related_type: 'lead' | 'contact' | 'company' | 'deal' | 'quote' | null;
    related_id: number | null;
    due_date: Date | null;
    remind_at: Date | null;
    status: 'pending' | 'completed' | 'overdue';
    priority: 'high' | 'medium' | 'low' | null;
    completed_at: Date | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
