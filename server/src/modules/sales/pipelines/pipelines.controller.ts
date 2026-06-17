import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { PipelinesService, CreatePipelineDto, UpdatePipelineDto } from './pipelines.service';

@Controller('pipelines')
@UseGuards(JwtGuard)
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get()
  list() {
    return this.pipelinesService.list();
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreatePipelineDto) {
    return this.pipelinesService.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() dto: UpdatePipelineDto) {
    return this.pipelinesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number) {
    return this.pipelinesService.delete(id);
  }
}