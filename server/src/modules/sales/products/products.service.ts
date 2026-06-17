import { Injectable, Logger } from '@nestjs/common';

export interface CreateProductDto {
  code?: string;
  name: string;
  group?: string;
  unitPrice: number;
  unit?: string;
  currency?: 'VND' | 'USD';
  defaultTaxPct?: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdateProductDto {
  code?: string;
  name?: string;
  group?: string;
  unitPrice?: number;
  unit?: string;
  currency?: 'VND' | 'USD';
  defaultTaxPct?: number;
  description?: string;
  isActive?: boolean;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  /**
   * T3.18. POST /api/products
   * Auth: Authenticated, Role: admin
   * Response 201
   * Response 409: PRODUCT_CODE_EXISTS
   */
  async create(dto: CreateProductDto): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.19. GET /api/products
   * Auth: Authenticated
   * Query: ?page=1&limit=20&search=&group=&isActive=true|false&sortBy=...&sortDir=...
   */
  async list(query: any): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.20. GET /api/products/:id
   * Auth: Authenticated
   */
  async findById(id: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.21. PUT /api/products/:id
   */
  async update(id: number, dto: UpdateProductDto): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.22. DELETE /api/products/:id — Soft delete
   * Logic: set is_active=false, deleted_at=NOW
   */
  async delete(id: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  /**
   * T3.23. GET /api/products/picker — Search cho picker
   * Query: ?q=&limit=10
   */
  async searchForPicker(query: string, limit?: number): Promise<any> {
    // TODO: Dev 3 implement
  }

  // Export contract methods
  async isActive(id: number): Promise<boolean> { return true; }
}