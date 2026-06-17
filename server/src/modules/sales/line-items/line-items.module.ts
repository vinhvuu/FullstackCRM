import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LineItemsController } from './line-items.controller';
import { LineItemsService } from './line-items.service';
import { SalesDealLineItem } from '../database/entities/deal-line-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesDealLineItem,
    ]),
  ],
  controllers: [
    LineItemsController,
  ],
  providers: [
    LineItemsService,
  ],
  exports: [
    LineItemsService,
  ],
})
export class LineItemsModule {}
