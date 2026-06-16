import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { GoalsService, CreateGoalDto, UpdateGoalDto } from './goals.service';

@Controller('goals')
@UseGuards(JwtGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.goalsService.list(query, user.id);
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateGoalDto) {
    return this.goalsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.goalsService.delete(id);
  }
}