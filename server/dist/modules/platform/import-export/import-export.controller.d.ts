import { ImportExportService, CommitImportDto } from './import-export.service';
export declare class ImportExportController {
    private readonly importExportService;
    constructor(importExportService: ImportExportService);
    commitImport(entity: string, file: any, dto: CommitImportDto, user: any): Promise<any>;
    listBatches(query: any): Promise<any>;
    export(entity: string, query: any, user: any): Promise<any>;
}
