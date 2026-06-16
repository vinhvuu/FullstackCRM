export declare class SalesProduct {
    id: number;
    code: string | null;
    name: string;
    group: string | null;
    unit_price: number;
    unit: string | null;
    currency: 'VND' | 'USD';
    default_tax_pct: number;
    description: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
