import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { SavedViewsService, CreateSavedViewDto, UpdateSavedViewDto } from './saved-views.service';

@Controller('saved-views')
@UseGuards(JwtGuard)
export class SavedViewsController {
  constructor(private readonly savedViewsService: SavedViewsService) {}

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.savedViewsService.list(query, user.id);
  }

  @Post()
  create(@Body() dto: CreateSavedViewDto, @CurrentUser() user: any) {
    return this.savedViewsService.create(dto, user.id);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() user: any) {
    return this.savedViewsService.findById(id, user.id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSavedViewDto, @CurrentUser() user: any) {
    return this.savedViewsService.update(id, dto, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.savedViewsService.delete(id, user.id);
  }
}