export interface CreateDealDto {
    title: string;
    value: number;
    currency?: 'VND' | 'USD';
    pipelineId?: number;
    leadId?: number;
    contactId?: number;
    companyId?: number;
    stage?: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
    probability?: number;
    expectedCloseDate?: string;
    lineItems?: {
        productId?: number;
        name: string;
        qty: number;
        unitPrice: number;
        discountPct?: number;
        taxPct?: number;
    }[];
}
export interface UpdateDealDto {
    title?: string;
    value?: number;
    currency?: 'VND' | 'USD';
    pipelineId?: number;
    leadId?: number;
    contactId?: number;
    companyId?: number;
    stage?: string;
    probability?: number;
    expectedCloseDate?: string;
    lineItems?: any[];
}
export interface UpdateDealStageDto {
    stage: string;
}
export interface MarkLostDto {
    lossReasonId: number;
    competitor?: string;
    note?: string;
}
export declare class DealsService {
    private readonly logger;
    create(dto: CreateDealDto, userId: number): Promise<any>;
    list(query: any, userId: number, userRole: string): Promise<any>;
    getBoard(query: any, userId: number, userRole: string): Promise<any>;
    findById(id: number, userId: number, userRole: string): Promise<any>;
    update(id: number, dto: UpdateDealDto, userId: number, userRole: string): Promise<any>;
    delete(id: number, userId: number, userRole: string): Promise<any>;
    updateStage(id: number, dto: UpdateDealStageDto, userId: number): Promise<any>;
    markWon(id: number, userId: number): Promise<any>;
    markLost(id: number, dto: MarkLostDto, userId: number): Promise<any>;
    searchForPicker(query: string, limit?: number): Promise<any[]>;
    countOpenByOwner(ownerId: number): Promise<number>;
    countOpenByCompany(companyId: number): Promise<number>;
    sumOpenValueByCompany(companyId: number): Promise<number>;
    countByStage(stage: string, from: Date, to: Date, ownerId?: number): Promise<number>;
    sumWonValue(from: Date, to: Date, ownerId?: number): Promise<number>;
    weightedValue(from: Date, to: Date, ownerId?: number): Promise<number>;
    groupBySource(from: Date, to: Date, ownerId?: number): Promise<any[]>;
    groupByStage(from: Date, to: Date, ownerId?: number): Promise<any[]>;
    groupByMonth(from: Date, to: Date, ownerId?: number): Promise<any[]>;
    winRate(from: Date, to: Date, ownerId?: number): Promise<number>;
    revenueByOwnerInPeriod(ownerId: number, periodKey: string): Promise<number>;
    dealsWonByOwnerInPeriod(ownerId: number, periodKey: string): Promise<number>;
    forecastBuckets(periodKey: string, ownerId?: number): Promise<any>;
}
