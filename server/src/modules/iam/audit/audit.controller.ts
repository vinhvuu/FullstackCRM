import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AuditService } from './audit.service';

@Controller('audit-logs')
@UseGuards(JwtGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('admin')
  list(@Query() query: any) {
    return this.auditService.list(query);
  }

  @Get('export')
  @Roles('admin')
  export(@Query() query: any) {
    return this.auditService.export(query);
  }
}