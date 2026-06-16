import { Injectable, Logger } from '@nestjs/common';

export interface CreateDealDto {
  title: string;
  value: number;
  currency?: 'VND' | 'USD';
  pipelineId?: number;
  leadId?: number;
  contactId?: number;
  companyId?: number;
  stage?: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability?: number;
  expectedCloseDate?: string;
  lineItems?: {
    productId?: number; name: string; qty: number; unitPrice: number; discountPct?: number; taxPct?: number;
  }[];
}

export interface UpdateDealDto {
  title?: string;
  value?: number;
  currency?: 'VND' | 'USD';
  pipelineId?: number;
  leadId?: number;
  contactId?: number;
  companyId?: number;
  stage?: string;
  probability?: number;
  expectedCloseDate?: string;
  lineItems?: any[];
}

export interface UpdateDealStageDto {
  stage: string;
}

export interface MarkLostDto {
  lossReasonId: number;
  competitor?: string;
  note?: string;
}

@Injectable()
export class DealsService {
  private readonly logger = new Logger(DealsService.name);

  /**
   * T3.5. POST /api/deals — Tạo deal
   * Auth: Authenticated
   * SP: 2
   * Response 201: deal object
   */
  async create(dto: CreateDealDto, userId: number): Promise<any> {
    // TODO: Dev 3 implement
    // 1. Inject CrmLeadService để validate leadId
    // 2. Inject CrmContactService, CrmCompanyService
    // 3. Insert sales_deals với status='open', stage_entered_at=NOW
    // 4. Nếu có lineItems → insert sales_deal_line_items
    // 5. Insert sales_deal_stage_history
    // 6. Nếu leadId → gọi CrmLeadService.markQualified
    // 7. Audit log action='create', entityType='deal'
  }

  /**
   * T3.6. GET /api/deals — Danh sách (kanban)
   * Auth: Authenticated
   * Query: ?pipelineId=&stage=&contactId=&companyId=&minValue=&maxValue=&rotting=true&page=1&limit=50
   */
  async list(query: any, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.7. GET /api/deals/board — Board view (grouped theo stage)
   * Auth: Authenticated
   * Query: ?pipelineId=
   */
  async getBoard(query: any, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.8. GET /api/deals/:id — Chi tiết
   * Auth: Authenticated
   */
  async findById(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.9. PUT /api/deals/:id — Cập nhật
   * Auth: Authenticated (owner hoặc admin)
   */
  async update(id: number, dto: UpdateDealDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.10. DELETE /api/deals/:id — Xóa (soft)
   * Auth: Authenticated (owner hoặc admin)
   * Response 204
   */
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.11. PUT /api/deals/:id/stage — Đổi stage nhanh (drag-drop kanban)
   * Auth: Authenticated (owner hoặc admin)
   */
  async updateStage(id: number, dto: UpdateDealStageDto, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.12. POST /api/deals/:id/mark-won
   * Auth: Authenticated (owner hoặc admin)
   */
  async markWon(id: number, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.13. POST /api/deals/:id/mark-lost
   * Auth: Authenticated (owner hoặc admin)
   */
  async markLost(id: number, dto: MarkLostDto, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  // Export contract methods
  async searchForPicker(query: string, limit?: number): Promise<any[]> { return []; }
  async countOpenByOwner(ownerId: number): Promise<number> { return 0; }
  async countOpenByCompany(companyId: number): Promise<number> { return 0; }
  async sumOpenValueByCompany(companyId: number): Promise<number> { return 0; }
  async countByStage(stage: string, from: Date, to: Date, ownerId?: number): Promise<number> { return 0; }
  async sumWonValue(from: Date, to: Date, ownerId?: number): Promise<number> { return 0; }
  async weightedValue(from: Date, to: Date, ownerId?: number): Promise<number> { return 0; }
  async groupBySource(from: Date, to: Date, ownerId?: number): Promise<any[]> { return []; }
  async groupByStage(from: Date, to: Date, ownerId?: number): Promise<any[]> { return []; }
  async groupByMonth(from: Date, to: Date, ownerId?: number): Promise<any[]> { return []; }
  async winRate(from: Date, to: Date, ownerId?: number): Promise<number> { return 0; }
  async revenueByOwnerInPeriod(ownerId: number, periodKey: string): Promise<number> { return 0; }
  async dealsWonByOwnerInPeriod(ownerId: number, periodKey: string): Promise<number> { return 0; }
  async forecastBuckets(periodKey: string, ownerId?: number): Promise<any> { return { committed: 0, best_case: 0, pipeline: 0 }; }
}