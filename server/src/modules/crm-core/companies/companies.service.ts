import { Injectable, Logger } from '@nestjs/common';

export interface CreateCompanyDto {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  phone?: string;
  address?: string;
  taxCode?: string;
  description?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  website?: string;
  industry?: string;
  size?: string;
  phone?: string;
  address?: string;
  taxCode?: string;
  description?: string;
}

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  /**
   * T2.18. POST /api/companies
   * Auth: Authenticated
   * SP: 2
   * Response 201
   * Response 409: COMPANY_NAME_EXISTS
   */
  async create(dto: CreateCompanyDto, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.19. GET /api/companies
   * Auth: Authenticated
   * Query: ?page=1&limit=20&search=&industry=&size=&view=grid|table
   * Response 200: mảng company với contactCount, openDealCount, openDealValue
   */
  async list(query: any, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.20. GET /api/companies/:id
   * Auth: Authenticated
   */
  async findById(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.21. PUT /api/companies/:id — Cập nhật
   * Auth: Authenticated (owner hoặc admin)
   */
  async update(id: number, dto: UpdateCompanyDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.22. DELETE /api/companies/:id — Xóa (soft)
   * Auth: Authenticated (owner hoặc admin)
   * Response 204
   */
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  // Export contract methods
  async searchForPicker(query: string, limit?: number): Promise<any[]> { return []; }
  async openDealValueByCompany(companyId: number): Promise<number> { return 0; }
  async openDealCountByCompany(companyId: number): Promise<number> { return 0; }
}