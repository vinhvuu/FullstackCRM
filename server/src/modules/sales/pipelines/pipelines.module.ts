import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';
import { SalesPipeline } from '../database/entities/pipeline.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesPipeline,
    ]),
  ],
  controllers: [
    PipelinesController,
  ],
  providers: [
    PipelinesService,
  ],
  exports: [
    PipelinesService,
  ],
})
export class PipelinesModule {}
