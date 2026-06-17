# Phụ lục — Quy ước chung cho cả 4 Dev

> File này là "luật chơi" mà cả 4 Dev bắt buộc tuân theo. Khi có thay đổi, Tech Lead cập nhật và thông báo trong nhóm.

---

## A. Quy ước Response & Status Code

### A.1. Response shape

**Mọi response** (kể cả lỗi) đều theo shape chuẩn:

```ts
// Thành công
{
  success: true,
  data: { ... },
  meta?: { page, limit, total, totalPages }   // optional, chỉ với list
}

// Lỗi
{
  success: false,
  error: {
    code: string,           // mã lỗi SCREAMING_SNAKE_CASE
    message: string,        // message tiếng Việt (FE có thể hiển thị trực tiếp)
    details?: [{ field: string; message: string }]   // chỉ với validation 422
  }
}
```

### A.2. HTTP Status Code

| Code | Ý nghĩa | Dùng khi |
|---|---|---|
| 200 | OK | Thành công, có body |
| 201 | Created | Tạo mới thành công |
| 204 | No Content | Xóa / update không cần response body |
| 400 | Bad Request | Lỗi logic nghiệp vụ (vd: chuyển stage không hợp lệ) |
| 401 | Unauthorized | Chưa đăng nhập / token hết hạn |
| 403 | Forbidden | Không đủ quyền (vd: Staff gọi API admin) |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Trùng lặp (email, code, foreign key) |
| 422 | Unprocessable Entity | Validation fail (class-validator) |
| 500 | Internal Server Error | Lỗi hệ thống không mong đợi |

### A.3. Mã lỗi (Error Code) chuẩn

Đặt tại `src/common/constants/error-codes.ts`:

```ts
export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // User
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_HAS_DATA: 'USER_HAS_DATA',
  
  // Lead
  LEAD_NOT_FOUND: 'LEAD_NOT_FOUND',
  LEAD_EMAIL_EXISTS: 'LEAD_EMAIL_EXISTS',
  
  // Contact
  CONTACT_NOT_FOUND: 'CONTACT_NOT_FOUND',
  CONTACT_EMAIL_EXISTS: 'CONTACT_EMAIL_EXISTS',
  
  // Company
  COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
  COMPANY_NAME_EXISTS: 'COMPANY_NAME_EXISTS',
  
  // Deal
  DEAL_NOT_FOUND: 'DEAL_NOT_FOUND',
  INVALID_STAGE_TRANSITION: 'INVALID_STAGE_TRANSITION',
  DEAL_ALREADY_CLOSED: 'DEAL_ALREADY_CLOSED',
  
  // Quote
  QUOTE_NOT_FOUND: 'QUOTE_NOT_FOUND',
  QUOTE_NOT_EDITABLE: 'QUOTE_NOT_EDITABLE',
  
  // Product
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_CODE_EXISTS: 'PRODUCT_CODE_EXISTS',
  
  // Generic
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
```

---

## B. Quy ước Header & Auth

### B.1. Request header chuẩn

```
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
Accept-Language: vi|en
```

### B.2. JWT Payload

```ts
interface JwtPayload {
  sub: number;        // user id
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'invited' | 'deleted';
  iat: number;        // issued at
  exp: number;        // expiry
}
```

### B.3. Decorator `@CurrentUser()`

```ts
// src/common/decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;  // do JwtGuard gắn vào
});
```

### B.4. Decorator `@Roles()`

```ts
@Roles('admin')
@UseGuards(JwtGuard, RolesGuard)
@Get('admin/users')
async listUsers() {}
```

### B.5. Public route

```ts
@Public()
@Post('auth/login')
async login() {}
```

---

## C. Quy ước phân trang

### C.1. Query params

```
?page=1           # mặc định 1
?limit=20         # mặc định 20, tối đa 100
```

### C.2. Response meta

```json
{
  "success": true,
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

### C.3. Sort

```
?sortBy=createdAt
?sortDir=desc
```

Whitelist field sort ở service để chống SQL injection.

---

## D. Quy ước Date & Currency

- **Timezone:** `Asia/Ho_Chi_Minh` (UTC+7) cho mọi tính toán ngày.
- **Date format gửi/nhận:** ISO 8601 (`2026-06-16T10:00:00Z` hoặc `2026-06-16` cho DATE).
- **Dayjs config:** cài `dayjs/plugin/timezone`, `dayjs/plugin/utc`. Set default timezone = `Asia/Ho_Chi_Minh`.
- **Currency:** VND (mặc định) và USD. Format tiền tệ `vi-VN` locale (FE xử lý hiển thị, BE chỉ trả số nguyên/decimal).
- **DECIMAL columns** dùng `DECIMAL(18, 2)` cho value tiền tệ.

---

## E. Quy ước Validation

### E.1. DTO với class-validator

```ts
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsInt, IsIn, IsArray, IsBoolean, IsDateString, IsNumber, Min, Max, Matches, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeadDto {
  @IsString() @MinLength(2) @MaxLength(150)
  name: string;

  @IsOptional() @IsEmail()
  email?: string;

  // ...
}
```

### E.2. Global ValidationPipe

Đặt trong `main.ts` (Tech Lead cấu hình):

```ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  exceptionFactory: (errors) => {
    return new UnprocessableEntityException({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors.flatMap(e => Object.values(e.constraints || {}).map(m => ({ field: e.property, message: m }))),
      },
    });
  },
}));
```

---

## F. Quy ước File Upload

- **Storage:** local disk `uploads/<yyyy>/<mm>/<uuid>.<ext>`.
- **URL trả về:** `/api/attachments/:id/download` (qua API download, không trả đường dẫn trực tiếp).
- **Max size:** 10MB (mặc định).
- **MIME allow:** `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `image/png`, `image/jpeg`, `text/plain`.
- **Validate trong service:** check MIME + extension match.

---

## G. Quy ước Audit Log

- **Service:** `AuditService` của IAM (Dev 1).
- **Khi nào ghi:**
  - CREATE / UPDATE / DELETE trên entity chính (lead, contact, company, deal, product, quote, user, tag, rule).
  - Action đặc biệt: `assign`, `convert`, `auto_assign`, `won`, `lost`, `lock`, `unlock`, `reset_password`, `login`, `forgot_password`.
- **Capture:** `details.before` và `details.after` (chỉ những field thay đổi).
- **IP & User Agent:** lấy từ request qua `Request` của Express.
- **KHÔNG ghi** cho action read/list/search.

```ts
await this.auditService.log({
  userId: currentUser.id,
  userName: currentUser.name,
  action: 'update',
  entityType: 'lead',
  entityId: lead.id,
  details: { before: beforeSnapshot, after: afterSnapshot },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

---

## H. Quy ước Notification

- **Service:** `PlatformNotificationService` của Dev 4.
- **Khi nào gửi:**
  - Lead mới (notify admin) — `CrmLeadService.create` → gọi.
  - Lead được assign (notify owner) — `CrmLeadService.assign` / Distribution → gọi.
  - Note có mention user (notify mentioned users) — `CrmTimelineService.add` → gọi.
  - Reminder đến hạn (notify owner) — cron job (Dev 4) → gọi.
  - Deal stage change (notify owner + watchers) — `SalesDealService.changeStage` → gọi.
  - Quote accepted/rejected (notify owner) — `SalesQuoteService.accept/reject` → gọi.
- **Best effort:** notification fail KHÔNG rollback transaction chính. Log lỗi console.

---

## I. Quy ước Test

### I.1. Unit Test (Jest)

- Mỗi service phải có file `*.service.spec.ts`.
- Test các method public với: happy path, edge case, error case.
- Mock tất cả dependency (repo + cross-module service) bằng `@nestjs/testing`.
- Coverage mục tiêu: ≥ 80% cho mỗi service.

### I.2. Integration Test (Supertest)

- Mỗi controller có `*.controller.spec.ts` test qua HTTP.
- Setup `Test.createTestingModule({ imports: [AppModule] })` với SQLite in-memory.
- Test 1 happy case + 1 error case cho mỗi endpoint.

### I.3. E2E Test (optional, sprint sau)

- Test flow nghiệp vụ: login → tạo lead → convert → thấy deal.

---

## J. Quy ước Logging

```ts
// src/common/utils/logger.ts — dùng nestjs Logger
import { Logger } from '@nestjs/common';

private readonly logger = new Logger(LeadsService.name);

this.logger.log('Lead created', { leadId, ownerId });
this.logger.warn('Failed to assign lead', { leadId, reason });
this.logger.error('Unexpected error', { stack });
```

Format log:
- `info`: nghiệp vụ thành công.
- `warn`: nghiệp vụ fail có kiểm soát (validation, not found).
- `error`: exception không mong đợi.
- `debug`: thông tin debug, tắt ở production.

KHÔNG log password, token, refresh token, email body nhạy cảm.

---

## K. Quy ước Error Handling toàn cục

```ts
// src/common/filters/http-exception.filter.ts (Tech Lead tạo sẵn)
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: any = { success: false, error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống' } };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      // Nếu đã là format chuẩn → giữ nguyên
      if (typeof res === 'object' && res !== null && 'success' in res) {
        body = res;
      } else {
        body = {
          success: false,
          error: { code: 'HTTP_' + status, message: typeof res === 'string' ? res : (res as any).message },
        };
      }
    }

    response.status(status).json(body);
  }
}
```

---

## L. Quy ước Git & Commit

### L.1. Branch naming

```
feat/iam-T1.1-register
feat/crm-core-T2.1-create-lead
fix/iam-T1.2-login-bcrypt
chore/common-jwt-guard
```

### L.2. Commit message (Conventional Commits)

```
feat(iam): add register endpoint
fix(crm-core): handle lead email conflict
chore(common): add global validation pipe
docs(detail): add API contract for leads
```

### L.3. Không commit
- `node_modules/`, `.env`, `dist/`, `*.db`, `uploads/`
- Thông tin nhạy cảm (password, secret, token)
- Code chưa qua test

---

## M. Checklist mở đầu Sprint (Tech Lead)

Trước khi 4 Dev bắt đầu code, Tech Lead phải:

- [ ] Tạo skeleton `server/` với NestJS, TypeORM, package.json, tsconfig.
- [ ] Cấu hình `database/data-source.ts` (MySQL).
- [ ] Tạo các file trong `common/` (decorators, guards, interceptors, filters, pipes, dto, constants, utils).
- [ ] Tạo 4 module rỗng với `module.ts` + `controller.ts` rỗng + import vào `app.module.ts`.
- [ ] Tạo 1 file `seed/admin.ts` seed admin mặc định.
- [ ] Cấu hình ESLint, Prettier, Jest.
- [ ] Tạo CI workflow (GitHub Actions) chạy `lint + test + build` cho mỗi PR.
- [ ] Review file này + 4 file Phần 3 với cả team, chốt interface.

---

## N. Mapping Task → Sprint đề xuất

| Sprint | Tuần | Phạm vi | Output |
|---|---|---|---|
| **S1** | Tuần 1-2 | T1.1–T1.7 (auth), skeleton, common, MySQL config, seed | Login/Register chạy được |
| **S2** | Tuần 3-4 | T1.8–T1.22 (user mgmt), T2.1–T2.12 (leads), T2.13–T2.22 (contacts/companies) | CRUD lead/contact/company + user admin |
| **S3** | Tuần 5-6 | T2.23–T2.48 (tags/sources/activities/timeline/attachments/email-templates/distribution), T3.1–T3.14 (deals/pipelines/convert) | FE phần CRM Core + bắt đầu Sales |
| **S4** | Tuần 7-8 | T3.15–T3.34 (line items/products/quotes/loss reasons), T4.1–T4.20 (notifications/saved-views/custom-fields/reports) | Sales hoàn chỉnh + Platform bắt đầu |
| **S5** | Tuần 9-10 | T4.21–T4.40 (goals/dashboard/forecast/settings/search/import-export/admin overview) | Toàn bộ Platform |
| **S6** | Tuần 11-12 | E2E test, performance, deploy, fix bug | Production-ready |

Mỗi Sprint có Daily standup 15 phút + Review cuối tuần.
