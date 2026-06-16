export interface CreateEmailTemplateDto {
    name: string;
    subject: string;
    body: string;
    isShared?: boolean;
}
export interface UpdateEmailTemplateDto {
    name?: string;
    subject?: string;
    body?: string;
    isShared?: boolean;
}
export declare class EmailTemplatesService {
    private readonly logger;
    list(query: any, userId: number, userRole: string): Promise<any>;
    create(dto: CreateEmailTemplateDto, userId: number): Promise<any>;
    update(id: number, dto: UpdateEmailTemplateDto, userId: number, userRole: string): Promise<any>;
    delete(id: number, userId: number, userRole: string): Promise<any>;
}
