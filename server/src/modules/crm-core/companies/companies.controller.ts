import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CompaniesService, CreateCompanyDto, UpdateCompanyDto } from './companies.service';

@Controller('companies')
@UseGuards(JwtGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() dto: CreateCompanyDto, @CurrentUser() user: any) {
    return this.companiesService.create(dto, user.id);
  }

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.companiesService.list(query, user.id, user.role);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() user: any) {
    return this.companiesService.findById(id, user.id, user.role);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCompanyDto, @CurrentUser() user: any) {
    return this.companiesService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.companiesService.delete(id, user.id, user.role);
  }
}