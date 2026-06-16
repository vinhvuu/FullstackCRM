import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {  JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { TimelineService, CreateTimelineItemDto } from './timeline.service';

@Controller('timeline')
@UseGuards(JwtGuard)
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  list(@Query() query: any) {
    return this.timelineService.list(query);
  }

  @Post()
  create(@Body() dto: CreateTimelineItemDto, @CurrentUser() user: any) {
    return this.timelineService.create(dto, user.id);
  }

  @Get('filters')
  getFilters() {
    return this.timelineService.getFilters();
  }
}