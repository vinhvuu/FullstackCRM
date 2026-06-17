import { AttachmentsService } from './attachments.service';
export declare class AttachmentsController {
    private readonly attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    upload(file: any, body: any, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
    download(id: number, user: any): Promise<any>;
}
