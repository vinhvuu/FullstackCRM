import { Injectable, Logger } from '@nestjs/common';

export interface CreateLeadSourceDto {
  name: string;
}

export interface UpdateLeadSourceDto {
  name?: string;
}

@Injectable()
export class LeadSourcesService {
  private readonly logger = new Logger(LeadSourcesService.name);

  /**
   * T2.26. GET /api/lead-sources — Danh sách nguồn lead
   * Auth: Authenticated
   */
  async list(): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.26. POST /api/lead-sources — Tạo nguồn (Admin)
   * Auth: Authenticated, Role: admin
   */
  async create(dto: CreateLeadSourceDto): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.26. PUT /api/lead-sources/:id — Cập nhật (Admin)
   */
  async update(id: number, dto: UpdateLeadSourceDto): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.26. DELETE /api/lead-sources/:id — Xóa (Admin)
   */
  async delete(id: number): Promise<any> {
    // TODO: Dev 2 implement
  }
}