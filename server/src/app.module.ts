import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IamModule } from './modules/iam/iam.module';
import { CrmCoreModule } from './modules/crm-core/crm-core.module';
import { SalesModule } from './modules/sales/sales.module';
import { PlatformModule } from './modules/platform/platform.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_DATABASE ?? 'vanhcorp_crm',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.DB_LOGGING === 'true',
    }),
    DatabaseModule,
    IamModule,
    CrmCoreModule,
    SalesModule,
    PlatformModule,
  ],
})
export class AppModule {}