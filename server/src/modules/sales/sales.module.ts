import { Module } from '@nestjs/common';
import { DealsModule } from './deals/deals.module';
import { DealsController } from './deals/deals.controller';
import { DealsService } from './deals/deals.service';
import { PipelinesModule } from './pipelines/pipelines.module';
import { PipelinesController } from './pipelines/pipelines.controller';
import { PipelinesService } from './pipelines/pipelines.service';
import { LineItemsModule } from './line-items/line-items.module';
import { LineItemsController } from './line-items/line-items.controller';
import { LineItemsService } from './line-items/line-items.service';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { QuotesModule } from './quotes/quotes.module';
import { QuotesController } from './quotes/quotes.controller';
import { QuotesService } from './quotes/quotes.service';
import { LossReasonsModule } from './loss-reasons/loss-reasons.module';
import { LossReasonsController } from './loss-reasons/loss-reasons.controller';
import { LossReasonsService } from './loss-reasons/loss-reasons.service';
import { ConvertModule } from './convert/convert.module';
import { ConvertController } from './convert/convert.controller';
import { ConvertService } from './convert/convert.service';

@Module({
  imports: [DealsModule, PipelinesModule, LineItemsModule, ProductsModule, QuotesModule, LossReasonsModule, ConvertModule],
  controllers: [DealsController, PipelinesController, LineItemsController, ProductsController, QuotesController, LossReasonsController, ConvertController],
  providers: [DealsService, PipelinesService, LineItemsService, ProductsService, QuotesService, LossReasonsService, ConvertService]
})
export class SalesModule {}
