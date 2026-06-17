import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { QuotesService, CreateQuoteDto, UpdateQuoteDto } from './quotes.service';

@Controller('quotes')
@UseGuards(JwtGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(@Body() dto: CreateQuoteDto, @CurrentUser() user: any) {
    return this.quotesService.create(dto, user.id);
  }

  @Get()
  list(@Query() query: any, @CurrentUser() user: any) {
    return this.quotesService.list(query, user.id, user.role);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() user: any) {
    return this.quotesService.findById(id, user.id, user.role);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateQuoteDto, @CurrentUser() user: any) {
    return this.quotesService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @CurrentUser() user: any) {
    return this.quotesService.delete(id, user.id, user.role);
  }

  @Post(':id/send')
  send(@Param('id') id: number, @CurrentUser() user: any) {
    return this.quotesService.send(id, user.id);
  }

  @Post(':id/accept')
  accept(@Param('id') id: number, @CurrentUser() user: any) {
    return this.quotesService.accept(id, user.id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: number, @Body() dto: any, @CurrentUser() user: any) {
    return this.quotesService.reject(id, dto, user.id);
  }
}