export interface CreateSavedViewDto {
    entity: 'lead' | 'contact' | 'company' | 'deal' | 'quote' | 'activity';
    name: string;
    filters: Record<string, any>;
    columns: string[];
    sort?: string;
    isShared?: boolean;
}
export interface UpdateSavedViewDto {
    name?: string;
    filters?: Record<string, any>;
    columns?: string[];
    sort?: string;
    isShared?: boolean;
}
export declare class SavedViewsService {
    private readonly logger;
    list(query: any, userId: number): Promise<any>;
    create(dto: CreateSavedViewDto, userId: number): Promise<any>;
    findById(id: number, userId: number): Promise<any>;
    update(id: number, dto: UpdateSavedViewDto, userId: number): Promise<any>;
    delete(id: number, userId: number): Promise<any>;
    applyView(id: number, userId: number): Promise<any>;
}
