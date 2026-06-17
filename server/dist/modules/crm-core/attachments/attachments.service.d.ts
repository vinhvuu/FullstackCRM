export declare class AttachmentsService {
    private readonly logger;
    upload(file: any, recordType: string, recordId: number, userId: number): Promise<any>;
    delete(id: number, userId: number, userRole: string): Promise<any>;
    download(id: number, userId: number): Promise<any>;
    listByRecord(recordType: string, recordId: number): Promise<any[]>;
}
