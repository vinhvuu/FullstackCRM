import { Injectable, Logger } from '@nestjs/common';

export interface CreateCustomFieldDto {
  entity: 'lead' | 'contact' | 'company' | 'deal' | 'quote' | 'activity';
  fieldKey: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: string[];
  required?: boolean;
  displayOrder?: number;
}

export interface UpdateCustomFieldDto {
  label?: string;
  type?: string;
  options?: string[];
  required?: boolean;
  displayOrder?: number;
}

export interface SetCustomFieldValueDto {
  entity: string;
  recordId: number;
  fieldKey: string;
  value: string | number | boolean | null;
}

@Injectable()
export class CustomFieldsService {
  private readonly logger = new Logger(CustomFieldsService.name);

  /**
   * T4.11. GET /api/custom-fields
   * Auth: Authenticated
   * Query: ?entity=lead|contact|company|deal|quote|activity
   */
  async list(query: any): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.12. POST /api/custom-fields (Admin)
   * Auth: Authenticated, Role: admin
   * Response 201
   * Response 409: FIELD_KEY_EXISTS
   */
  async create(dto: CreateCustomFieldDto): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.13. PUT /api/custom-fields/:id (Admin)
   */
  async update(id: number, dto: UpdateCustomFieldDto): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.13. DELETE /api/custom-fields/:id (Admin)
   */
  async delete(id: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.14. GET /api/custom-fields/values — Lấy giá trị theo record
   * Query: ?entity=&recordId=
   */
  async getValues(query: any): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.15. POST /api/custom-fields/values — Set giá trị
   * Auth: Authenticated
   */
  async setValues(dto: SetCustomFieldValueDto, userId: number): Promise<any> {
    // TODO: Dev 4 implement
    // Validate recordId tồn tại (cross-module)
  }

  // Export contract methods
  async getDefs(entity: string): Promise<any[]> { return []; }
  async validateValues(entity: string, recordId: number, values: any[]): Promise<any> { return { ok: true, errors: [] }; }
}