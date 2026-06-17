import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SalesProduct } from '../database/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesProduct,
    ]),
  ],
  controllers: [
    ProductsController,
  ],
  providers: [
    ProductsService,
  ],
  exports: [
    ProductsService,
  ],
})
export class ProductsModule {}
