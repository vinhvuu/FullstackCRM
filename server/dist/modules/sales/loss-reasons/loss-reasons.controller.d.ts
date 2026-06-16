import { LossReasonsService, CreateLossReasonDto, UpdateLossReasonDto } from './loss-reasons.service';
export declare class LossReasonsController {
    private readonly lossReasonsService;
    constructor(lossReasonsService: LossReasonsService);
    list(): Promise<any>;
    create(dto: CreateLossReasonDto): Promise<any>;
    update(id: number, dto: UpdateLossReasonDto): Promise<any>;
    delete(id: number): Promise<any>;
}
