# Phần 3 — Technical Requirement: Dev 4 (Module Platform & Analytics)

> **Dev 4** sở hữu module `platform/` — Notifications, Saved Views, Custom Fields, Reports, Goals, Dashboard, Forecast, System Settings, Search, Import/Export.
> **Tổng task: 32.**
>
> Quy ước Response/Status chung xem file `99-appendix-conventions.md`.

---

## Nhóm A — NOTIFICATIONS (5 task)

### T4.1. GET `/api/notifications` — Danh sách

**Auth:** Authenticated
**Query:** `?page=1&limit=20&isRead=true|false&type=mention|assignment|reminder|deal_stage|quote_accepted|system`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "userId": 1, "type": "mention", "title": "Bạn được nhắc đến", "body": "Trong note: ...", "link": "/leads/123", "isRead": false, "createdAt": "2026-06-16T10:00:00Z" }
  ],
  "meta": { "page": 1, "limit": 20, "total": 50, "unread": 12 }
}
```

### T4.2. GET `/api/notifications/unread-count`

**Response 200:** `{ "success": true, "data": { "count": 12 } }`

### T4.3. POST `/api/notifications/:id/read` — Đánh dấu đã đọc

**Response 200:** notification với `isRead=true`.

### T4.4. POST `/api/notifications/read-all`

**Response 200:** `{ "success": true, "data": { "updated": 12 } }`

### T4.5. DELETE `/api/notifications/:id`

**Response 204.**

---

## Nhóm B — SAVED VIEWS (5 task)

### T4.6. GET `/api/saved-views` — Danh sách

**Query:** `?entity=lead|contact|company|deal|quote|activity&ownerId=me|all`

**Response 200:** mảng saved view.

### T4.7. POST `/api/saved-views`

**Request DTO:**
```ts
class CreateSavedViewDto {
  @IsIn(['lead','contact','company','deal','quote','activity']) entity: string;
  @IsString() @MinLength(2) @MaxLength(150) name: string;
  @IsObject() filters: Record<string, any>;
  @IsArray() @IsString({ each: true }) columns: string[];
  @IsOptional() @IsString() sort?: string;
  @IsOptional() @IsBoolean() isShared?: boolean;
}
```

**Response 201.**

### T4.8. GET `/api/saved-views/:id`

**Response 200:** saved view.

### T4.9. PUT `/api/saved-views/:id`

**Request DTO:** các field optional. **Response 200.**

### T4.10. DELETE `/api/saved-views/:id`

**Response 204.**

---

## Nhóm C — CUSTOM FIELDS (4 task)

### T4.11. GET `/api/custom-fields`

**Query:** `?entity=lead|contact|company|deal|quote|activity`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "entity": "lead", "fieldKey": "industry", "label": "Ngành nghề", "type": "select", "options": ["IT","Retail"], "required": false, "displayOrder": 1 }
  ]
}
```

### T4.12. POST `/api/custom-fields` (Admin)

**Request DTO:**
```ts
class CreateCustomFieldDto {
  @IsIn(['lead','contact','company','deal','quote','activity']) entity: string;
  @Matches(/^[a-z][a-z0-9_]{0,79}$/) fieldKey: string;
  @IsString() @MaxLength(150) label: string;
  @IsIn(['text','number','date','select','checkbox']) type: string;
  @IsOptional() @IsArray() @IsString({ each: true }) options?: string[];
  @IsOptional() @IsBoolean() required?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}
```

**Response 201.** **Response 409:** `code: FIELD_KEY_EXISTS`.

### T4.13. PUT/DELETE `/api/custom-fields/:id` (Admin)

### T4.14. GET `/api/custom-fields/values` — Lấy giá trị theo record

**Query:** `?entity=&recordId=`

**Response 200:** `{ "success": true, "data": [{ "fieldKey": "industry", "value": "IT" }] }`

### T4.15. POST `/api/custom-fields/values` — Set giá trị

**Request DTO:**
```ts
class SetCustomFieldValueDto {
  @IsString() entity: string;
  @IsInt() recordId: number;
  @IsString() fieldKey: string;
  value: string | number | boolean | null;
}
```

**Logic:** validate `recordId` tồn tại (cross-module) — vd: nếu `entity='lead'`, inject `CrmLeadService.findById` để check.

---

## Nhóm D — REPORTS (5 task)

### T4.16. GET `/api/reports/presets` — Báo cáo mẫu

**Response 200:** mảng `ReportDef` (seed sẵn).

### T4.17. GET `/api/reports/defs` — Danh sách report user-defined

**Query:** `?ownerId=me|all&shared=true|false`

### T4.18. POST `/api/reports/defs` — Tạo report

**Request DTO:**
```ts
class CreateReportDefDto {
  @IsString() @MinLength(2) name: string;
  @IsIn(['lead','deal','activity','quote']) entity: 'lead'|'deal'|'activity'|'quote';
  @IsIn(['bar','line','pie','table','kpi']) chartType: 'bar'|'line'|'pie'|'table'|'kpi';
  @IsString() dimension: string;  // source, status, assignee, month, quarter, owner, tag, stage, company, loss_reason
  @IsIn(['count','sum_value','weighted_value','win_rate','conversion_rate']) measure: string;
  @IsOptional() @IsObject() filters?: Record<string, any>;
  @IsOptional() @IsBoolean() isShared?: boolean;
}
```

**Response 201.**

### T4.19. POST `/api/reports/run` — Chạy report

**Request DTO:** `{ def: ReportDef | defId: number, filters?: any }`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rows": [
      { "dimension": "Website", "count": 12, "value": 250000000 },
      { "dimension": "LinkedIn", "count": 8, "value": 150000000 }
    ],
    "meta": { "totalRows": 2, "totalValue": 400000000 }
  }
}
```

**Logic:**
- Inject `CrmLeadService`, `SalesDealService` để query.
- Dimension 'month'/'quarter' → group theo `DATE_FORMAT`.
- Measure 'win_rate' = (won / (won+lost)) * 100.
- Measure 'conversion_rate' = (won deals / qualified leads) * 100.
- Filter động theo `{status, source, stage, type, from, to, ownerId}`.

### T4.20. POST `/api/reports/drilldown` — Drill-down theo bucket

**Request DTO:** `{ def, bucketValue, page?, limit? }`

**Response 200:** mảng record thô (lead hoặc deal) thuộc bucket đó.

### T4.21. DELETE `/api/reports/defs/:id` — Xóa report

**Response 204.**

---

## Nhóm E — GOALS (3 task)

### T4.22. GET `/api/goals`

**Query:** `?ownerId=me|all&isTeam=true|false&period=month|quarter&periodKey=2026-06|2026-Q2`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "ownerId": 1, "ownerName": "Admin", "isTeam": false, "period": "month", "periodKey": "2026-06",
      "metric": "revenue", "target": 500000000, "actual": 320000000, "pct": 64, "pace": "on_track", "daysLeft": 14 }
  ]
}
```

**Logic:** `actual` tính bằng cách inject `SalesDealService.revenueByOwnerInPeriod(ownerId, periodKey)`. `pct = actual/target * 100`. `pace`: so sánh tốc độ thực tế với expected (linear theo ngày trôi qua).

### T4.23. POST `/api/goals` — Tạo goal

**Request DTO:**
```ts
class CreateGoalDto {
  @IsOptional() @IsInt() ownerId?: number;
  @IsBoolean() isTeam: boolean;
  @IsIn(['month','quarter']) period: 'month' | 'quarter';
  @IsString() periodKey: string;     // "2026-06" | "2026-Q2"
  @IsIn(['revenue','deals_won']) metric: 'revenue' | 'deals_won';
  @IsNumber() @Min(0) target: number;
}
```

**Response 201.**

### T4.24. PUT/DELETE `/api/goals/:id`

---

## Nhóm F — DASHBOARD (3 task)

### T4.25. GET `/api/dashboard/stats` — KPI tổng hợp

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150, "leadsGrowth": 12.5,
    "totalDeals": 25, "dealsGrowth": 8.0,
    "revenue": 1200000000, "revenueGrowth": 15.2,
    "conversionRate": 18.5, "conversionGrowth": -2.1
  }
}
```

**Logic:**
- `totalLeads`, `totalDeals`, `revenue` → inject `CrmLeadService`, `SalesDealService`.
- `growth` = ((current - previous) / previous) * 100. So sánh tháng này vs tháng trước.

### T4.26. GET `/api/dashboard/recent-deals`

**Query:** `?limit=5`
**Response 200:** mảng deal gần đây (kèm contact/company name).

### T4.27. GET/PUT `/api/dashboard/layout` — Widget layout

**Auth:** Authenticated (chính mình)
**Response 200:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "widgets": [
      { "id": "w1", "type": "kpi", "w": 3, "h": 1, "x": 0, "y": 0 },
      { "id": "w2", "type": "forecast", "w": 6, "h": 2, "x": 0, "y": 1, "refId": null }
    ]
  }
}
```

**Request DTO (PUT):** `{ widgets: DashboardWidget[] }` — validate mỗi widget có type ∈ enum.

---

## Nhóm G — FORECAST (2 task)

### T4.28. GET `/api/forecast?periodKey=2026-Q2`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "periodKey": "2026-Q2",
    "buckets": [
      { "category": "committed", "value": 800000000 },
      { "category": "best_case", "value": 1500000000 },
      { "category": "pipeline", "value": 3000000000 }
    ],
    "asOf": "2026-06-16T10:00:00Z"
  }
}
```

**Logic (inject `SalesDealService.forecastBuckets(periodKey)`):**
- `committed` = SUM(value) WHERE stage IN ('negotiation', 'won').
- `best_case` = SUM(value) WHERE stage = 'proposal'.
- `pipeline` = SUM(value * probability/100) của tất cả deals open.

### T4.29. POST `/api/forecast/snapshot` — Lưu snapshot (Admin)

**Response 201:** snapshot trong `platform_forecast_snapshots`.

---

## Nhóm H — SYSTEM SETTINGS (4 task)

### T4.30. GET `/api/system-settings/general`

**Response 200:**
```json
{ "success": true, "data": { "systemName": "VanhCorp CRM", "timezone": "Asia/Ho_Chi_Minh", "defaultRole": "user", "allowSelfRegistration": false, "invitationTtlHours": 48 } }
```

### T4.31. PUT `/api/system-settings/general` (Admin)

**Request DTO:**
```ts
class UpdateGeneralSettingsDto {
  @IsString() @MinLength(2) systemName: string;
  @IsString() timezone: string;
  @IsIn(['admin','user']) defaultRole: 'admin' | 'user';
  @IsBoolean() allowSelfRegistration: boolean;
  @IsInt() @Min(1) @Max(720) invitationTtlHours: number;
}
```

**Response 200.**

### T4.32. GET /api/system-settings/sla

**Response 200:**
```json
{ "success": true, "data": { "unassignedAlertHours": 24, "reminderLeadTimeHours": 2, "dormantLeadDays": 30, "poolEnabled": true, "poolClaimLimit": 5 } }
```

### T4.33. PUT /api/system-settings/sla (Admin)

**Request DTO:**
```ts
class UpdateSlaSettingsDto {
  @IsInt() @Min(1) unassignedAlertHours: number;
  @IsInt() @Min(0) reminderLeadTimeHours: number;
  @IsInt() @Min(1) dormantLeadDays: number;
  @IsBoolean() poolEnabled: boolean;
  @IsInt() @Min(1) @Max(20) poolClaimLimit: number;
}
```

**Response 200.**

---

## Nhóm I — SEARCH (1 task)

### T4.34. GET `/api/search` — Global search (Command Palette)

**Query:** `?q=&limit=10`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "type": "lead", "id": "123", "title": "John Smith", "subtitle": "Acme Corp · john@acme.com", "link": "/leads/123" },
    { "type": "contact", "id": "8", "title": "Jane Doe", "subtitle": "Tech Inc · CTO", "link": "/contacts/8" },
    { "type": "company", "id": "5", "title": "Acme Corp", "subtitle": "IT · 100-500 nhân viên", "link": "/companies/5" },
    { "type": "deal", "id": "5", "title": "Acme Enterprise", "subtitle": "50.000.000 ₫ · proposal", "link": "/deals/5" }
  ]
}
```

**Logic:**
- Inject `CrmLeadService.searchForPicker()`, `CrmContactService.searchForPicker()`, `CrmCompanyService.searchForPicker()`, `SalesDealService.searchForPicker()`.
- Mỗi service trả về tối đa `limit/4` kết quả. Gộp + sắp xếp theo độ dài title.
- `link` theo FE convention.

---

## Nhóm J — IMPORT / EXPORT (3 task)

### T4.35. POST `/api/import/:entity/commit` — Commit import (Lead/Contact/Company)

**Auth:** Authenticated
**Request:** `multipart/form-data` file CSV + body `{ mapping, dedupeMode }`.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "batchId": 1, "total": 100, "created": 95, "updated": 3, "skipped": 2,
    "errors": [{ "row": 12, "reason": "EMAIL_EXISTS", "data": { "email": "..." } }]
  }
}
```

**Logic:**
- `entity = 'lead' | 'contact' | 'company'`.
- Dedupe mode: 'skip' (mặc định) | 'update' | 'create'.
- Inject service tương ứng (CrmLeadService, CrmContactService, CrmCompanyService) — KHÔNG tự ý gọi repository.
- Insert `platform_import_batches(entity, file_name, total, created, updated, skipped, errors_json, by_user)`.
- Audit log.

### T4.36. GET `/api/import/batches` — Lịch sử import

**Response 200:** mảng batch + meta.

### T4.37. GET `/api/export/:entity` — Export CSV (Lead/Contact/Company/Deal/Quote)

**Query:** `?filter=...` (áp dụng filter giống list)

**Response 200:** `Content-Type: text/csv; charset=utf-8`, file `<entity>s-YYYY-MM-DD.csv` (BOM).

---

## Nhóm K — ADMIN OVERVIEW (2 task)

### T4.38. GET `/api/admin/overview?period=week|month`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "activeUsers": 8, "totalLeads": 150, "unassignedLeads": 12, "revenue": 1200000000,
    "leadsByUser": [
      { "userId": 1, "name": "Admin", "count": 30, "pct": 20 },
      { "userId": 2, "name": "Staff A", "count": 25, "pct": 16.7 }
    ],
    "recentAudit": [
      { "id": 1, "userName": "Admin", "action": "create", "entityType": "lead", "entityId": 123, "createdAt": "..." }
    ]
  }
}
```

**Logic:**
- Inject `IamUserService.countActiveUsers()`, `CrmLeadService.countUnassigned()`, `SalesDealService.sumWonValue(period)`.
- `leadsByUser`: group `crm_leads` theo `owner_id`. Inject CrmLeadService.
- `recentAudit`: 5 dòng mới nhất, inject AuditService từ Dev 1.

### T4.39. GET `/api/admin/performance?period=week|month`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "userId": 1, "userName": "Admin", "leadCount": 30, "dealCount": 5, "winRate": 40.0 }
  ]
}
```

**Logic:** inject các service aggregate.

### T4.40. GET `/api/admin/alerts`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": "a1", "type": "unassigned_lead", "message": "12 lead chưa được gán trong 24h", "severity": "warning", "entityId": null, "createdAt": "..." },
    { "id": "a2", "type": "inactive_user", "message": "User Staff B không đăng nhập 7 ngày", "severity": "warning", "entityId": 3, "createdAt": "..." }
  ]
}
```

**Logic:** generate on-demand (không lưu DB) từ các query aggregate.

---

## Export contract (Interface) Dev 4 phải expose cho module khác

Đặt tại `src/modules/platform/interfaces/`:

```ts
// NotificationService — dùng cho mọi module khác cần gửi noti
export const PLATFORM_NOTIFICATION_SERVICE = Symbol('PLATFORM_NOTIFICATION_SERVICE');
export interface IPlatformNotificationService {
  create(input: {
    userId: number;
    type: 'mention' | 'assignment' | 'reminder' | 'deal_stage' | 'quote_accepted' | 'system';
    title: string;
    body?: string;
    link?: string;
  }): Promise<NotificationDto>;
  createMany(userIds: number[], input: { type: string; title: string; body?: string; link?: string }): Promise<void>;
  countUnread(userId: number): Promise<number>;
  // cho scheduled job (cron)
  notifyAdminsOfNewLead(leadId: number): Promise<void>;
  notifyOwnerOfAssignment(leadId: number, ownerId: number): Promise<void>;
  notifyDealStageChange(dealId: number, newStage: string): Promise<void>;
  notifyQuoteAccepted(quoteId: number): Promise<void>;
}

// SavedViewService — cho CRM Core, Sales
export const PLATFORM_SAVED_VIEW_SERVICE = Symbol('PLATFORM_SAVED_VIEW_SERVICE');
export interface IPlatformSavedViewService {
  findById(id: number, userId: number): Promise<SavedViewDto | null>;
  applyView(id: number, userId: number): Promise<{ filters: any; columns: string[]; sort?: string }>;
}

// CustomFieldService — cho CRM Core, Sales (validate + render custom field khi CRUD entity)
export const PLATFORM_CUSTOM_FIELD_SERVICE = Symbol('PLATFORM_CUSTOM_FIELD_SERVICE');
export interface IPlatformCustomFieldService {
  getDefs(entity: string): Promise<CustomFieldDefDto[]>;
  getValues(entity: string, recordId: number): Promise<{ fieldKey: string; value: string }[]>;
  setValues(entity: string, recordId: number, values: { fieldKey: string; value: any }[]): Promise<void>;
  validateValues(entity: string, recordId: number, values: { fieldKey: string; value: any }[]): Promise<{ ok: boolean; errors: { fieldKey: string; message: string }[] }>;
}

// SearchService — public, ai cũng dùng
export const PLATFORM_SEARCH_SERVICE = Symbol('PLATFORM_SEARCH_SERVICE');
export interface IPlatformSearchService {
  search(query: string, limit?: number): Promise<SearchResultDto[]>;
}
```

Tất cả service này được `export` trong `PlatformModule` (xem Phần 4).
