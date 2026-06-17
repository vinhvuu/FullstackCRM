export interface CreateTagDto {
    id: string;
    label: string;
    color: string;
    bgColor: string;
}
export interface UpdateTagDto {
    label?: string;
    color?: string;
    bgColor?: string;
}
export declare class TagsService {
    private readonly logger;
    listAll(): Promise<any>;
    create(dto: CreateTagDto): Promise<any>;
    update(id: string, dto: UpdateTagDto): Promise<any>;
    delete(id: string): Promise<any>;
}
