import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { SalesDeal } from '../database/entities/deal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesDeal,
    ]),
  ],
  controllers: [
    DealsController,
  ],
  providers: [
    DealsService,
  ],
  exports: [
    DealsService,
  ],
})
export class DealsModule {}
