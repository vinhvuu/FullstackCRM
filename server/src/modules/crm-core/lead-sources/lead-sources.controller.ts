import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { LeadSourcesService, CreateLeadSourceDto, UpdateLeadSourceDto } from './lead-sources.service';

@Controller('lead-sources')
@UseGuards(JwtGuard)
export class LeadSourcesController {
  constructor(private readonly leadSourcesService: LeadSourcesService) {}

  @Get()
  list() {
    return this.leadSourcesService.list();
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateLeadSourceDto) {
    return this.leadSourcesService.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() dto: UpdateLeadSourceDto) {
    return this.leadSourcesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number) {
    return this.leadSourcesService.delete(id);
  }
}