import { Injectable, Logger } from '@nestjs/common';

export interface CreateLossReasonDto {
  label: string;
}

export interface UpdateLossReasonDto {
  label?: string;
}

@Injectable()
export class LossReasonsService {
  private readonly logger = new Logger(LossReasonsService.name);

  /**
   * T3.32. GET /api/loss-reasons — Danh sách
   * Auth: Authenticated
   */
  async list(): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.33. POST /api/loss-reasons (Admin)
   * Auth: Authenticated, Role: admin
   */
  async create(dto: CreateLossReasonDto): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.34. PUT /api/loss-reasons/:id (Admin)
   */
  async update(id: number, dto: UpdateLossReasonDto): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.34. DELETE /api/loss-reasons/:id (Admin)
   */
  async delete(id: number): Promise<any> {
    // TODO: Dev 3 implement
  }
}