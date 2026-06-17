# Phần 4 — Các điểm giao thoa giữa các Module & Hợp đồng Service

> **Mục tiêu:** Mô tả chính xác service nào gọi service nào, theo cơ chế DI của NestJS.
> **Quy tắc:** Module A **KHÔNG ĐƯỢC** inject `Repository` của Module B. Chỉ inject **Service** đã được Module B export.

---

## 4.1. Bản đồ giao thoa tổng thể

```
                    ┌─────────────────────┐
                    │   IAM (Dev 1)       │
                    │  - UserService      │◄────────┐
                    │  - AuditService     │         │
                    └─────────────────────┘         │
                            ▲                       │
                            │                       │
       ┌────────────────────┼───────────────────────┼──────────────┐
       │                    │                       │              │
       │                    │                       │              │
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ CRM Core (Dev 2)    │  │ Sales (Dev 3)       │  │ Platform (Dev 4)    │
│ - CrmLeadService    │  │ - SalesDealService  │  │ - NotificationSvc   │
│ - CrmContactService │  │ - SalesProductSvc   │  │ - SavedViewService  │
│ - CrmCompanyService │  │ - SalesQuoteService │  │ - CustomFieldSvc    │
│ - CrmActivitySvc    │  │                     │  │ - SearchService     │
│ - CrmTimelineSvc    │  │                     │  │ - ReportService     │
│ - CrmAttachmentSvc  │  │                     │  │ - GoalService       │
│ - CrmTagService     │  │                     │  │ - SystemSettingSvc  │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
       ▲                       ▲                       ▲
       │                       │                       │
       └────────────┬──────────┴───────────┬───────────┘
                    │                      │
                    ▼                      ▼
            Sales gọi CRM Core      Platform gọi CRM Core + Sales
            (convert lead→deal)     (report, forecast, search)
```

---

## 4.2. Ma trận "Service nào gọi Service nào"

| Caller (Module) | → | Callee (Service của Module khác) | Lý do |
|---|---|---|---|
| **CRM Core** (Dev 2) | → | `IamUserService.findById`, `IamUserService.countByStatus` | Validate owner khi CRUD lead/contact/company; check user active khi assign lead |
| **CRM Core** | → | `PlatformNotificationService` | Gửi notify khi: lead mới, mention note, assignment, reminder |
| **CRM Core** | → | `PlatformSavedViewService` | Áp dụng view đã lưu khi list lead |
| **CRM Core** | → | `PlatformCustomFieldService` | Validate + lưu custom field khi CRUD lead/contact/company |
| **CRM Core** | → | `AuditService` | Ghi log create/update/delete trên mọi entity CRM |
| **Sales** (Dev 3) | → | `IamUserService.findById` | Validate owner deal |
| **Sales** | → | `CrmLeadService` | `convertToContact`, `markQualified` khi convert lead |
| **Sales** | → | `CrmContactService` | Validate contact khi tạo deal/quote |
| **Sales** | → | `CrmCompanyService` | Validate company khi tạo deal/quote |
| **Sales** | → | `CrmActivityService` | Tạo activity khi send quote, won/lost deal |
| **Sales** | → | `CrmTimelineService` | Ghi timeline khi đổi stage deal, mark won/lost |
| **Sales** | → | `CrmAttachmentService` | Upload file đính kèm trong deal/quote |
| **Sales** | → | `CrmEmailTemplateService` | Load template khi gửi quote qua email |
| **Sales** | → | `PlatformNotificationService` | Notify khi deal stage change, quote accepted |
| **Sales** | → | `PlatformCustomFieldService` | Validate + lưu custom field cho deal/quote |
| **Sales** | → | `AuditService` | Ghi log create/update/delete deal/quote |
| **Platform** (Dev 4) | → | `IamUserService` | Aggregate lead/deal theo user, count active users, performance |
| **Platform** | → | `CrmLeadService` | Aggregate lead (count, by status, by source, search) |
| **Platform** | → | `CrmContactService` | Search contact cho Command Palette |
| **Platform** | → | `CrmCompanyService` | Search company, open deal value |
| **Platform** | → | `CrmActivityService` | Aggregate activity (pending, by stage) cho report |
| **Platform** | → | `CrmTagService`, `CrmLeadSourceService` | Đọc tag/source cho filter |
| **Platform** | → | `SalesDealService` | Aggregate deal (revenue, win rate, weighted, forecast) |
| **Platform** | → | `SalesProductService` | Search product cho Command Palette |
| **Platform** | → | `AuditService` | Đọc audit log cho `/admin/overview` |
| **IAM** (Dev 1) | → | `CrmLeadService.countByOwner` | `leadCount` trong user list |
| **IAM** | → | `SalesDealService.countOpenByOwner` | `openDealCount` trong user list |

---

## 4.3. Hợp đồng Service (Service Contract) — Code skeleton

### 4.3.1. Module IAM — `IamModule` export

```ts
// server/src/modules/iam/iam.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([IamUser, IamUserSession, IamUserPref, IamInvitation, IamAuditLog, IamPasswordReset])],
  controllers: [AuthController, UsersController, InvitationsController, AuditController, UserPrefsController],
  providers: [
    AuthService, UsersService, InvitationsService, AuditService, UserPrefsService,
    IamUserServiceImpl,  // implement IIamUserService
    { provide: IAM_USER_SERVICE, useExisting: IamUserServiceImpl },
    { provide: AUDIT_SERVICE, useExisting: AuditService },
  ],
  exports: [IAM_USER_SERVICE, AUDIT_SERVICE, IamUserServiceImpl],  // <-- EXPORT
})
export class IamModule {}
```

### 4.3.2. Module CRM Core — `CrmCoreModule` export

```ts
// server/src/modules/crm-core/crm-core.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CrmLead, CrmContact, CrmCompany, CrmTag, CrmLeadTag, CrmLeadReminder, CrmLeadAssignment,
      CrmDistributionRule, CrmPoolConfig, CrmLeadSource, CrmActivity, CrmActivityRecurrence,
      CrmTimelineItem, CrmAttachment, CrmEmailTemplate, CrmMentionUser,
    ]),
    IamModule,  // <-- IMPORT để inject IamUserService
    PlatformModule,  // <-- IMPORT để inject NotificationService
  ],
  controllers: [LeadsController, ContactsController, CompaniesController, TagsController, LeadSourcesController,
                RemindersController, ActivitiesController, TimelineController, AttachmentsController,
                EmailTemplatesController, DistributionController],
  providers: [
    LeadsService, ContactsService, CompaniesService, TagsService, LeadSourcesService, RemindersService,
    ActivitiesService, TimelineService, AttachmentsService, EmailTemplatesService, DistributionService,
    CrmLeadServiceImpl, CrmContactServiceImpl, CrmCompanyServiceImpl,
    CrmActivityServiceImpl, CrmTimelineServiceImpl, CrmAttachmentServiceImpl,
    CrmTagServiceImpl, CrmEmailTemplateServiceImpl, CrmLeadSourceServiceImpl,
    { provide: CRM_LEAD_SERVICE, useExisting: CrmLeadServiceImpl },
    { provide: CRM_CONTACT_SERVICE, useExisting: CrmContactServiceImpl },
    { provide: CRM_COMPANY_SERVICE, useExisting: CrmCompanyServiceImpl },
    { provide: CRM_ACTIVITY_SERVICE, useExisting: CrmActivityServiceImpl },
    { provide: CRM_TIMELINE_SERVICE, useExisting: CrmTimelineServiceImpl },
    { provide: CRM_ATTACHMENT_SERVICE, useExisting: CrmAttachmentServiceImpl },
    { provide: CRM_TAG_SERVICE, useExisting: CrmTagServiceImpl },
    { provide: CRM_EMAIL_TEMPLATE_SERVICE, useExisting: CrmEmailTemplateServiceImpl },
    { provide: CRM_LEAD_SOURCE_SERVICE, useExisting: CrmLeadSourceServiceImpl },
  ],
  exports: [
    CRM_LEAD_SERVICE, CRM_CONTACT_SERVICE, CRM_COMPANY_SERVICE,
    CRM_ACTIVITY_SERVICE, CRM_TIMELINE_SERVICE, CRM_ATTACHMENT_SERVICE,
    CRM_TAG_SERVICE, CRM_EMAIL_TEMPLATE_SERVICE, CRM_LEAD_SOURCE_SERVICE,
  ],
})
export class CrmCoreModule {}
```

### 4.3.3. Module Sales — `SalesModule` export

```ts
// server/src/modules/sales/sales.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesPipeline, SalesPipelineStage, SalesDeal, SalesDealLineItem, SalesDealStageHistory,
      SalesLossReason, SalesProduct, SalesTaxRate, SalesQuote, SalesQuoteLineItem, SalesQuoteNumberSeq,
    ]),
    IamModule,
    CrmCoreModule,  // <-- IMPORT để inject CRM services
    PlatformModule,
  ],
  controllers: [PipelinesController, DealsController, LineItemsController, ProductsController,
                QuotesController, LossReasonsController, ConvertController],
  providers: [
    PipelinesService, DealsService, LineItemsService, ProductsService, QuotesService, LossReasonsService, ConvertService,
    SalesDealServiceImpl, SalesProductServiceImpl, SalesQuoteServiceImpl,
    { provide: SALES_DEAL_SERVICE, useExisting: SalesDealServiceImpl },
    { provide: SALES_PRODUCT_SERVICE, useExisting: SalesProductServiceImpl },
    { provide: SALES_QUOTE_SERVICE, useExisting: SalesQuoteServiceImpl },
  ],
  exports: [SALES_DEAL_SERVICE, SALES_PRODUCT_SERVICE, SALES_QUOTE_SERVICE],
})
export class SalesModule {}
```

### 4.3.4. Module Platform — `PlatformModule` export

```ts
// server/src/modules/platform/platform.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlatformNotification, PlatformNotificationPref, PlatformSavedView,
      PlatformCustomFieldDef, PlatformCustomFieldValue, PlatformReportDef,
      PlatformGoal, PlatformDashboardLayout, PlatformForecastSnapshot,
      PlatformSystemSetting, PlatformImportBatch,
    ]),
    IamModule, CrmCoreModule, SalesModule,  // <-- IMPORT TẤT CẢ
  ],
  controllers: [NotificationsController, SavedViewsController, CustomFieldsController, ReportsController,
                GoalsController, DashboardController, ForecastController, SystemSettingsController,
                SearchController, ImportExportController, AdminController],
  providers: [
    NotificationsService, SavedViewsService, CustomFieldsService, ReportsService, GoalsService,
    DashboardService, ForecastService, SystemSettingsService, SearchService, ImportExportService, AdminService,
    PlatformNotificationServiceImpl, PlatformSavedViewServiceImpl, PlatformCustomFieldServiceImpl, PlatformSearchServiceImpl,
    { provide: PLATFORM_NOTIFICATION_SERVICE, useExisting: PlatformNotificationServiceImpl },
    { provide: PLATFORM_SAVED_VIEW_SERVICE, useExisting: PlatformSavedViewServiceImpl },
    { provide: PLATFORM_CUSTOM_FIELD_SERVICE, useExisting: PlatformCustomFieldServiceImpl },
    { provide: PLATFORM_SEARCH_SERVICE, useExisting: PlatformSearchServiceImpl },
  ],
  exports: [
    PLATFORM_NOTIFICATION_SERVICE, PLATFORM_SAVED_VIEW_SERVICE,
    PLATFORM_CUSTOM_FIELD_SERVICE, PLATFORM_SEARCH_SERVICE,
  ],
})
export class PlatformModule {}
```

### 4.3.5. AppModule — Composition root

```ts
// server/src/app.module.ts (do Tech Lead maintain)
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormConfig),
    IamModule,
    CrmCoreModule,
    SalesModule,
    PlatformModule,
  ],
})
export class AppModule {}
```

> **Lưu ý quan trọng:** `CrmCoreModule` import `IamModule` (vì cần `IamUserService`). `SalesModule` import `IamModule + CrmCoreModule`. `PlatformModule` import cả 3. KHÔNG tạo vòng tròn bằng cách IAM import CRM (điều này bị cấm — IAM là dependency của các module khác, không ngược lại).

---

## 4.4. Interface mẫu — đặt tại `src/modules/<module>/interfaces/`

Mỗi module đặt interface contract tại `src/modules/<module>/interfaces/`:

```ts
// src/modules/iam/interfaces/index.ts
export const IAM_USER_SERVICE = Symbol('IAM_USER_SERVICE');
export const AUDIT_SERVICE = Symbol('AUDIT_SERVICE');

export interface IamUserDto {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'invited' | 'deleted';
  avatarUrl?: string;
  lastLoginAt?: string;
}

export interface IIamUserService {
  findById(id: number): Promise<IamUserDto | null>;
  findByIds(ids: number[]): Promise<IamUserDto[]>;
  findByEmail(email: string): Promise<IamUserDto | null>;
  isActive(id: number): Promise<boolean>;
  countByStatus(status: string): Promise<number>;
  countActiveUsers(): Promise<number>;
}

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

**Nguyên tắc:**
1. Interface chỉ chứa **method signature** + **DTO type**, KHÔNG chứa implementation.
2. Implementation nằm trong `src/modules/<module>/services/<service>.impl.ts`.
3. Provider đăng ký bằng `{ provide: <SYMBOL>, useExisting: <ImplClass> }`.
4. Module khác chỉ import interface + symbol, dùng `@Inject(<SYMBOL>)` để dùng.

**Ví dụ dùng từ CRM Core:**
```ts
// src/modules/crm-core/leads/leads.service.ts
@Injectable()
export class LeadsService {
  constructor(
    @Inject(IAM_USER_SERVICE) private readonly iamUserService: IIamUserService,
    @Inject(AUDIT_SERVICE) private readonly auditService: IAuditService,
    @Inject(PLATFORM_NOTIFICATION_SERVICE) private readonly notiService: IPlatformNotificationService,
    // ... repo của chính module
  ) {}

  async create(dto: CreateLeadDto, currentUser: AuthUser): Promise<LeadDto> {
    // ...
    await this.auditService.log({ action: 'create', entityType: 'lead', entityId: lead.id, ... });
    await this.notiService.notifyAdminsOfNewLead(lead.id);
    return lead;
  }
}
```

---

## 4.5. Quy trình "chốt Hợp đồng Service" trước khi code

Khi một task có yêu cầu service từ module khác (vd: Dev 3 cần `CrmLeadService.convertToContact`):

### Bước 1 — Consumer (Dev 3) mở ticket
- Mô tả method cần dùng: input/output/error.
- Tag Owner (Dev 2) + Tech Lead.

### Bước 2 — Owner (Dev 2) review & chốt
- Xác nhận method có tồn tại trong interface đã công bố (xem Phần 3).
- Nếu **CHƯA CÓ**: Owner tạo PR bổ sung vào `interfaces/` + implementation.
- Owner ghi rõ "ready" trong ticket + link PR.

### Bước 3 — Consumer code sau khi Owner merge
- Consumer chỉ code khi method đã có trong interface được export.
- Nếu method signature thay đổi, Owner phải tạo PR breaking change + thông báo trước 1 ngày.

### Quy tắc cứng
- ❌ Consumer **không tự ý** sửa interface của Owner.
- ❌ Consumer **không tự ý** viết wrapper riêng gọi repository của Owner (sẽ tạo duplicate query).
- ✅ Nếu method chưa có mà Owner chưa rảnh, hai bên thống nhất đẩy deadline hoặc thay bằng task tạm thời.

---

## 4.6. Xử lý Circular Dependency (nếu phát sinh)

NestJS hỗ trợ forwardRef, NHƯNG cố gắng tránh. Nếu thực sự cần:

```ts
// moduleA.module.ts
@Module({
  imports: [forwardRef(() => ModuleB)],
  // ...
})
export class ModuleA {}

// moduleB.module.ts
@Module({
  imports: [forwardRef(() => ModuleA)],
  // ...
})
export class ModuleB {}

// service trong A
constructor(@Inject(forwardRef(() => ModuleBService)) private b: ModuleBService) {}
```

**Hiện tại thiết kế KHÔNG có vòng tròn:**
- IAM (no imports from CRM/Sales/Platform)
- CRM Core imports IAM + Platform
- Sales imports IAM + CRM + Platform
- Platform imports IAM + CRM + Sales

→ Không cần forwardRef. Nếu trong tương lai cần circular, mở thảo luận với Tech Lead trước khi dùng.

---

## 4.7. Transaction boundary

Khi một task cần thao tác nhiều bảng (vd: convert lead → tạo contact + tạo deal + update lead), dùng **TypeORM DataSource transaction**:

```ts
async convertLead(input: ConvertFromLeadDto, by: number) {
  return this.dataSource.transaction(async (manager) => {
    // 1. Tạo contact (qua CrmLeadService → vẫn trong cùng transaction)
    // 2. Tạo deal (qua repo của Sales)
    // 3. Update lead (qua CrmLeadService)
    // 4. Audit log (qua AuditService — outside transaction OK)
    // 5. Notification (outside transaction OK)
  });
}
```

**Nguyên tắc:**
- Transaction chỉ cho thao tác **CÙNG database**. Audit log + notification có thể gọi NGOÀI transaction (best effort).
- Không truyền `manager` qua service của module khác (sẽ leak abstraction). Thay vào đó, để service đó tự `getRepository().manager`.

---

## 4.8. Checklist hợp đồng cho mỗi task có cross-module

Trong PR của task, Dev phải liệt kê:

- [ ] Service nào từ module khác được inject (Symbol + tên)
- [ ] Interface file nào định nghĩa method (vd: `src/modules/crm-core/interfaces/crm-lead.interface.ts`)
- [ ] Method nào sẽ gọi, kèm input/output mong đợi
- [ ] Nếu có transaction, mô tả boundary
- [ ] Nếu có notification, mô tả trigger nào gọi noti service nào
- [ ] Nếu có audit log, mô tả action + entityType

---

## 4.9. Ví dụ End-to-End: Convert Lead (Sales gọi CRM Core + Platform + IAM)

**Kịch bản FE:** User bấm "Convert to Deal" trong `/leads/[id]`. Modal `ConvertLeadDialog` gửi request → BE tạo Deal + optional Contact.

**Flow trong Sales (Dev 3):**
```
POST /api/deals/convert-from-lead
   ↓
ConvertController.create()
   ↓
ConvertService.execute(dto, currentUser)
   ├─ 1. Validate leadId via @Inject(CRM_LEAD_SERVICE).findById()
   │      → 404 nếu không tồn tại
   │      → 403 nếu currentUser không phải owner/admin
   │
   ├─ 2. (Trong transaction)
   │      ├─ 2a. Nếu createContact=true:
   │      │         → CrmLeadService.convertToContact({leadId, ...})
   │      │         → Nhận contactId
   │      │      ├─ 2b. Tạo sales_deals (qua repo Sales)
   │      │      ├─ 2c. Tạo sales_deal_stage_history
   │      │      └─ 2d. CrmLeadService.markQualified(leadId, currentUser.id)
   │      └─ 2e. CrmTimelineService.add({recordType:'lead', recordId, type:'system',
   │            title:'Converted to deal #${dealId}', ...})
   │
   ├─ 3. (Outside transaction)
   │      ├─ AuditService.log({action:'convert', entityType:'lead', entityId, details:{dealId, contactId}})
   │      └─ PlatformNotificationService.create({userId: lead.ownerId, type:'deal_stage', link:`/deals/${dealId}`})
   │
   └─ 4. Return {dealId, contactId}
```

**PR của Dev 3 phải include:**
- `convert.controller.ts` + `convert.service.ts` + DTO
- Inject: `CRM_LEAD_SERVICE`, `CRM_TIMELINE_SERVICE`, `PLATFORM_NOTIFICATION_SERVICE`, `AUDIT_SERVICE`
- Test: lead không tồn tại → 404; lead không phải của user → 403; happy path → 201; transaction rollback nếu lỗi giữa chừng
