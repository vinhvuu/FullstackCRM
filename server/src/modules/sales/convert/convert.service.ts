import { Injectable, Logger } from '@nestjs/common';

export interface ConvertFromLeadDto {
  leadId: number;
  dealTitle: string;
  dealValue: number;
  dealStage: 'lead' | 'qualified' | 'proposal' | 'negotiation';
  expectedCloseDate: string;
  createContact: boolean;
}

@Injectable()
export class ConvertService {
  private readonly logger = new Logger(ConvertService.name);

  /**
   * T3.14. POST /api/deals/convert-from-lead — Convert Lead
   * Auth: Authenticated
   * Response 201: { dealId, contactId }
   */
  async convertFromLead(dto: ConvertFromLeadDto, userId: number): Promise<any> {
    // TODO: Dev 3 implement
    // 1. Validate leadId tồn tại và owner có quyền
    // 2. Nếu createContact=true → gọi CrmLeadService.convertToContact() → nhận contactId
    // 3. Tạo deal
    // 4. Update lead: status='qualified', score += 10
    // 5. Thêm timeline cho lead
    // 6. Audit log action='convert', entityType='lead'
  }
}