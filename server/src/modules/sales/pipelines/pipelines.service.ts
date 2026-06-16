import { Injectable, Logger } from '@nestjs/common';

export interface CreatePipelineDto {
  name: string;
  stages: { id: string; label: string; color: string; probability: number }[];
}

export interface UpdatePipelineDto {
  name?: string;
  stages?: { id: string; label: string; color: string; probability: number }[];
}

@Injectable()
export class PipelinesService {
  private readonly logger = new Logger(PipelinesService.name);

  /**
   * T3.1. GET /api/pipelines — Danh sách pipeline
   * Auth: Authenticated
   */
  async list(): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.2. POST /api/pipelines (Admin)
   * Auth: Authenticated, Role: admin
   * Response 201
   */
  async create(dto: CreatePipelineDto): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.3. PUT /api/pipelines/:id (Admin)
   */
  async update(id: number, dto: UpdatePipelineDto): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.4. DELETE /api/pipelines/:id (Admin)
   * Logic: chỉ xóa nếu không còn deal nào dùng
   */
  async delete(id: number): Promise<any> {
    // TODO: Dev 3 implement
  }
}