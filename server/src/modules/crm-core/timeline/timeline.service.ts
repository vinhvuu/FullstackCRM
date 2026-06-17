import { Injectable, Logger } from '@nestjs/common';

export interface CreateTimelineItemDto {
  recordType: 'lead' | 'contact' | 'company' | 'deal' | 'quote' | 'activity';
  recordId: number;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task' | 'system';
  title?: string;
  content: string;
  meta?: Record<string, any>;
  mentions?: number[];
}

@Injectable()
export class TimelineService {
  private readonly logger = new Logger(TimelineService.name);

  /**
   * T2.33. GET /api/timeline — Lấy timeline (polymorphic)
   * Auth: Authenticated
   * Query: ?recordType=lead|contact|company|deal|quote|activity&recordId=...&type=...&page=1&limit=50
   */
  async list(query: any): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.34. POST /api/timeline — Thêm item
   * Auth: Authenticated
   * Response 201: item vừa tạo
   */
  async create(dto: CreateTimelineItemDto, userId: number): Promise<any> {
    // TODO: Dev 2 implement
    // 1. Insert crm_timeline_items
    // 2. Parse mentions → gọi NotificationService.createMany
  }

  /**
   * T2.35. GET /api/timeline/filters — Danh sách filter
   */
  async getFilters(): Promise<any> {
    // TODO: Dev 2 implement
  }

  // Export contract methods
  async add(input: any): Promise<any> { return {}; }
  async listByRecord(recordType: string, recordId: number, type?: string, page?: number, limit?: number): Promise<any> {
    return { data: [], total: 0 };
  }
}