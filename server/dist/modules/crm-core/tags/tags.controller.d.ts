import { TagsService, CreateTagDto, UpdateTagDto } from './tags.service';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    listAll(): Promise<any>;
    create(dto: CreateTagDto): Promise<any>;
    update(id: string, dto: UpdateTagDto): Promise<any>;
    delete(id: string): Promise<any>;
}
