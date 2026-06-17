import { Injectable, Logger } from '@nestjs/common';

export interface DashboardWidget {
  id: string;
  type: string;
  w: number;
  h: number;
  x: number;
  y: number;
  refId?: string | null;
}

export interface UpdateDashboardLayoutDto {
  widgets: DashboardWidget[];
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  /**
   * T4.25. GET /api/dashboard/stats — KPI tổng hợp
   * Auth: Authenticated
   */
  async getStats(): Promise<any> {
    // TODO: Dev 4 implement
    // Inject CrmLeadService, SalesDealService
  }

  /**
   * T4.26. GET /api/dashboard/recent-deals
   * Auth: Authenticated
   * Query: ?limit=5
   */
  async getRecentDeals(query: any): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.27. GET /api/dashboard/layout — Widget layout
   * Auth: Authenticated (chính mình)
   */
  async getLayout(userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.27. PUT /api/dashboard/layout — Cập nhật widget layout
   * Auth: Authenticated (chính mình)
   */
  async updateLayout(userId: number, dto: UpdateDashboardLayoutDto): Promise<any> {
    // TODO: Dev 4 implement
  }
}