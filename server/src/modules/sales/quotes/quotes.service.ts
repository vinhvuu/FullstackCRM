import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

export interface CreateQuoteDto {
  title: string;
  dealId?: number;
  companyId?: number;
  contactId?: number;
  validUntil?: string;
  currency?: 'VND' | 'USD';
  terms?: string;
  lineItems: {
    productId?: number;
    name: string;
    qty: number;
    unitPrice: number;
    discountPct?: number;
    taxPct?: number;
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

  private quotes: any[] = [];

  private generateQuoteNumber(): string {
    const year = new Date().getFullYear();
    const seq = String(this.quotes.length + 1).padStart(3, '0');
    return `Q-${year}-${seq}`;
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((sum, item) => {
     
