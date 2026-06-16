import { PipelinesService, CreatePipelineDto, UpdatePipelineDto } from './pipelines.service';
export declare class PipelinesController {
    private readonly pipelinesService;
    constructor(pipelinesService: PipelinesService);
    list(): Promise<any>;
    create(dto: CreatePipelineDto): Promise<any>;
    update(id: number, dto: UpdatePipelineDto): Promise<any>;
    delete(id: number): Promise<any>;
}
