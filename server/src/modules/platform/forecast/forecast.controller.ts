import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ForecastService } from './forecast.service';

@Controller('forecast')
@UseGuards(JwtGuard)
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  @Get()
  get(@Query('periodKey') periodKey: string, @CurrentUser() user: any) {
    return this.forecastService.get(periodKey, user.id);
  }

  @Post('snapshot')
  @Roles('admin')
  createSnapshot(@Query('periodKey') periodKey: string, @CurrentUser() user: any) {
    return this.forecastService.createSnapshot(periodKey, user.id);
  }
}