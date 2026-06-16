import { QuotesService, CreateQuoteDto, UpdateQuoteDto } from './quotes.service';
export declare class QuotesController {
    private readonly quotesService;
    constructor(quotesService: QuotesService);
    create(dto: CreateQuoteDto, user: any): Promise<any>;
    list(query: any, user: any): Promise<any>;
    findById(id: number, user: any): Promise<any>;
    update(id: number, dto: UpdateQuoteDto, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
    send(id: number, user: any): Promise<any>;
    accept(id: number, user: any): Promise<any>;
    reject(id: number, dto: any, user: any): Promise<any>;
}
