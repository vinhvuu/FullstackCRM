import { Injectable, Logger } from '@nestjs/common';

export interface CreateActivityDto {
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description?: string;
  leadId?: number;
  contactId?: number;
  companyId?: number;
  dealId?: number;
  relatedType?: 'lead' | 'contact' | 'company' | 'deal' | 'quote';
  relatedId?: number;
  dueDate?: string;
  remindAt?: string;
  priority?: 'high' | 'medium' | 'low';
  recurrence?: { freq: 'daily' | 'weekly' | 'monthly'; interval: number; until?: string };
}

export interface UpdateActivityDto {
  title?: string;
  description?: string;
  dueDate?: string;
  remindAt?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'completed';
  recurrence?: { freq: 'daily' | 'weekly' | 'monthly'; interval: number; until?: string };
}

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  /**
   * T2.27. POST /api/activities — Tạo activity
   * Auth: Authenticated
   * SP: 2
   * Response 201: activity vừa tạo
   */
  async create(dto: CreateActivityDto, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.28. GET /api/activities — Danh sách
   * Auth: Authenticated
   * Query: ?page=1&limit=20&type=&status=&priority=&dueFrom=&dueTo=&relatedType=&relatedId=&view=list|calendar|today
   */
  async list(query: any, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.29. GET /api/activities/:id — Chi tiết
   * Auth: Authenticated
   */
  async findById(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.30. PUT /api/activities/:id — Cập nhật
   * Auth: Authenticated (owner hoặc admin)
   */
  async update(id: number, dto: UpdateActivityDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.31. POST /api/activities/:id/complete — Đánh dấu hoàn thành
   * Auth: Authenticated (owner hoặc admin)
   * Response 200: activity sau khi complete
   */
  async complete(id: number, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.32. DELETE /api/activities/:id — Xóa
   * Auth: Authenticated (owner hoặc admin)
   * Response 204
   */
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  // Export contract methods
  async countByDeal(dealId: number): Promise<number> { return 0; }
  async countPendingByOwner(ownerId: number): Promise<number> { return 0; }
  async countByStage(stage: string, from: Date, to: Date): Promise<number> { return 0; }
}