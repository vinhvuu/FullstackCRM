# Phần 3 — Technical Requirement: Dev 1 (Module IAM)

> **Dev 1** sở hữu module `iam/` — toàn bộ Auth, Users, Invitations, Audit Log, User Preferences.
> **Tổng task: 22.**

---

## Quy ước Response chung (áp dụng cho mọi Dev)

Mọi response đều theo shape:
```json
// Thành công
{ "success": true, "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }

// Lỗi
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid input data", "details": [{ "field": "email", "message": "Email is required" }] } }
```

| Status | Ý nghĩa |
|---|---|
| 200 | OK, có body |
| 201 | Created |
| 204 | No content (xóa thành công) |
| 400 | Bad request (lỗi logic) |
| 401 | Chưa đăng nhập / token hết hạn |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy |
| 409 | Conflict (vd: email đã tồn tại) |
| 422 | Validation fail |
| 500 | Lỗi hệ thống |

Header chuẩn: `Authorization: Bearer <jwt>`, `Content-Type: application/json`.

Pagination: `?page=1&limit=20` (mặc định 20, tối đa 100).

---

## T1.1. POST `/api/auth/register` — Đăng ký

- **Auth:** Public
- **SP:** 2
- **Phụ thuộc:** không

**Request DTO:**
```ts
class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) @MaxLength(72) @Matches(/^(?=.*[A-Z])(?=.*\d).+$/) password: string;
  @IsString() @MinLength(2) @MaxLength(100) name: string;
  @IsOptional() @IsString() @Matches(/^(0|\+84)[0-9]{9,10}$/) phone?: string;
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": 12, "email": "user@vanhcorp.vn", "name": "Nguyễn Văn A", "role": "user", "status": "active" }
}
```

**Response 409:** `{ "success": false, "error": { "code": "EMAIL_EXISTS", "message": "Email đã được sử dụng" } }`

**Response 422:** validation fail (class-validator) trả về `details[]` cho từng field.

**Logic DB/Service:**
- Hash password bằng bcrypt (cost 10).
- Insert `iam_users` với `role='user'`, `status='active'`, `must_change_password=false`.
- KHÔNG tự động gửi email xác nhận (theo brief).
- Gọi `AuditService.log({action:'create', entityType:'user', entityId: <new id>})`.

**Test case tối thiểu:**
- ✅ Tạo user mới với email hợp lệ → 201
- ✅ Email trùng → 409 EMAIL_EXISTS
- ✅ Password < 8 ký tự → 422
- ✅ Email sai định dạng → 422
- ✅ Audit log được tạo

---

## T1.2. POST `/api/auth/login` — Đăng nhập

- **Auth:** Public
- **SP:** 3
- **Phụ thuộc:** T1.1

**Request DTO:**
```ts
class LoginDto { @IsEmail() email: string; @IsString() @MinLength(1) password: string; }
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "expiresIn": 3600,
    "user": { "id": 1, "email": "admin@vanhcorp.vn", "name": "Admin", "role": "admin", "status": "active" }
  }
}
```

**Response 401:** `{ "error": { "code": "INVALID_CREDENTIALS", "message": "Email hoặc mật khẩu không đúng" } }`

**Response 403:** `{ "error": { "code": "ACCOUNT_LOCKED", "message": "Tài khoản đã bị khóa" } }`

**Logic DB/Service:**
- Tìm user theo email (kèm `password_hash`).
- So sánh password hash.
- Tạo access token (TTL 1h, payload `{sub, role, status}`) + refresh token (TTL 7d, random secure string).
- Insert `iam_user_sessions(user_id, refresh_token_hash, expires_at, user_agent, ip)`.
- Update `iam_users.last_login_at = NOW()`.
- Gọi `AuditService.log({action:'login', entityType:'user', entityId})`.

**Test case:**
- ✅ Login đúng → 200 + token
- ✅ Sai password → 401
- ✅ User `status='inactive'` → 403 ACCOUNT_LOCKED
- ✅ Audit log action='login'

---

## T1.3. POST `/api/auth/refresh` — Refresh token

- **Auth:** Public (dùng refresh token)
- **SP:** 2

**Request DTO:**
```ts
class RefreshDto { @IsString() refreshToken: string; }
```

**Response 200:** giống login (rotate refresh token mới, revoke token cũ).

**Response 401:** refresh token hết hạn / không tồn tại / bị thu hồi.

**Logic:** tìm session trong `iam_user_sessions` (refresh_token_hash match + expires_at > NOW + revoked=false). Nếu hợp lệ → revoke session cũ + tạo session mới + trả token mới.

---

## T1.4. POST `/api/auth/logout` — Đăng xuất

- **Auth:** Authenticated
- **SP:** 1

**Request body:** rỗng.

**Response 204.**

**Logic:** lấy user từ JWT → set `iam_user_sessions.revoked=true WHERE user_id = :id AND user_agent = :currentUA`.

---

## T1.5. GET `/api/auth/me` — User hiện tại

- **Auth:** Authenticated
- **SP:** 1

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1, "email": "admin@vanhcorp.vn", "name": "Admin", "role": "admin", "status": "active",
    "avatarUrl": null, "lastLoginAt": "2026-06-15T10:00:00Z",
    "prefs": { "language": "vi", "timezone": "Asia/Ho_Chi_Minh", "density": "comfortable", "emailSignature": "...", "notify": { ... } }
  }
}
```

**Logic:** join `iam_users` + `iam_user_prefs` theo `user_id`. Trả về thông tin cá nhân + prefs mặc định nếu chưa có.

---

## T1.6. POST `/api/auth/forgot-password` — Quên mật khẩu

- **Auth:** Public
- **SP:** 2

**Request DTO:**
```ts
class ForgotPasswordDto { @IsEmail() email: string; }
```

**Response 200:** luôn trả 200 với message chung chung (chống email enumeration):
```json
{ "success": true, "data": { "message": "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi" } }
```

**Logic:**
- Nếu email tồn tại: tạo token random (32 bytes, base64url) lưu `iam_password_resets(user_id, token_hash, expires_at = NOW() + 30 min, used=false)`.
- Stub gửi email (ghi log console — chưa cần SMTP thật).
- Audit log `action='forgot_password', entityType='user', entityId=<user.id>`.

---

## T1.7. POST `/api/auth/reset-password` — Đặt lại mật khẩu

- **Auth:** Public
- **SP:** 2

**Request DTO:**
```ts
class ResetPasswordDto {
  @IsString() token: string;
  @IsString() @MinLength(8) @MaxLength(72) @Matches(/^(?=.*[A-Z])(?=.*\d).+$/) newPassword: string;
}
```

**Response 200:** `{ "success": true, "data": { "message": "Đặt lại mật khẩu thành công" } }`

**Response 400:** `{ "error": { "code": "INVALID_TOKEN", "message": "Token không hợp lệ hoặc đã hết hạn" } }`

**Logic:** tìm `iam_password_resets` theo token_hash + `used=false` + `expires_at > NOW`. Nếu hợp lệ → update `iam_users.password_hash` + set `used=true, used_at=NOW`. Revoke tất cả session của user.

---

## T1.8. GET `/api/users` — Danh sách user (Admin)

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 3
- **Phụ thuộc:** Service export của CRM Core (`CrmLeadService.countByOwner`) và Sales (`SalesDealService.countOpenByOwner`)

**Query:** `?page=1&limit=20&role=admin|user&status=active|inactive|invited&search=...`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1, "email": "admin@vanhcorp.vn", "name": "Admin", "role": "admin", "status": "active",
      "avatarUrl": null, "lastLoginAt": "2026-06-15T10:00:00Z", "createdAt": "2026-01-01T00:00:00Z",
      "leadCount": 12, "openDealCount": 5
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 8, "totalPages": 1 }
}
```

**Logic DB/Service:**
- Query chính: `iam_users` (filter role/status/search theo `name` hoặc `email` LIKE %search%).
- Inject `CrmLeadService` để lấy `leadCount` map theo `ownerId`.
- Inject `SalesDealService` để lấy `openDealCount` map theo `ownerId`.
- **GHI CHÚ QUAN TRỌNG:** nếu service bên CRM Core hoặc Sales **chưa có method aggregate** cần thiết, Dev 1 mở ticket yêu cầu Owner bổ sung (xem Phần 4 — Service Contract). KHÔNG tự ý inject repository của module khác.

---

## T1.9. GET `/api/users/:id` — Chi tiết user

- **Auth:** Authenticated, **Role:** admin HOẶC chính user đó
- **SP:** 1

**Response 200:** user object (giống data trong list, kèm `createdAt`, `updatedAt`).

**Response 404:** `{ "error": { "code": "USER_NOT_FOUND" } }`

**Response 403:** Staff cố xem user khác.

---

## T1.10. POST `/api/users` — Tạo user (Admin)

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 2

**Request DTO:**
```ts
class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(2) @MaxLength(100) name: string;
  @IsOptional() @IsString() phone?: string;
  @IsString() @MinLength(8) @MaxLength(72) password: string;
  @IsIn(['admin','user']) role: 'admin' | 'user';
  @IsOptional() @IsBoolean() mustChangePassword?: boolean;
}
```

**Response 201:** user vừa tạo.
**Response 409:** `code: EMAIL_EXISTS`.

**Logic:** hash password, insert `iam_users`. Audit log `action='create', entityType='user'`.

---

## T1.11. PUT `/api/users/:id` — Cập nhật user

- **Auth:** Authenticated, **Role:** admin HOẶC chính user đó
- **SP:** 2

**Request DTO (admin):**
```ts
class AdminUpdateUserDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsIn(['admin','user']) role?: 'admin' | 'user';
  @IsOptional() @IsIn(['active','inactive','invited']) status?: 'active' | 'inactive' | 'invited';
}
```

**Request DTO (self):** chỉ cho phép `name`, `phone`, `avatarUrl` — validate ở service.

**Response 200:** user sau khi update.
**Response 403:** Staff cố update user khác (trừ field hợp lệ).
**Response 409:** `code: EMAIL_EXISTS` (nếu FE gửi email — thực tế nên cấm đổi email ở endpoint này).

**Logic:** nếu admin đổi role/status → audit log. Nếu đổi status='inactive' → revoke tất cả session.

---

## T1.12. DELETE `/api/users/:id` — Xóa (soft) user

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 1

**Response 204.**
**Response 404:** user không tồn tại.
**Response 409:** `code: USER_HAS_DATA` — khi user còn:
- Lead active (`crm_leads` chưa soft delete, `owner_id = :id`)
- Deal open (`sales_deals.status='open'`, `owner_id = :id`)
- Activity pending

→ Phải reassign trước khi xóa.

**Logic:** set `deleted_at = NOW()` + `status='deleted'`. Revoke toàn bộ session.

---

## T1.13. POST `/api/users/:id/reset-password` (Admin)

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 1

**Request DTO:** `{ "newPassword": "Password@123" }`

**Response 204.**
**Audit log:** `action='reset_password', entityType='user', entityId=<id>`.

---

## T1.14. POST `/api/users/:id/lock` — Khóa tài khoản

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 1

**Response 200:** user với `status='inactive'`.

**Logic:** set `status='inactive'` + revoke tất cả session + audit log `action='lock'`.

---

## T1.15. POST `/api/users/:id/unlock` — Mở khóa

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 1

**Response 200:** user với `status='active'`.
**Audit log:** `action='unlock'`.

---

## T1.16. POST `/api/invitations` — Mời user hàng loạt

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 2

**Request DTO:**
```ts
class CreateInvitationsDto {
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(50) @IsEmail({}, { each: true }) emails: string[];
  @IsIn(['admin','user']) role: 'admin' | 'user';
  @IsInt() @Min(1) @Max(720) ttlHours: number;
}
```

**Response 201:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "email": "a@x.com", "role": "user", "status": "pending", "expiresAt": "2026-06-18T10:00:00Z", "createdAt": "2026-06-16T10:00:00Z" }
  ]
}
```

**Logic:** với mỗi email chưa tồn tại trong `iam_users`, insert `iam_invitations(email, role, token, expires_at, status='pending', invited_by)`. Tạo token ngẫu nhiên (32 bytes base64url). Stub gửi email (log).

---

## T1.17. GET `/api/invitations` — Danh sách invitation

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 1

**Query:** `?status=pending|accepted|expired|revoked&page=1&limit=20`

**Response 200:** mảng invitation + meta.

---

## T1.18. POST `/api/invitations/:id/revoke` — Thu hồi invitation

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 1

**Response 200:** invitation với `status='revoked'`.

---

## T1.19. POST `/api/invitations/accept` — Chấp nhận lời mời

- **Auth:** Public
- **SP:** 3

**Request DTO:**
```ts
class AcceptInvitationDto {
  @IsString() token: string;
  @IsString() @MinLength(2) @MaxLength(100) name: string;
  @IsString() @MinLength(8) @MaxLength(72) @Matches(/^(?=.*[A-Z])(?=.*\d).+$/) password: string;
}
```

**Response 200:** user mới + access token + refresh token (giống login).
**Response 400:** `code: INVALID_TOKEN`.

**Logic:**
- Tìm `iam_invitations` theo token + `status='pending'` + `expires_at > NOW`.
- Tạo user mới với role theo invitation.
- Set invitation `status='accepted', accepted_at=NOW`.
- Auto-login (trả về token luôn).

---

## T1.20. GET `/api/audit-logs` — Nhật ký (Admin)

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 3

**Query:** `?page=1&limit=10&userId=...&action=create|update|delete|assign|convert|auto_assign|login|reset_password|lock|unlock&entityType=lead|deal|contact|user|distribution_rule|tag&from=2026-06-01&to=2026-06-30&q=...`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1, "userName": "Admin",
      "action": "create",
      "entityType": "lead", "entityId": 123,
      "details": { "before": null, "after": { "name": "Lead ABC" } },
      "ipAddress": "10.0.0.1",
      "userAgent": "Mozilla/5.0 ...",
      "createdAt": "2026-06-15T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 234, "totalPages": 24 }
}
```

**Logic DB/Service:**
- Filter động theo query.
- Sort `created_at DESC`.
- Index đã tạo: `(user_id, created_at)`, `(entity_type, entity_id)`, `action`.
- `q` (search) match trên `user_name`, `action`, `entity_type`, `details` (CAST JSON).

---

## T1.21. GET `/api/audit-logs/export` — Export CSV

- **Auth:** Authenticated, **Role:** `admin`
- **SP:** 2

**Query:** giống list, KHÔNG phân trang (lấy toàn bộ).

**Response 200:**
- Header: `Content-Type: text/csv; charset=utf-8`
- Header: `Content-Disposition: attachment; filename="audit-logs-2026-06-16.csv"`
- Body: CSV có BOM `\uFEFF`, cột: `id, createdAt, userName, action, entityType, entityId, ipAddress, details`.

---

## T1.22. GET `/api/users/me/prefs` & PUT `/api/users/me/prefs` — User preferences

- **Auth:** Authenticated (chính mình)
- **SP:** 1 + 1

**Response 200 (GET):**
```json
{
  "success": true,
  "data": {
    "language": "vi",
    "timezone": "Asia/Ho_Chi_Minh",
    "density": "comfortable",
    "emailSignature": "Trân trọng,\nNguyễn Văn A",
    "notify": {
      "emailEnabled": true, "pushEnabled": true, "dailySummary": false, "aiInsights": true,
      "mention": true, "assignment": true, "reminder": true, "dealStage": true, "quoteAccepted": true
    }
  }
}
```

**Request DTO (PUT):**
```ts
class UpdateUserPrefsDto {
  @IsOptional() @IsIn(['vi','en']) language?: 'vi' | 'en';
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsIn(['compact','comfortable']) density?: 'compact' | 'comfortable';
  @IsOptional() @IsString() @MaxLength(2000) emailSignature?: string;
  @IsOptional() notify?: Record<string, boolean>;
}
```

**Logic:** upsert vào `iam_user_prefs(user_id, language, timezone, density, email_signature, notify_json)`. Nếu chưa có → tạo mới với default.

---

## Export contract (Interface) mà Dev 1 CẦN expose cho các Dev khác

Đặt tại `src/modules/iam/interfaces/`:

```ts
// IamUserService — dùng cho mọi module khác cần validate / load user
export const IAM_USER_SERVICE = Symbol('IAM_USER_SERVICE');
export interface IIamUserService {
  findById(id: number): Promise<AuthUserDto | null>;
  findByIds(ids: number[]): Promise<AuthUserDto[]>;
  findByEmail(email: string): Promise<AuthUserDto | null>;
  isActive(id: number): Promise<boolean>;
  countByStatus(status: UserStatus): Promise<number>;
  countActiveUsers(): Promise<number>;
}

// AuditService — dùng cho mọi module khác cần ghi log
export const AUDIT_SERVICE = Symbol('AUDIT_SERVICE');
export interface IAuditService {
  log(input: {
    userId: number | null;
    userName: string | null;
    action: string;
    entityType: string;
    entityId: number | null;
    details?: { before?: any; after?: any; meta?: any };
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
}
```

Cả hai service này được export trong `IamModule` (xem Phần 4).
