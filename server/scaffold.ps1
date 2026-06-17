# ============================================================
# VanhCorp CRM - NestJS Backend Scaffold Script
# Chay: cd server && powershell -ExecutionPolicy Bypass -File scaffold.ps1
# ============================================================

Write-Host "=== Step 1: Install dependencies ===" -ForegroundColor Cyan
npm install

Write-Host "`n=== Step 2: Generate NestJS project files (main.ts, app.module.ts, etc.) ===" -ForegroundColor Cyan
# nest new da tao package.json roi, nen ta chi can generate cac file core
# Tao src/ va cac file chinh bang nest generate application
npx nest generate application --no-spec --flat

# ============================================================
# COMMON - shared across all 4 devs
# ============================================================
Write-Host "`n=== Step 3: Common (decorators, guards, interceptors, filters, pipes, dto, constants, utils) ===" -ForegroundColor Cyan

# Guards
npx nest g guard common/guards/jwt --flat --no-spec
npx nest g guard common/guards/roles --flat --no-spec

# Interceptors
npx nest g interceptor common/interceptors/response --flat --no-spec

# Filters
npx nest g filter common/filters/http-exception --flat --no-spec

# Pipes
npx nest g pipe common/pipes/validation --flat --no-spec

# ============================================================
# DATABASE
# ============================================================
Write-Host "`n=== Step 4: Database module ===" -ForegroundColor Cyan
npx nest g module database --no-spec

# ============================================================
# MODULE 1: IAM (DEV 1)
# ============================================================
Write-Host "`n=== Step 5: Module IAM (DEV 1) ===" -ForegroundColor Cyan
npx nest g module modules/iam --no-spec

# Sub-modules
npx nest g module modules/iam/auth --no-spec
npx nest g controller modules/iam/auth --no-spec --flat
npx nest g service modules/iam/auth --no-spec --flat

npx nest g module modules/iam/users --no-spec
npx nest g controller modules/iam/users --no-spec --flat
npx nest g service modules/iam/users --no-spec --flat

npx nest g module modules/iam/invitations --no-spec
npx nest g controller modules/iam/invitations --no-spec --flat
npx nest g service modules/iam/invitations --no-spec --flat

npx nest g module modules/iam/audit --no-spec
npx nest g controller modules/iam/audit --no-spec --flat
npx nest g service modules/iam/audit --no-spec --flat

npx nest g module modules/iam/prefs --no-spec
npx nest g controller modules/iam/prefs --no-spec --flat
npx nest g service modules/iam/prefs --no-spec --flat

# ============================================================
# MODULE 2: CRM-CORE (DEV 2)
# ============================================================
Write-Host "`n=== Step 6: Module CRM-CORE (DEV 2) ===" -ForegroundColor Cyan
npx nest g module modules/crm-core --no-spec

npx nest g module modules/crm-core/leads --no-spec
npx nest g controller modules/crm-core/leads --no-spec --flat
npx nest g service modules/crm-core/leads --no-spec --flat

npx nest g module modules/crm-core/contacts --no-spec
npx nest g controller modules/crm-core/contacts --no-spec --flat
npx nest g service modules/crm-core/contacts --no-spec --flat

npx nest g module modules/crm-core/companies --no-spec
npx nest g controller modules/crm-core/companies --no-spec --flat
npx nest g service modules/crm-core/companies --no-spec --flat

npx nest g module modules/crm-core/tags --no-spec
npx nest g controller modules/crm-core/tags --no-spec --flat
npx nest g service modules/crm-core/tags --no-spec --flat

npx nest g module modules/crm-core/lead-sources --no-spec
npx nest g controller modules/crm-core/lead-sources --no-spec --flat
npx nest g service modules/crm-core/lead-sources --no-spec --flat

npx nest g module modules/crm-core/reminders --no-spec
npx nest g controller modules/crm-core/reminders --no-spec --flat
npx nest g service modules/crm-core/reminders --no-spec --flat

npx nest g module modules/crm-core/activities --no-spec
npx nest g controller modules/crm-core/activities --no-spec --flat
npx nest g service modules/crm-core/activities --no-spec --flat

npx nest g module modules/crm-core/timeline --no-spec
npx nest g controller modules/crm-core/timeline --no-spec --flat
npx nest g service modules/crm-core/timeline --no-spec --flat

npx nest g module modules/crm-core/attachments --no-spec
npx nest g controller modules/crm-core/attachments --no-spec --flat
npx nest g service modules/crm-core/attachments --no-spec --flat

npx nest g module modules/crm-core/email-templates --no-spec
npx nest g controller modules/crm-core/email-templates --no-spec --flat
npx nest g service modules/crm-core/email-templates --no-spec --flat

npx nest g module modules/crm-core/distribution --no-spec
npx nest g controller modules/crm-core/distribution --no-spec --flat
npx nest g service modules/crm-core/distribution --no-spec --flat

# ============================================================
# MODULE 3: SALES (DEV 3)
# ============================================================
Write-Host "`n=== Step 7: Module SALES (DEV 3) ===" -ForegroundColor Cyan
npx nest g module modules/sales --no-spec

npx nest g module modules/sales/deals --no-spec
npx nest g controller modules/sales/deals --no-spec --flat
npx nest g service modules/sales/deals --no-spec --flat

npx nest g module modules/sales/pipelines --no-spec
npx nest g controller modules/sales/pipelines --no-spec --flat
npx nest g service modules/sales/pipelines --no-spec --flat

npx nest g module modules/sales/line-items --no-spec
npx nest g controller modules/sales/line-items --no-spec --flat
npx nest g service modules/sales/line-items --no-spec --flat

npx nest g module modules/sales/products --no-spec
npx nest g controller modules/sales/products --no-spec --flat
npx nest g service modules/sales/products --no-spec --flat

npx nest g module modules/sales/quotes --no-spec
npx nest g controller modules/sales/quotes --no-spec --flat
npx nest g service modules/sales/quotes --no-spec --flat

npx nest g module modules/sales/loss-reasons --no-spec
npx nest g controller modules/sales/loss-reasons --no-spec --flat
npx nest g service modules/sales/loss-reasons --no-spec --flat

npx nest g module modules/sales/convert --no-spec
npx nest g controller modules/sales/convert --no-spec --flat
npx nest g service modules/sales/convert --no-spec --flat

# ============================================================
# MODULE 4: PLATFORM (DEV 4)
# ============================================================
Write-Host "`n=== Step 8: Module PLATFORM (DEV 4) ===" -ForegroundColor Cyan
npx nest g module modules/platform --no-spec

npx nest g module modules/platform/notifications --no-spec
npx nest g controller modules/platform/notifications --no-spec --flat
npx nest g service modules/platform/notifications --no-spec --flat

npx nest g module modules/platform/saved-views --no-spec
npx nest g controller modules/platform/saved-views --no-spec --flat
npx nest g service modules/platform/saved-views --no-spec --flat

npx nest g module modules/platform/custom-fields --no-spec
npx nest g controller modules/platform/custom-fields --no-spec --flat
npx nest g service modules/platform/custom-fields --no-spec --flat

npx nest g module modules/platform/reports --no-spec
npx nest g controller modules/platform/reports --no-spec --flat
npx nest g service modules/platform/reports --no-spec --flat

npx nest g module modules/platform/goals --no-spec
npx nest g controller modules/platform/goals --no-spec --flat
npx nest g service modules/platform/goals --no-spec --flat

npx nest g module modules/platform/dashboard --no-spec
npx nest g controller modules/platform/dashboard --no-spec --flat
npx nest g service modules/platform/dashboard --no-spec --flat

npx nest g module modules/platform/forecast --no-spec
npx nest g controller modules/platform/forecast --no-spec --flat
npx nest g service modules/platform/forecast --no-spec --flat

npx nest g module modules/platform/system-settings --no-spec
npx nest g controller modules/platform/system-settings --no-spec --flat
npx nest g service modules/platform/system-settings --no-spec --flat

npx nest g module modules/platform/search --no-spec
npx nest g controller modules/platform/search --no-spec --flat
npx nest g service modules/platform/search --no-spec --flat

npx nest g module modules/platform/import-export --no-spec
npx nest g controller modules/platform/import-export --no-spec --flat
npx nest g service modules/platform/import-export --no-spec --flat

# ============================================================
# MANUAL DIRS: decorators, dto, constants, utils, interfaces, database sub-dirs
# NestJS CLI khong co lenh generate cho cac thu muc nay
# ============================================================
Write-Host "`n=== Step 9: Tao thu muc thu cong (decorators, dto, constants, utils, interfaces, database) ===" -ForegroundColor Cyan

# Common extras
$manualDirs = @(
    "src/common/decorators",
    "src/common/dto",
    "src/common/constants",
    "src/common/utils",
    # Database
    "src/database/seeds",
    # IAM
    "src/modules/iam/interfaces",
    "src/modules/iam/database/entities",
    "src/modules/iam/database/migrations",
    "src/modules/iam/database/seeds",
    # CRM-CORE
    "src/modules/crm-core/interfaces",
    "src/modules/crm-core/database/entities",
    "src/modules/crm-core/database/migrations",
    "src/modules/crm-core/database/seeds",
    # SALES
    "src/modules/sales/interfaces",
    "src/modules/sales/database/entities",
    "src/modules/sales/database/migrations",
    "src/modules/sales/database/seeds",
    # PLATFORM
    "src/modules/platform/interfaces",
    "src/modules/platform/database/entities",
    "src/modules/platform/database/migrations",
    "src/modules/platform/database/seeds"
)

foreach ($dir in $manualDirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    # Tao file .gitkeep de git track thu muc rong
    New-Item -ItemType File -Path "$dir/.gitkeep" -Force | Out-Null
    Write-Host "  Created: $dir" -ForegroundColor DarkGray
}

# ============================================================
# Tao cac file stub cho common
# ============================================================
Write-Host "`n=== Step 10: Tao stub files ===" -ForegroundColor Cyan

# Decorators
@"
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
"@ | Out-File -FilePath "src/common/decorators/current-user.decorator.ts" -Encoding utf8

@"
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
"@ | Out-File -FilePath "src/common/decorators/public.decorator.ts" -Encoding utf8

@"
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
"@ | Out-File -FilePath "src/common/decorators/roles.decorator.ts" -Encoding utf8

@"
export * from './current-user.decorator';
export * from './public.decorator';
export * from './roles.decorator';
"@ | Out-File -FilePath "src/common/decorators/index.ts" -Encoding utf8

# DTO
@"
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
"@ | Out-File -FilePath "src/common/dto/pagination.dto.ts" -Encoding utf8

@"
import { IsUUID } from 'class-validator';

export class IdParamDto {
  @IsUUID()
  id: string;
}
"@ | Out-File -FilePath "src/common/dto/id-param.dto.ts" -Encoding utf8

@"
export * from './pagination.dto';
export * from './id-param.dto';
"@ | Out-File -FilePath "src/common/dto/index.ts" -Encoding utf8

# Constants
@"
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // General
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};
"@ | Out-File -FilePath "src/common/constants/index.ts" -Encoding utf8

# Utils
@"
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
"@ | Out-File -FilePath "src/common/utils/hash.util.ts" -Encoding utf8

@"
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

export function formatDate(date: Date | string): string {
  return dayjs(date).format('DD/MM/YYYY');
}

export function formatDateTime(date: Date | string): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

export function now(): Date {
  return new Date();
}
"@ | Out-File -FilePath "src/common/utils/date.util.ts" -Encoding utf8

@"
export * from './hash.util';
export * from './date.util';
"@ | Out-File -FilePath "src/common/utils/index.ts" -Encoding utf8

# Interfaces stubs
@"
export interface IamUserPayload {
  id: string;
  email: string;
  role: string;
}
"@ | Out-File -FilePath "src/modules/iam/interfaces/iam-user.interface.ts" -Encoding utf8

@"
export interface CrmLeadServiceInterface {
  // Contract for cross-module usage (e.g., Sales convert)
}

export interface CrmContactServiceInterface {
  // Contract for cross-module usage
}
"@ | Out-File -FilePath "src/modules/crm-core/interfaces/crm-services.interface.ts" -Encoding utf8

@"
export interface SalesDealServiceInterface {
  // Contract for cross-module usage
}

export interface SalesProductServiceInterface {
  // Contract for cross-module usage
}
"@ | Out-File -FilePath "src/modules/sales/interfaces/sales-services.interface.ts" -Encoding utf8

@"
export interface PlatformNotificationServiceInterface {
  // Contract for cross-module usage
}
"@ | Out-File -FilePath "src/modules/platform/interfaces/platform-services.interface.ts" -Encoding utf8

# Database data-source
@"
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'vanhcorp_crm',
  entities: ['src/modules/**/database/entities/*.entity.ts'],
  migrations: ['src/modules/**/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
});
"@ | Out-File -FilePath "src/database/data-source.ts" -Encoding utf8

# ormconfig.ts (root)
@"
import { AppDataSource } from './src/database/data-source';

export default AppDataSource;
"@ | Out-File -FilePath "ormconfig.ts" -Encoding utf8

# .env
@"
# ============================================================
# VanhCorp CRM - Environment Variables
# ============================================================

# App
APP_PORT=3001
APP_ENV=development

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=vanhcorp_crm
DB_LOGGING=true

# JWT
JWT_SECRET=vanhcorp-crm-super-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=vanhcorp-crm-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
"@ | Out-File -FilePath ".env" -Encoding utf8

Write-Host "`n=== DONE! ===" -ForegroundColor Green
Write-Host "Kiem tra bang: tree src /F" -ForegroundColor Yellow
