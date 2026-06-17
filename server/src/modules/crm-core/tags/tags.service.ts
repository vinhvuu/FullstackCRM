import { Injectable, Logger } from '@nestjs/common';

export interface CreateTagDto {
  id: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface UpdateTagDto {
  label?: string;
  color?: string;
  bgColor?: string;
}

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  /**
   * T2.23. GET /api/tags — Danh sách tag
   * Auth: Authenticated
   * Response 200: { data: [...] }
   */
  async listAll(): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.24. POST /api/tags — Tạo tag (Admin)
   * Auth: Authenticated, Role: admin
   * Response 201
   * Response 409: TAG_EXISTS
   */
  async create(dto: CreateTagDto): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.25. PUT /api/tags/:id — Cập nhật tag (Admin)
   */
  async update(id: string, dto: UpdateTagDto): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.25. DELETE /api/tags/:id — Xóa tag (Admin)
   * Logic: chỉ xóa nếu không còn lead nào dùng
   */
  async delete(id: string): Promise<any> {
    // TODO: Dev 2 implement
  }
}