import { Injectable, Logger } from '@nestjs/common';

export interface CreateEmailTemplateDto {
  name: string;
  subject: string;
  body: string;
  isShared?: boolean;
}

export interface UpdateEmailTemplateDto {
  name?: string;
  subject?: string;
  body?: string;
  isShared?: boolean;
}

@Injectable()
export class EmailTemplatesService {
  private readonly logger = new Logger(EmailTemplatesService.name);

  /**
   * T2.39. GET /api/email-templates — Danh sách
   * Auth: Authenticated
   * Query: ?ownerId=me|all&shared=true|false
   */
  async list(query: any, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.40. POST /api/email-templates — Tạo
   * Auth: Authenticated
   * Response 201
   */
  async create(dto: CreateEmailTemplateDto, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.41. PUT /api/email-templates/:id — Cập nhật
   * Auth: Authenticated (owner hoặc admin nếu shared)
   */
  async update(id: number, dto: UpdateEmailTemplateDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.41. DELETE /api/email-templates/:id — Xóa
   * Auth: Authenticated (owner hoặc admin nếu shared)
   * Response 204
   */
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }
}