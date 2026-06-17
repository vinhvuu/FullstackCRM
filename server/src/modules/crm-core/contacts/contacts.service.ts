import { Injectable, Logger } from '@nestjs/common';

export interface CreateContactDto {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: number;
  tags?: string[];
}

export interface UpdateContactDto {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: number;
  tags?: string[];
}

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  /**
   * T2.13. POST /api/contacts — Tạo contact
   * Auth: Authenticated
   * SP: 2
   * Response 201: contact object
   * Response 409: CONTACT_EMAIL_EXISTS
   */
  async create(dto: CreateContactDto, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.14. GET /api/contacts — Danh sách contact
   * Auth: Authenticated
   * Query: ?page=1&limit=20&search=&companyId=&sortBy=name|createdAt&sortDir=asc|desc
   */
  async list(query: any, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.15. GET /api/contacts/:id — Chi tiết contact
   * Auth: Authenticated
   */
  async findById(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.16. PUT /api/contacts/:id — Cập nhật contact
   * Auth: Authenticated (owner hoặc admin)
   */
  async update(id: number, dto: UpdateContactDto, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.17. DELETE /api/contacts/:id — Xóa (soft) contact
   * Auth: Authenticated (owner hoặc admin)
   * Response 204
   */
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  // Export contract methods
  async searchForPicker(query: string, companyId?: number, limit?: number): Promise<any[]> { return []; }
  async countByCompany(companyId: number): Promise<number> { return 0; }
}