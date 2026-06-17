export interface CreateLeadSourceDto {
    name: string;
}
export interface UpdateLeadSourceDto {
    name?: string;
}
export declare class LeadSourcesService {
    private readonly logger;
    list(): Promise<any>;
    create(dto: CreateLeadSourceDto): Promise<any>;
    update(id: number, dto: UpdateLeadSourceDto): Promise<any>;
    delete(id: number): Promise<any>;
}
