export const SALES_DEAL_SERVICE = Symbol('SALES_DEAL_SERVICE');
export const SALES_PRODUCT_SERVICE = Symbol('SALES_PRODUCT_SERVICE');
export const SALES_QUOTE_SERVICE = Symbol('SALES_QUOTE_SERVICE');

export interface DealDto {
  id: number;
  title: string;
  value: number;
  currency: 'VND' | 'USD';
  stage: string;
  status: 'open' | 'won' | 'lost';
  ownerId: number;
  contactId?: number;
  companyId?: number;
  expectedCloseDate?: string;
}

export interface ProductDto {
  id: number;
  code?: string;
  name: string;
  unitPrice: number;
  currency: 'VND' | 'USD';
  isActive: boolean;
}

export interface ISalesDealService {
  findById(id: number): Promise<DealDto | null>;
  findByIds(ids: number[]): Promise<DealDto[]>;
  searchForPicker(query: string, limit?: number): Promise<{ id: number; title: string }[]>;
  countOpenByOwner(ownerId: number): Promise<number>;
  countOpenByCompany(companyId: number): Promise<number>;
  sumOpenValueByCompany(companyId: number): Promise<number>;
  sumWonValue(from: Date, to: Date, ownerId?: number): Promise<number>;
  winRate(from: Date, to: Date, ownerId?: number): Promise<number>;
  revenueByOwnerInPeriod(ownerId: number, periodKey: string): Promise<number>;
  dealsWonByOwnerInPeriod(ownerId: number, periodKey: string): Promise<number>;
  forecastBuckets(periodKey: string, ownerId?: number): Promise<{ committed: number; best_case: number; pipeline: number }>;
}

export interface ISalesProductService {
  findById(id: number): Promise<ProductDto | null>;
  findByIds(ids: number[]): Promise<ProductDto[]>;
  searchForPicker(query: string, limit?: number): Promise<{ id: number; code?: string; name: string; unitPrice: number }[]>;
  isActive(id: number): Promise<boolean>;
}

export interface ISalesQuoteService {
  countByOwner(ownerId: number): Promise<number>;
  sumAcceptedTotal(from: Date, to: Date): Promise<number>;
}