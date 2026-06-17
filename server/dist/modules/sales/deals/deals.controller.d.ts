import { DealsService, CreateDealDto, UpdateDealDto, UpdateDealStageDto, MarkLostDto } from './deals.service';
import { ConvertService, ConvertFromLeadDto } from '../convert/convert.service';
export declare class DealsController {
    private readonly dealsService;
    private readonly convertService;
    constructor(dealsService: DealsService, convertService: ConvertService);
    create(dto: CreateDealDto, user: any): Promise<any>;
    list(query: any, user: any): Promise<any>;
    getBoard(query: any, user: any): Promise<any>;
    findById(id: number, user: any): Promise<any>;
    update(id: number, dto: UpdateDealDto, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
    updateStage(id: number, dto: UpdateDealStageDto, user: any): Promise<any>;
    markWon(id: number, user: any): Promise<any>;
    markLost(id: number, dto: MarkLostDto, user: any): Promise<any>;
    convertFromLead(dto: ConvertFromLeadDto, user: any): Promise<any>;
}
