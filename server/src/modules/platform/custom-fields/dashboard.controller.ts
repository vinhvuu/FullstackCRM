import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { DashboardService, UpdateDashboardLayoutDto } from '../dashboard/dashboard.service';

@Controller('dashboard')
@UseGuards(JwtGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-deals')
  getRecentDeals(@Query() query: any) {
    return this.dashboardService.getRecentDeals(query);
  }

  @Get('layout')
  getLayout(@CurrentUser() user: any) {
    return this.dashboardService.getLayout(user.id);
  }

  @Put('layout')
  updateLayout(@CurrentUser() user: any, @Body() dto: UpdateDashboardLayoutDto) {
    return this.dashboardService.updateLayout(user.id, dto);
  }
}