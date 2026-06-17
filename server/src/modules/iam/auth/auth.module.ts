// src/iam/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamUser } from '../users/entities/user.entity';
import { IamUserSession } from '../users/entities/user-session.entity';
import { IamPasswordReset } from '../users/entities/password-reset.entity';
import { IamUserPrefs } from '../prefs/entities/user-prefs.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IamUser, IamUserSession, IamPasswordReset, IamUserPrefs]),
    AuditModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}