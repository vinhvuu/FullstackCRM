import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

import {
  ConvertService,
  ConvertFromLeadDto,
} from './convert.service';

@Controller('convert')
@UseGuards(JwtGuard)
export class ConvertController {
  constructor(
    private readonly convertService: ConvertService,
  ) {}

  /**
   * POST /api/convert/lead
   */
  @Post('lead')
  async convertLead(
    @Body() dto: ConvertFromLeadDto,
    @CurrentUser() user: any,
  ) {
    return this.convertService.convertFromLead(
      dto,
      user.id,
    );
  }
}
