export interface AssignLeadsDto {
    leadIds: number[];
    toUserId: number;
    note?: string;
}
export interface CreateDistributionRuleDto {
    name: string;
    priority: number;
    isActive: boolean;
    conditions: any[];
    action: any;
}
export interface UpdateDistributionRuleDto {
    name?: string;
    priority?: number;
    isActive?: boolean;
    conditions?: any[];
    action?: any;
}
export declare class DistributionService {
    private readonly logger;
    getSummary(): Promise<any>;
    listAssignable(query: any): Promise<any>;
    assign(dto: AssignLeadsDto, userId: number): Promise<any>;
    applyRules(userId: number): Promise<any>;
    listRules(query: any): Promise<any>;
    createRule(dto: CreateDistributionRuleDto): Promise<any>;
    updateRule(id: number, dto: UpdateDistributionRuleDto): Promise<any>;
    deleteRule(id: number): Promise<any>;
    toggleRule(id: number): Promise<any>;
    getPoolConfig(): Promise<any>;
    updatePoolConfig(dto: any): Promise<any>;
    getAssignmentHistory(leadId: number): Promise<any>;
}
