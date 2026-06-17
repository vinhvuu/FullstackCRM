import { DistributionService, AssignLeadsDto, CreateDistributionRuleDto, UpdateDistributionRuleDto } from './distribution.service';
export declare class DistributionController {
    private readonly distributionService;
    constructor(distributionService: DistributionService);
    getSummary(): Promise<any>;
    listAssignable(query: any): Promise<any>;
    assign(dto: AssignLeadsDto, user: any): Promise<any>;
    applyRules(user: any): Promise<any>;
    listRules(query: any): Promise<any>;
    createRule(dto: CreateDistributionRuleDto): Promise<any>;
    updateRule(id: number, dto: UpdateDistributionRuleDto): Promise<any>;
    deleteRule(id: number): Promise<any>;
    toggleRule(id: number): Promise<any>;
    getPoolConfig(): Promise<any>;
    updatePoolConfig(dto: any): Promise<any>;
}
