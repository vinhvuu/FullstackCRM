export interface CreateLineItemDto {
    productId?: number;
    name: string;
    qty: number;
    unitPrice: number;
    discountPct?: number;
    taxPct?: number;
}
export interface UpdateLineItemDto {
    productId?: number;
    name?: string;
    qty?: number;
    unitPrice?: number;
    discountPct?: number;
    taxPct?: number;
}
export declare class LineItemsService {
    private readonly logger;
    create(dealId: number, dto: CreateLineItemDto, userId: number): Promise<any>;
    update(dealId: number, lineItemId: number, dto: UpdateLineItemDto, userId: number): Promise<any>;
    delete(dealId: number, lineItemId: number, userId: number): Promise<any>;
}
