export interface ConvertFromLeadDto {
    leadId: number;
    dealTitle: string;
    dealValue: number;
    dealStage: 'lead' | 'qualified' | 'proposal' | 'negotiation';
    expectedCloseDate: string;
    createContact: boolean;
}
export declare class ConvertService {
    private readonly logger;
    convertFromLead(dto: ConvertFromLeadDto, userId: number): Promise<any>;
}
