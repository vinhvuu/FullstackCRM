import { Injectable, Logger } from '@nestjs/common';

export interface CreateReportDefDto {
  name: string;
  entity: 'lead' | 'deal' | 'activity' | 'quote';
  chartType: 'bar' | 'line' | 'pie' | 'table' | 'kpi';
  dimension: string;
  measure: 'count' | 'sum_value' | 'weighted_value' | 'win_rate' | 'conversion_rate';
  filters?: Record<string, any>;
  isShared?: boolean;
}

export interface RunReportDto {
  def?: any;
  defId?: number;
  filters?: any;
}

export interface DrilldownDto {
  def: any;
  bucketValue: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  /**
   * T4.16. GET /api/reports/presets — Báo cáo mẫu
   * Auth: Authenticated
   */
  async listPresets(): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.17. GET /api/reports/defs — Danh sách report user-defined
   * Query: ?ownerId=me|all&shared=true|false
   */
  async listDefs(query: any, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.18. POST /api/reports/defs — Tạo report
   * Auth: Authenticated
   */
  async createDef(dto: CreateReportDefDto, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.19. POST /api/reports/run — Chạy report
   * Auth: Authenticated
   */
  async run(dto: RunReportDto, userId: number): Promise<any> {
    // TODO: Dev 4 implement
    // Inject CrmLeadService, SalesDealService để query
  }

  /**
   * T4.20. POST /api/reports/drilldown — Drill-down theo bucket
   * Auth: Authenticated
   */
  async drilldown(dto: DrilldownDto, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.21. DELETE /api/reports/defs/:id — Xóa report
   * Auth: Authenticated (owner hoặc admin)
   * Response 204
   */
  async deleteDef(id: number, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }
}