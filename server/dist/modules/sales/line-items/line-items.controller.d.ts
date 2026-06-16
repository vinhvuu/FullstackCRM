import { LineItemsService, CreateLineItemDto, UpdateLineItemDto } from './line-items.service';
export declare class LineItemsController {
    private readonly lineItemsService;
    constructor(lineItemsService: LineItemsService);
    create(dealId: number, dto: CreateLineItemDto, user: any): Promise<any>;
    update(dealId: number, lineItemId: number, dto: UpdateLineItemDto, user: any): Promise<any>;
    delete(dealId: number, lineItemId: number, user: any): Promise<any>;
}
