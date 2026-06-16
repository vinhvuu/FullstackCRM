import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { InvitationsModule } from './invitations/invitations.module';
import { InvitationsController } from './invitations/invitations.controller';
import { InvitationsService } from './invitations/invitations.service';
import { AuditModule } from './audit/audit.module';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';
import { PrefsModule } from './prefs/prefs.module';
import { PrefsController } from './prefs/prefs.controller';
import { PrefsService } from './prefs/prefs.service';

@Module({
  imports: [AuthModule, UsersModule, InvitationsModule, AuditModule, PrefsModule],
  controllers: [AuthController, UsersController, InvitationsController, AuditController, PrefsController],
  providers: [AuthService, UsersService, InvitationsService, AuditService, PrefsService]
})
export class IamModule {}
