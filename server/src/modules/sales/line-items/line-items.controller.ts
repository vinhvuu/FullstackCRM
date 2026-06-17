import { Controller, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { LineItemsService, CreateLineItemDto, UpdateLineItemDto } from './line-items.service';

@Controller('deals/:dealId/line-items')
@UseGuards(JwtGuard)
export class LineItemsController {
  constructor(private readonly lineItemsService: LineItemsService) {}

  @Post()
  create(
    @Param('dealId', ParseIntPipe) dealId: number,
    @Body() dto: CreateLineItemDto,
    @CurrentUser() user: any,
  ) {
    return this.lineItemsService.create(dealId, dto, user.id);
  }

  @Put(':lineItemId')
  update(
    @Param('dealId', ParseIntPipe) dealId: number,
    @Param('lineItemId', ParseIntPipe) lineItemId: number,
    @Body() dto: UpdateLineItemDto,
    @CurrentUser() user: any,
  ) {
    return this.lineItemsService.update(dealId, lineItemId, dto, user.id);
  }

  @Delete(':lineItemId')
  delete(
    @Param('dealId', ParseIntPipe) dealId: number,
    @Param('lineItemId', ParseIntPipe) lineItemId: number,
    @CurrentUser() user: any,
  ) {
    return this.lineItemsService.delete(dealId, lineItemId, user.id);
  }
}