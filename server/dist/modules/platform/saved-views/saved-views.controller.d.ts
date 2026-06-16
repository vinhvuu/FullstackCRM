import { SavedViewsService, CreateSavedViewDto, UpdateSavedViewDto } from './saved-views.service';
export declare class SavedViewsController {
    private readonly savedViewsService;
    constructor(savedViewsService: SavedViewsService);
    list(query: any, user: any): Promise<any>;
    create(dto: CreateSavedViewDto, user: any): Promise<any>;
    findById(id: number, user: any): Promise<any>;
    update(id: number, dto: UpdateSavedViewDto, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
}
