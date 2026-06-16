import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { DistributionService, AssignLeadsDto, CreateDistributionRuleDto, UpdateDistributionRuleDto } from './distribution.service';

@Controller('distribution')
@UseGuards(JwtGuard)
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @Get('summary')
  @Roles('admin')
  getSummary() {
    return this.distributionService.getSummary();
  }

  @Get('assignable')
  @Roles('admin')
  listAssignable(@Query() query: any) {
    return this.distributionService.listAssignable(query);
  }

  @Post('assign')
  @Roles('admin')
  assign(@Body() dto: AssignLeadsDto, @CurrentUser() user: any) {
    return this.distributionService.assign(dto, user.id);
  }

  @Post('apply-rules')
  @Roles('admin')
  applyRules(@CurrentUser() user: any) {
    return this.distributionService.applyRules(user.id);
  }

  @Get('rules')
  listRules(@Query() query: any) {
    return this.distributionService.listRules(query);
  }

  @Post('rules')
  createRule(@Body() dto: CreateDistributionRuleDto) {
    return this.distributionService.createRule(dto);
  }

  @Put('rules/:id')
  updateRule(@Param('id') id: number, @Body() dto: UpdateDistributionRuleDto) {
    return this.distributionService.updateRule(id, dto);
  }

  @Delete('rules/:id')
  deleteRule(@Param('id') id: number) {
    return this.distributionService.deleteRule(id);
  }

  @Post('rules/:id/toggle')
  toggleRule(@Param('id') id: number) {
    return this.distributionService.toggleRule(id);
  }

  @Get('pool-config')
  getPoolConfig() {
    return this.distributionService.getPoolConfig();
  }

  @Put('pool-config')
  updatePoolConfig(@Body() dto: any) {
    return this.distributionService.updatePoolConfig(dto);
  }
}