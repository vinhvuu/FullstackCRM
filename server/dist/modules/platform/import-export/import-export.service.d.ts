export interface CommitImportDto {
    mapping: Record<string, string>;
    dedupeMode: 'skip' | 'update' | 'create';
}
export declare class ImportExportService {
    private readonly logger;
    commitImport(entity: string, file: any, dto: CommitImportDto, userId: number): Promise<any>;
    listBatches(query: any): Promise<any>;
    export(entity: string, query: any, userId: number): Promise<any>;
}
