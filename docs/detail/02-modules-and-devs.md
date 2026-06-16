# Phần 2 — Phân chia Module độc lập cho 4 Dev

## 2.1. Cấu trúc NestJS Modular Monolith

```
server/
├── src/
│   ├── main.ts
│   ├── app.module.ts                  ← import 4 feature module
│   ├── common/                        ← CHUNG, dùng cho cả 4 dev
│   │   ├── decorators/                # @CurrentUser, @Roles, @Public
│   │   ├── guards/                    # JwtGuard, RolesGuard
│   │   ├── interceptors/              # ResponseInterceptor (format chuẩn)
│   │   ├── filters/                   # HttpExceptionFilter (error shape)
│   │   ├── pipes/                     # ValidationPipe global
│   │   ├── dto/                       # PaginationDto, IdParamDto
│   │   ├── constants/                 # PAGINATION, ERROR_CODES
│   │   └── utils/                     # hash, jwt, date (vi-VN)
│   ├── database/
│   │   ├── data-source.ts             ← TypeORM DataSource duy nhất
│   │   └── seeds/                     ← seed do mỗi module tự định nghĩa
│   └── modules/
│       ├── iam/                       ← DEV 1
│       │   ├── iam.module.ts
│       │   ├── auth/                  # login, register, refresh, logout, me
│       │   ├── users/                 # CRUD user
│       │   ├── invitations/           # mời user
│       │   ├── audit/                 # audit log
│       │   ├── prefs/                 # user preferences
│       │   ├── interfaces/            # IamUserService (export contract)
│       │   └── database/
│       │       ├── entities/
│       │       ├── migrations/
│       │       └── seeds/
│       │
│       ├── crm-core/                  ← DEV 2
│       │   ├── crm-core.module.ts
│       │   ├── leads/                 # CRUD + kanban + filters
│       │   ├── contacts/              # CRUD
│       │   ├── companies/             # CRUD
│       │   ├── tags/                  # CRUD tag
│       │   ├── lead-sources/          # CRUD nguồn lead
│       │   ├── reminders/             # reminders trên lead
│       │   ├── activities/            # CRUD + recurrence
│       │   ├── timeline/              # timeline + notes + mentions
│       │   ├── attachments/           # file đính kèm (polymorphic)
│       │   ├── email-templates/       # mẫu email
│       │   ├── distribution/          # rules + pool + assign
│       │   ├── interfaces/            # CrmLeadService, CrmContactService, ...
│       │   └── database/...
│       │
│       ├── sales/                     ← DEV 3
│       │   ├── sales.module.ts
│       │   ├── deals/                 # CRUD + kanban
│       │   ├── pipelines/             # pipeline + stage
│       │   ├── line-items/            # line item trong deal
│       │   ├── products/              # catalog
│       │   ├── quotes/                # báo giá + line item
│       │   ├── loss-reasons/          # lý do thua
│       │   ├── convert/               # convert lead → deal (inject CrmLeadService)
│       │   ├── interfaces/            # SalesDealService, SalesProductService
│       │   └── database/...
│       │
│       └── platform/                  ← DEV 4
│           ├── platform.module.ts
│           ├── notifications/         # in-app + prefs
│           ├── saved-views/           # saved view
│           ├── custom-fields/         # custom field def + value
│           ├── reports/               # report def + run
│           ├── goals/                 # mục tiêu
│           ├── dashboard/             # layout widget
│           ├── forecast/              # forecast bucket
│           ├── system-settings/       # general, sla
│           ├── search/                # global search
│           ├── import-export/         # CSV import + export
│           ├── interfaces/            # PlatformNotificationService
│           └── database/...
│
├── package.json
├── tsconfig.json
├── nest-cli.json
├── ormconfig.ts                       ← TypeORM data source cho CLI
└── .env
```

---

## 2.2. Bảng phân công Module

| Dev | Module chính | Màn hình FE phụ trách | Số task BE |
|---|---|---|---:|
| **Dev 1** | `iam` (Auth & User) | `/login`, `/register`, `/settings` (Profile/Noti/Password/Lang/Email Templates), `/settings/team`, phần "users" của `/admin` | **22** |
| **Dev 2** | `crm-core` (Lead/Contact/Company/Activity/Timeline/Communication/Distribution) | `/leads`, `/leads/[id]`, `/contacts`, `/contacts/[id]`, `/companies`, `/companies/[id]`, `/activities`, `/admin/leads` (chia lead) | **38** |
| **Dev 3** | `sales` (Deals/Products/Quotes/Pipelines) | `/deals`, `/deals/[id]`, `/products`, `/quotes`, `/quotes/[id]`, phần convert lead trong `/leads/[id]` | **28** |
| **Dev 4** | `platform` (Noti/Report/Goal/Settings/Custom/Saved/Import/Search/Dashboard) | `/` (dashboard), `/reports`, `/reports/builder`, `/goals`, `/import`, `/admin` (overview), `/admin/audit`, `/admin/settings` (general/sla), Command Palette, Notification Bell | **32** |
| **Tổng** | | | **120** |

---

## 2.3. Quy tắc đảm bảo KHÔNG xung đột Git

### 2.3.1. Vùng làm việc trên Git

Mỗi Dev chỉ được `git add` file trong thư mục của mình:

```
Dev 1  →  src/modules/iam/**
Dev 2  →  src/modules/crm-core/**
Dev 3  →  src/modules/sales/**
Dev 4  →  src/modules/platform/**
```

### 2.3.2. Vùng CHUNG (cấm tự ý commit)

Các file/folder chung — do **Tech Lead** maintain, mọi sửa đổi cần **Pull Request review cả 4 dev** trong nhóm:

- `src/main.ts`
- `src/app.module.ts`
- `src/common/**`
- `src/database/data-source.ts`
- `package.json`, `package-lock.json`
- `tsconfig.json`, `nest-cli.json`, `ormconfig.ts`
- `.env.example`
- `README.md` (gốc)

### 2.3.3. Branch & PR Strategy

- **Branch per task:** `feat/iam-T1.1-register`, `feat/crm-core-T2.1-create-lead`, ...
- **Base branch:** `develop`.
- **Mỗi PR phải:**
  - Có unit test (Jest) cho service của task đó (`*.service.spec.ts`).
  - Có DTO + Validation (class-validator) — không tin tưởng FE gửi đúng.
  - Response shape đúng theo API Contract ở Phần 3.
  - Không vượt quá **500 LOC diff** (split nhỏ nếu hơn).
- **Review chéo:** Dev A review PR của Dev B (xoay vòng).
- **Conflict resolution:** nếu 2 PR cùng đụng `app.module.ts`, người merge sau phải **rebase** và giải quyết conflict. Tech Lead quyết định nếu không thống nhất.

### 2.3.4. Quy tắc vàng

1. ❌ **Không sửa entity của module khác** dù trong cùng 1 PR. Mở ticket riêng cho Owner.
2. ❌ **Không truy cập trực tiếp repository** của module khác. Phải inject service của họ.
3. ✅ **Có thể thêm route vào controller của mình** dù route đó phục vụ FE chung (vd: `GET /api/dashboard/stats` của Dev 4).
4. ✅ **Có thể thêm mới file export vào `interfaces/`** của module mình để chốt Service Contract với module khác.
5. ✅ **Khi cần method mới từ module khác:** gửi yêu cầu qua task board; Owner có trách nhiệm bổ sung vào service của mình.

---

## 2.4. Tech stack quy định cho cả 4 Dev

| Layer | Lựa chọn bắt buộc |
|---|---|
| Framework | NestJS 10.x (Express adapter) |
| ORM | TypeORM 0.3.x |
| Validation | class-validator + class-transformer |
| Auth | @nestjs/jwt + @nestjs/passport (passport-jwt) |
| Password hashing | bcrypt (cost factor 10) |
| File upload | @nestjs/platform-express + multer (memory) → ghi local disk `/uploads` |
| CSV | papaparse |
| Date | dayjs + dayjs/plugin/timezone + timezone `Asia/Ho_Chi_Minh` |
| Locale | vi-VN (i18n không cần, FE đã xử lý) |
| Test | Jest (mặc định NestJS) + Supertest cho e2e |
| Lint | ESLint + Prettier (config chung từ Tech Lead) |
| Process manager | PM2 (production) |

---

## 2.5. Lệnh chuẩn cho cả team

```bash
# Lần đầu
npm install

# Dev
npm run start:dev          # watch mode

# Migration
npm run migration:run      # chạy tất cả module theo thứ tự
npm run migration:revert   # revert migration cuối

# Seed (chỉ môi trường dev)
npm run seed:dev

# Test
npm run test               # unit
npm run test:e2e           # e2e
npm run test:cov

# Lint
npm run lint
npm run format
```

Các script trên sẽ do **Tech Lead** cấu hình sẵn trong `package.json` (file chung).

---

## 2.6. Definition of Done cho mỗi task

Một task BE được coi là hoàn thành khi:

- [ ] Entity & migration chạy thành công
- [ ] Repository có method CRUD cần thiết
- [ ] Service có business logic + validation nghiệp vụ
- [ ] Controller có đầy đủ endpoint, DTO, response shape đúng contract
- [ ] Unit test ≥ 80% coverage cho service
- [ ] Integration test 1 happy case + 1 error case cho mỗi endpoint
- [ ] Audit log được ghi (nếu task thuộc nhóm có audit)
- [ ] Notification được gửi (nếu task thuộc nhóm có notify)
- [ ] Curl/Postman test thành công ở local
- [ ] PR được ít nhất 1 dev khác review & approve
