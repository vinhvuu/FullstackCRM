import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LossReasonsController } from './loss-reasons.controller';
import { LossReasonsService } from './loss-reasons.service';
import { SalesLossReason } from '../database/entities/loss-reason.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesLossReason,
    ]),
  ],
  controllers: [
    LossReasonsController,
  ],
  providers: [
    LossReasonsService,
  ],
  exports: [
    LossReasonsService,
  ],
})
export class LossReasonsModule {}
