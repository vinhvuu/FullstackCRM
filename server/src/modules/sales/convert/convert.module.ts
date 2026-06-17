import { Module } from '@nestjs/common';

import { ConvertController } from './convert.controller';
import { ConvertService } from './convert.service';

import { DealsModule } from '../deals/deals.module';

@Module({
  imports: [DealsModule],
  controllers: [ConvertController],
  providers: [ConvertService],
  exports: [ConvertService],
})
export class ConvertModule {}
