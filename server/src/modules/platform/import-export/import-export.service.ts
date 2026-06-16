import { Injectable, Logger } from '@nestjs/common';

export interface CommitImportDto {
  mapping: Record<string, string>;
  dedupeMode: 'skip' | 'update' | 'create';
}

@Injectable()
export class ImportExportService {
  private readonly logger = new Logger(ImportExportService.name);

  /**
   * T4.35. POST /api/import/:entity/commit — Commit import (Lead/Contact/Company)
   * Auth: Authenticated
   * Request: multipart/form-data file CSV + body { mapping, dedupeMode }
   */
  async commitImport(entity: string, file: any, dto: CommitImportDto, userId: number): Promise<any> {
    // TODO: Dev 4 implement
    // Inject CrmLeadService, CrmContactService, CrmCompanyService
  }

  /**
   * T4.36. GET /api/import/batches — Lịch sử import
   * Auth: Authenticated
   */
  async listBatches(query: any): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.37. GET /api/export/:entity — Export CSV (Lead/Contact/Company/Deal/Quote)
   * Auth: Authenticated
   * Query: ?filter=...
   */
  async export(entity: string, query: any, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }
}