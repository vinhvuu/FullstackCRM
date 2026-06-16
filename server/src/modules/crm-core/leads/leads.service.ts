import { Injectable, Logger } from '@nestjs/common';

export interface CreateLeadDto {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  score?: number;
  tags?: string[];
  inPool?: boolean;
}

export interface UpdateLeadDto {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'lost';
  score?: number;
  tags?: string[];
  inPool?: boolean;
}

export interface UpdateLeadStatusDto {
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  order?: number;
}

export interface BulkLeadActionDto {
  ids: number[];
  action: 'delete' | 'changeStatus' | 'assign' | 'moveToPool' | 'removeFromPool';
  status?: 'new' | 'contacted' | 'qualified' | 'lost';
  toUserId?: number;
}

export interface CreateReminderDto {
  date: string;
  time: string;
  note: string;
}

export interface UpdateReminderDto {
  status?: 'pending' | 'completed' | 'snoozed';
  date?: string;
  time?: string;
  note?: string;
}

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  /**
   * T2.1. POST /api/leads — Tạo lead
   * Auth: Authenticated
   * SP: 2
   * Response 201: lead object
   * Response 409: LEAD_EMAIL_EXISTS
   */
  async create(dto: CreateLeadDto, userId: number): Promise<any> {
    // TODO: Dev 2 implement
    // 1. Insert crm_leads với owner_id = currentUser.id, status='new', score=0
    // 2. Nếu có tags: insert crm_lead_tags
    // 3. Nếu inPool=true: KHÔNG ghi assignment
    // 4. Nếu không: insert crm_lead_assignments
    // 5. Audit log action='create', entityType='lead'
  }

  /**
   * T2.2. GET /api/leads — Danh sách lead
   * Auth: Authenticated
   * SP: 3
   * Query: ?page=1&limit=20&status=...&source=...&minScore=...&maxScore=...&assignee=...&search=...&sortBy=...&sortDir=...&inPool=...&quickFilter=...&viewId=...
   * Response 200: { data: [...], meta: { page, limit, total, totalPages } }
   */
  async list(query: any, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
    // 1. Staff mặc định chỉ thấy lead của mình, trừ assignee=all (admin only)
    // 2. Filter status multi-value, source multi-value, score range
    // 3. search LIKE trên name, company, email, phone, source, assignee_name
    // 4. quickFilter='recent' → created_at >= NOW() - 7 days
    // 5. quickFilter='highScore' → score >= 70
    // 6. quickFilter='myLeads' → owner_id = currentUser.id
    // 7. Nếu viewId: inject PlatformSavedViewService
  }

  /**
   * T2.3. GET /api/leads/:id — Chi tiết lead
   * Auth: Authenticated
   * SP: 1
   * Response 200: lead object with tags, reminders, assignments
   * Response 404: LEAD_NOT_FOUND
   * Response 403: Staff cố xem lead của người khác
   */
  async findById(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.4. PUT /api/leads/:id — Cập nhật lead
   * Auth: Authenticated (owner hoặc admin)
   * SP: 2
   * Response 200: lead sau khi update
   * Response 403: không phải owner/admin
   * Response 404: không tìm thấy
   */
  async update(id: number, dto: UpdateLeadDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
    // 1. Capture details.before và details.after để audit
    // 2. Nếu đổi status='qualified': trigger notification cho owner
    // 3. Nếu đổi tags: diff cũ/mới → insert/delete crm_lead_tags
    // 4. Nếu đổi owner_id: insert crm_lead_assignments
  }

  /**
   * T2.5. DELETE /api/leads/:id — Xóa (soft) lead
   * Auth: Authenticated (owner hoặc admin)
   * SP: 1
   * Response 204
   */
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.6. PUT /api/leads/:id/status — Đổi status nhanh (Kanban)
   * Auth: Authenticated (owner hoặc admin)
   * SP: 1
   * Response 200: lead sau khi update
   */
  async updateStatus(id: number, dto: UpdateLeadStatusDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.7. POST /api/leads/bulk — Bulk action
   * Auth: Authenticated
   * SP: 2
   * Response 200: { affected, skipped }
   */
  async bulkAction(dto: BulkLeadActionDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.8. GET /api/leads/:id/reminders — List reminders
   * Auth: Authenticated
   * SP: 1
   */
  async listReminders(leadId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.9. POST /api/leads/:id/reminders — Tạo reminder
   * Auth: Authenticated (owner/admin)
   * SP: 1
   */
  async createReminder(leadId: number, dto: CreateReminderDto, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.10. PUT /api/leads/:id/reminders/:reminderId — Cập nhật reminder
   */
  async updateReminder(leadId: number, reminderId: number, dto: UpdateReminderDto): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.11. DELETE /api/leads/:id/reminders/:reminderId — Xóa reminder
   */
  async deleteReminder(leadId: number, reminderId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.12. POST /api/leads/import/preview — Preview import
   * Auth: Authenticated
   * SP: 3
   */
  async previewImport(file: any): Promise<any> {
    // TODO: Dev 2 implement
  }

  // Export contract methods for other modules
  async countByOwner(ownerId: number): Promise<number> { return 0; }
  async countUnassigned(): Promise<number> { return 0; }
  async countInPool(): Promise<number> { return 0; }
  async countByStatus(status: string, ownerId?: number): Promise<number> { return 0; }
  async countBySource(source: string, ownerId?: number): Promise<number> { return 0; }
  async searchForPicker(query: string, limit?: number): Promise<any[]> { return []; }
}