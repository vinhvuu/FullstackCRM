import { LeadSourcesService, CreateLeadSourceDto, UpdateLeadSourceDto } from './lead-sources.service';
export declare class LeadSourcesController {
    private readonly leadSourcesService;
    constructor(leadSourcesService: LeadSourcesService);
    list(): Promise<any>;
    create(dto: CreateLeadSourceDto): Promise<any>;
    update(id: number, dto: UpdateLeadSourceDto): Promise<any>;
    delete(id: number): Promise<any>;
}
