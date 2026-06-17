import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';

import { DealsService } from '../deals/deals.service';

export interface ConvertFromLeadDto {
  leadId: number;
  dealTitle: string;
  dealValue: number;
  dealStage:
    | 'lead'
    | 'qualified'
    | 'proposal'
    | 'negotiation';

  expectedCloseDate: string;
  createContact: boolean;
}

@Injectable()
export class ConvertService {
  private readonly logger = new Logger(
    ConvertService.name,
  );

  constructor(
    private readonly dealsService: DealsService,
  ) {}

  /**
   * T3.14. POST /api/deals/convert-from-lead
   * Response:
   * {
   *   dealId: number,
   *   contactId: number | null
   * }
   */
  async convertFromLead(
    dto: ConvertFromLeadDto,
    userId: number,
  ): Promise<any> {
    if (!dto.leadId) {
      throw new BadRequestException(
        'LEAD_ID_REQUIRED',
      );
    }

    if (!dto.dealTitle?.trim()) {
      throw new BadRequestException(
        'DEAL_TITLE_REQUIRED',
      );
    }

    if (
      dto.dealValue === undefined ||
      dto.dealValue === null
    ) {
      throw new BadRequestException(
        'DEAL_VALUE_REQUIRED',
      );
    }

    let contactId: number | null = null;

    /**
     * TODO:
     * Khi có ContactsService:
     *
     * if (dto.createContact) {
     *   const contact =
     *     await this.contactsService.create(...);
     *
     *   contactId = contact.id;
     * }
     */

    const deal = await this.dealsService.create(
      {
        title: dto.dealTitle,
        value: dto.dealValue,
        leadId: dto.leadId,
        contactId,
        stage: dto.dealStage,
        expectedCloseDate:
          dto.expectedCloseDate,
      },
      userId,
    );

    this.logger.log(
      `Lead ${dto.leadId} converted to deal ${deal.id}`,
    );

    return {
      success: true,
      leadId: dto.leadId,
      dealId: deal.id,
      contactId,
      message:
        'Lead converted successfully',
    };
  }
}
