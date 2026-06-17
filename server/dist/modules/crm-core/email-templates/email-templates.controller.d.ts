import { EmailTemplatesService, CreateEmailTemplateDto, UpdateEmailTemplateDto } from './email-templates.service';
export declare class EmailTemplatesController {
    private readonly emailTemplatesService;
    constructor(emailTemplatesService: EmailTemplatesService);
    list(query: any, user: any): Promise<any>;
    create(dto: CreateEmailTemplateDto, user: any): Promise<any>;
    update(id: number, dto: UpdateEmailTemplateDto, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
}
