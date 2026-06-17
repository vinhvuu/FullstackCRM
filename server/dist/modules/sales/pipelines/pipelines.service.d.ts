export interface CreatePipelineDto {
    name: string;
    stages: {
        id: string;
        label: string;
        color: string;
        probability: number;
    }[];
}
export interface UpdatePipelineDto {
    name?: string;
    stages?: {
        id: string;
        label: string;
        color: string;
        probability: number;
    }[];
}
export declare class PipelinesService {
    private readonly logger;
    list(): Promise<any>;
    create(dto: CreatePipelineDto): Promise<any>;
    update(id: number, dto: UpdatePipelineDto): Promise<any>;
    delete(id: number): Promise<any>;
}
