import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { LossReasonsService, CreateLossReasonDto, UpdateLossReasonDto } from './loss-reasons.service';

@Controller('loss-reasons')
@UseGuards(JwtGuard)
export class LossReasonsController {
  constructor(private readonly lossReasonsService: LossReasonsService) {}

  @Get()
  list() {
    return this.lossReasonsService.list();
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateLossReasonDto) {
    return this.lossReasonsService.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() dto: UpdateLossReasonDto) {
    return this.lossReasonsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number) {
    return this.lossReasonsService.delete(id);
  }
}