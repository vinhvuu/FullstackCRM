import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { TagsService, CreateTagDto, UpdateTagDto } from './tags.service';

@Controller('tags')
@UseGuards(JwtGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  listAll() {
    return this.tagsService.listAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }
}