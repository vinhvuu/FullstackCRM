import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

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
  private readonly logger = new Logger(
    LineItemsService.name,
  );

  private lineItems: any[] = [];

  private calculateTotal(
    qty: number,
    unitPrice: number,
    discountPct = 0,
    taxPct = 0,
  ): number {
    const subtotal = qty * unitPrice;

    const discount =
      subtotal * (discountPct / 100);

    const afterDiscount =
      subtotal - discount;

    const tax =
      afterDiscount * (taxPct / 100);

    return Number(
      (afterDiscount + tax).toFixed(2),
    );
  }

  /**
   * T3.15. POST /api/deals/:id/line-items
   */
  async create(
    dealId: number,
    dto: CreateLineItemDto,
    userId: number,
  ): Promise<any> {
    if (!dto.name?.trim()) {
      throw new BadRequestException(
        'ITEM_NAME_REQUIRED',
      );
    }

    if (!dto.qty || dto.qty <= 0) {
      throw new BadRequestException(
        'INVALID_QTY',
      );
    }

    if (
      dto.unitPrice === undefined ||
      dto.unitPrice < 0
    ) {
      throw new BadRequestException(
        'INVALID_UNIT_PRICE',
      );
    }

    const lineItem = {
      id:
        this.lineItems.length > 0
          ? Math.max(
              ...this.lineItems.map(
                (x) => x.id,
              ),
            ) + 1
          : 1,

      dealId,

      productId:
        dto.productId ?? null,

      name: dto.name,

      qty: dto.qty,

      unitPrice: dto.unitPrice,

      discountPct:
        dto.discountPct ?? 0,

      taxPct:
        dto.taxPct ?? 0,

      total: this.calculateTotal(
        dto.qty,
        dto.unitPrice,
        dto.discountPct,
        dto.taxPct,
      ),

      createdBy: userId,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.lineItems.push(lineItem);

    return lineItem;
  }

  /**
   * T3.16. PUT /api/deals/:id/line-items/:lineItemId
   */
  async update(
    dealId: number,
    lineItemId: number,
    dto: UpdateLineItemDto,
    userId: number,
  ): Promise<any> {
    const item =
      this.lineItems.find(
        (x) =>
          x.id === Number(lineItemId) &&
          x.dealId === Number(dealId),
      );

    if (!item) {
      throw new NotFoundException(
        'LINE_ITEM_NOT_FOUND',
      );
    }

    if (dto.productId !== undefined) {
      item.productId = dto.productId;
    }

    if (dto.name !== undefined) {
      item.name = dto.name;
    }

    if (dto.qty !== undefined) {
      item.qty = dto.qty;
    }

    if (dto.unitPrice !== undefined) {
      item.unitPrice = dto.unitPrice;
    }

    if (dto.discountPct !== undefined) {
      item.discountPct =
        dto.discountPct;
    }

    if (dto.taxPct !== undefined) {
      item.taxPct = dto.taxPct;
    }

    item.total = this.calculateTotal(
      item.qty,
      item.unitPrice,
      item.discountPct,
      item.taxPct,
    );

    item.updatedAt = new Date();

    return item;
  }

  /**
   * T3.17. DELETE /api/deals/:id/line-items/:lineItemId
   */
  async delete(
    dealId: number,
    lineItemId: number,
    userId: number,
  ): Promise<any> {
    const index =
      this.lineItems.findIndex(
        (x) =>
          x.id === Number(lineItemId) &&
          x.dealId === Number(dealId),
      );

    if (index === -1) {
      throw new NotFoundException(
        'LINE_ITEM_NOT_FOUND',
      );
    }

    this.lineItems.splice(index, 1);

    return {
      success: true,
      message:
        'Line item deleted successfully',
    };
  }
}
