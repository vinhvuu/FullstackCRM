import { Injectable, Logger } from '@nestjs/common';

export interface AuditLogDto {
  userId?: number | null;
  userName?: string | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  details?: { before?: any; after?: any; meta?: any };
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  /**
   * T1.20. GET /api/audit-logs — Nhật ký (Admin)
   * Auth: Authenticated, Role: admin
   * SP: 3
   * Query: ?page=1&limit=10&userId=...&action=...&entityType=...&from=...&to=...&q=...
   * Response 200: { data: [...], meta: { page, limit, total, totalPages } }
   */
  async list(query: any): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Filter động theo query
    // 2. Sort created_at DESC
  }

  /**
   * T1.21. GET /api/audit-logs/export — Export CSV
   * Auth: Authenticated, Role: admin
   * SP: 2
   * Query: giống list, KHÔNG phân trang
   * Response 200: CSV with BOM
   */
  async export(query: any): Promise<any> {
    // TODO: Dev 1 implement
  }

  /**
   * Log action (dùng cho mọi module khác cần ghi log)
   * Auth: -
   */
  async log(input: AuditLogDto): Promise<void> {
    // TODO: Dev 1 implement
    // Insert vào iam_audit_logs
  }
}