export interface CreateInvitationsDto {
    emails: string[];
    role: 'admin' | 'user';
    ttlHours: number;
}
export declare class InvitationsService {
    private readonly logger;
    createBatch(dto: CreateInvitationsDto): Promise<any>;
    list(query: any): Promise<any>;
    revoke(id: number): Promise<any>;
    accept(dto: any): Promise<any>;
}
