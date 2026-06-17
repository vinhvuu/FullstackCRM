import { Injectable, Logger } from '@nestjs/common';

export interface CreateLineItemDto {
  productId?: number;
  name: string;
  qty: number;
  unitPrice: number;
  discountPct?: number;
  taxPct?: number;
}

export interface UpdateLineItemDto {
  productId?: number;
  name?: string;
  qty?: number;
  unitPrice?: number;
  discountPct?: number;
  taxPct?: number;
}

@Injectable()
export class LineItemsService {
  private readonly logger = new Logger(LineItemsService.name);

  /**
   * T3.15. POST /api/deals/:id/line-items — Thêm dòng
   * Auth: Authenticated
   * Response 201: line item (server tính total)
   */
  async create(dealId: number, dto: CreateLineItemDto, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.16. PUT /api/deals/:id/line-items/:lineItemId — Sửa dòng
   */
  async update(dealId: number, lineItemId: number, dto: UpdateLineItemDto, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.17. DELETE /api/deals/:id/line-items/:lineItemId — Xóa dòng
   * Response 204
   */
  async delete(dealId: number, lineItemId: number, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }
}