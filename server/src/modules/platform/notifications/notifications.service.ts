import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  /**
   * T4.1. GET /api/notifications — Danh sách
   * Auth: Authenticated
   * Query: ?page=1&limit=20&isRead=true|false&type=...
   */
  async list(query: any, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.2. GET /api/notifications/unread-count
   * Auth: Authenticated
   */
  async getUnreadCount(userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.3. POST /api/notifications/:id/read — Đánh dấu đã đọc
   * Auth: Authenticated
   */
  async markAsRead(id: number, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.4. POST /api/notifications/read-all
   * Auth: Authenticated
   */
  async markAllAsRead(userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.5. DELETE /api/notifications/:id
   * Auth: Authenticated
   * Response 204
   */
  async delete(id: number, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  // Export contract methods
  async create(input: any): Promise<any> { return {}; }
  async createMany(userIds: number[], input: any): Promise<void> { }
  async countUnread(userId: number): Promise<number> { return 0; }
  async notifyAdminsOfNewLead(leadId: number): Promise<void> { }
  async notifyOwnerOfAssignment(leadId: number, ownerId: number): Promise<void> { }
  async notifyDealStageChange(dealId: number, newStage: string): Promise<void> { }
  async notifyQuoteAccepted(quoteId: number): Promise<void> { }
}