export interface CreateQuoteDto {
    title: string;
    dealId?: number;
    companyId?: number;
    contactId?: number;
    validUntil?: string;
    currency?: 'VND' | 'USD';
    terms?: string;
    lineItems: {
        productId?: number;
        name: string;
        qty: number;
        unitPrice: number;
        discountPct?: number;
        taxPct?: number;
    }[];
}
export interface UpdateQuoteDto {
    title?: string;
    dealId?: number;
    companyId?: number;
    contactId?: number;
    validUntil?: string;
    currency?: 'VND' | 'USD';
    terms?: string;
    lineItems?: any[];
}
export declare class QuotesService {
    private readonly logger;
    create(dto: CreateQuoteDto, userId: number): Promise<any>;
    list(query: any, userId: number, userRole: string): Promise<any>;
    findById(id: number, userId: number, userRole: string): Promise<any>;
    update(id: number, dto: UpdateQuoteDto, userId: number, userRole: string): Promise<any>;
    delete(id: number, userId: number, userRole: string): Promise<any>;
    send(id: number, userId: number): Promise<any>;
    accept(id: number, userId: number): Promise<any>;
    reject(id: number, dto: any, userId: number): Promise<any>;
    countByOwner(ownerId: number): Promise<number>;
    sumAcceptedTotal(from: Date, to: Date): Promise<number>;
}
