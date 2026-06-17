export interface CreateLossReasonDto {
    label: string;
}
export interface UpdateLossReasonDto {
    label?: string;
}
export declare class LossReasonsService {
    private readonly logger;
    list(): Promise<any>;
    create(dto: CreateLossReasonDto): Promise<any>;
    update(id: number, dto: UpdateLossReasonDto): Promise<any>;
    delete(id: number): Promise<any>;
}
