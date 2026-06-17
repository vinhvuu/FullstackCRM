import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { DealsService, CreateDealDto, UpdateDealDto, UpdateDealStageDto, MarkLostDto } from './deals.service';
import { ConvertService, ConvertFromLeadDto } from '../convert/convert.service';

@Controller('deals')
@UseGuards(JwtGuard)
export class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly convertService: ConvertService,
  ) {}

  @Post()
  create(@Body() dto: CreateDealDto, @CurrentUser() user: any) {
    return this.dealsService.create(dto, user.id);
  }

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.dealsService.list(query, user.id, user.role);
  }

  @Get('board')
  getBoard(@Query() query: any, @CurrentUser() user: any) {
    return this.dealsService.getBoard(query, user.id, user.role);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() user: any) {
    return this.dealsService.findById(id, user.id, user.role);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDealDto, @CurrentUser() user: any) {
    return this.dealsService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.dealsService.delete(id, user.id, user.role);
  }

  @Put(':id/stage')
  updateStage(@Param('id') id: number, @Body() dto: UpdateDealStageDto, @CurrentUser() user: any) {
    return this.dealsService.updateStage(id, dto, user.id);
  }

  @Post(':id/mark-won')
  markWon(@Param('id') id: number, @CurrentUser() user: any) {
    return this.dealsService.markWon(id, user.id);
  }

  @Post(':id/mark-lost')
  markLost(@Param('id') id: number, @Body() dto: MarkLostDto, @CurrentUser() user: any) {
    return this.dealsService.markLost(id, dto, user.id);
  }

  @Post('convert-from-lead')
  convertFromLead(@Body() dto: ConvertFromLeadDto, @CurrentUser() user: any) {
    return this.convertService.convertFromLead(dto, user.id);
  }
}