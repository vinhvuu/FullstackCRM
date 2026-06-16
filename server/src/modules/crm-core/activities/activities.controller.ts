import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ActivitiesService, CreateActivityDto, UpdateActivityDto } from './activities.service';

@Controller('activities')
@UseGuards(JwtGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() dto: CreateActivityDto, @CurrentUser() user: any) {
    return this.activitiesService.create(dto, user.id);
  }

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.activitiesService.list(query, user.id, user.role);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() user: any) {
    return this.activitiesService.findById(id, user.id, user.role);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateActivityDto, @CurrentUser() user: any) {
    return this.activitiesService.update(id, dto, user.id, user.role);
  }

  @Post(':id/complete')
  complete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.activitiesService.complete(id, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.activitiesService.delete(id, user.id, user.role);
  }
}