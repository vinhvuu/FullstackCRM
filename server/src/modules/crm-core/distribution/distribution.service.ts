import { Injectable, Logger } from '@nestjs/common';

export interface AssignLeadsDto {
  leadIds: number[];
  toUserId: number;
  note?: string;
}

export interface CreateDistributionRuleDto {
  name: string;
  priority: number;
  isActive: boolean;
  conditions: any[];
  action: any;
}

export interface UpdateDistributionRuleDto {
  name?: string;
  priority?: number;
  isActive?: boolean;
  conditions?: any[];
  action?: any;
}

@Injectable()
export class DistributionService {
  private readonly logger = new Logger(DistributionService.name);

  /**
   * T2.42. GET /api/distribution/summary — Tổng quan (Admin)
   * Auth: Authenticated, Role: admin
   */
  async getSummary(): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.43. GET /api/distribution/assignable — Lead có thể gán
   * Auth: Authenticated, Role: admin
   * Query: ?search=&source=&status=&page=1&limit=20
   */
  async listAssignable(query: any): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.44. POST /api/distribution/assign — Gán lead cho user
   * Auth: Authenticated, Role: admin
   */
  async assign(dto: AssignLeadsDto, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.45. POST /api/distribution/apply-rules — Áp dụng rules tự động
   * Auth: Authenticated, Role: admin
   */
  async applyRules(userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.46. GET /api/distribution/rules — Danh sách rules
   */
  async listRules(query: any): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.46. POST /api/distribution/rules — Tạo rule
   */
  async createRule(dto: CreateDistributionRuleDto): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.46. PUT /api/distribution/rules/:id — Cập nhật rule
   */
  async updateRule(id: number, dto: UpdateDistributionRuleDto): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.46. DELETE /api/distribution/rules/:id — Xóa rule
   */
  async deleteRule(id: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.46. POST /api/distribution/rules/:id/toggle — Toggle rule
   */
  async toggleRule(id: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.47. GET /api/distribution/pool-config — Cấu hình pool
   */
  async getPoolConfig(): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.47. PUT /api/distribution/pool-config — Cập nhật pool config
   */
  async updatePoolConfig(dto: any): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.48. GET /api/leads/:id/assignments — Lịch sử gán
   */
  async getAssignmentHistory(leadId: number): Promise<any> {
    // TODO: Dev 2 implement
  }
}