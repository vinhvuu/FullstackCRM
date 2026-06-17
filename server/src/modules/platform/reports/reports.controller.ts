import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ReportsService, CreateReportDefDto, RunReportDto, DrilldownDto } from './reports.service';

@Controller('reports')
@UseGuards(JwtGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('presets')
  listPresets() {
    return this.reportsService.listPresets();
  }

  @Get('defs')
  listDefs(@Query() query: any, @CurrentUser() user: any) {
    return this.reportsService.listDefs(query, user.id);
  }

  @Post('defs')
  createDef(@Body() dto: CreateReportDefDto, @CurrentUser() user: any) {
    return this.reportsService.createDef(dto, user.id);
  }

  @Post('run')
  run(@Body() dto: RunReportDto, @CurrentUser() user: any) {
    return this.reportsService.run(dto, user.id);
  }

  @Post('drilldown')
  drilldown(@Body() dto: DrilldownDto, @CurrentUser() user: any) {
    return this.reportsService.drilldown(dto, user.id);
  }

  @Delete('defs/:id')
  deleteDef(@Param('id') id: number, @CurrentUser() user: any) {
    return this.reportsService.deleteDef(id, user.id);
  }
}