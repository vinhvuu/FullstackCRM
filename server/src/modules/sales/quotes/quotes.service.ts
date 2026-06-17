import { Injectable, Logger } from '@nestjs/common';

export interface CreateQuoteDto {
  title: string;
  dealId?: number;
  companyId?: number;
  contactId?: number;
  validUntil?: string;
  currency?: 'VND' | 'USD';
  terms?: string;
  lineItems: {
    productId?: number; name: string; qty: number; unitPrice: number; discountPct?: number; taxPct?: number;
  }[];
}

export interface UpdateQuoteDto {
  title?: string;
  dealId?: number;
  companyId?: number;
  contactId?: number;
  validUntil?: string;
  currency?: 'VND' | 'USD';
  terms?: string;
  lineItems?: any[];
}

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  /**
   * T3.24. POST /api/quotes — Tạo báo giá
   * Auth: Authenticated
   * Response 201: quote object với number tự generate (Q-YYYY-###)
   */
  async create(dto: CreateQuoteDto, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.25. GET /api/quotes
   * Auth: Authenticated
   * Query: ?page=1&limit=20&status=draft|sent|accepted|rejected|expired&search=&contactId=&companyId=&dealId=
   */
  async list(query: any, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.26. GET /api/quotes/:id
   * Auth: Authenticated
   */
  async findById(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.27. PUT /api/quotes/:id
   * Logic: chỉ sửa được khi status='draft'. Nếu status='sent' → chỉ cho phép sửa terms
   */
  async update(id: number, dto: UpdateQuoteDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.28. DELETE /api/quotes/:id — Soft delete
   * Chỉ xóa khi status='draft'
   */
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.29. POST /api/quotes/:id/send — Gửi báo giá
   * Response 200: quote với status='sent', sent_at=NOW
   */
  async send(id: number, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.30. POST /api/quotes/:id/accept
   * Response 200: quote với status='accepted', decided_at=NOW
   */
  async accept(id: number, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.31. POST /api/quotes/:id/reject
   * Request: { reason?: string }
   */
  async reject(id: number, dto: any, userId: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  // Export contract methods
  async countByOwner(ownerId: number): Promise<number> { return 0; }
  async sumAcceptedTotal(from: Date, to: Date): Promise<number> { return 0; }
}