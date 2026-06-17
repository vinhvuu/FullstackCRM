import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { SystemSettingsService, UpdateGeneralSettingsDto, UpdateSlaSettingsDto } from './system-settings.service';

@Controller('system-settings')
@UseGuards(JwtGuard)
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Get('general')
  getGeneral() {
    return this.systemSettingsService.getGeneral();
  }

  @Put('general')
  @Roles('admin')
  updateGeneral(@Body() dto: UpdateGeneralSettingsDto) {
    return this.systemSettingsService.updateGeneral(dto);
  }

  @Get('sla')
  getSla() {
    return this.systemSettingsService.getSla();
  }

  @Put('sla')
  @Roles('admin')
  updateSla(@Body() dto: UpdateSlaSettingsDto) {
    return this.systemSettingsService.updateSla(dto);
  }
}