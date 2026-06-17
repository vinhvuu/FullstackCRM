export declare class SalesDeal {
    id: number;
    owner_id: number;
    pipeline_id: number | null;
    lead_id: number | null;
    contact_id: number | null;
    company_id: number | null;
    title: string;
    value: number;
    currency: 'VND' | 'USD';
    stage: string;
    probability: number;
    status: 'open' | 'won' | 'lost';
    expected_close_date: Date | null;
    won_at: Date | null;
    lost_at: Date | null;
    loss_reason_id: number | null;
    competitor: string | null;
    stage_entered_at: Date | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
