# Phần 3 — Technical Requirement: Dev 2 (Module CRM Core)

> **Dev 2** sở hữu module `crm-core/` — Leads, Contacts, Companies, Tags, Lead Sources, Reminders, Activities, Timeline, Attachments, Email Templates, Distribution.
> **Tổng task: 38.**
>
> Quy ước Response/Status chung xem file `99-appendix-conventions.md`.

---

## Nhóm A — LEADS (12 task)

### T2.1. POST `/api/leads` — Tạo lead

- **Auth:** Authenticated
- **SP:** 2

**Request DTO:**
```ts
class CreateLeadDto {
  @IsString() @MinLength(2) @MaxLength(150) name: string;
  @IsOptional() @IsString() @MaxLength(200) company?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() @MaxLength(50) source?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) score?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsBoolean() inPool?: boolean;
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 123, "name": "John Smith", "company": "Acme Corp", "email": "john@acme.com",
    "phone": "0901234567", "source": "website", "status": "new", "score": 0,
    "inPool": false, "order": 0, "tags": ["new"], "reminders": [],
    "ownerId": 1, "createdAt": "2026-06-16T10:00:00Z"
  }
}
```

**Response 409:** `code: LEAD_EMAIL_EXISTS` nếu email đã tồn tại trong cùng owner và chưa xóa.

**Logic DB/Service:**
- Insert `crm_leads` với `owner_id = currentUser.id`, `status='new'`, `score=0` (nếu không gửi), `in_pool=false` (mặc định).
- Nếu có `tags`: insert `crm_lead_tags(lead_id, tag_id)`.
- Nếu `inPool=true`: KHÔNG ghi assignment. Ngược lại: insert `crm_lead_assignments(lead_id, to_user_id=currentUser, method='manual', assigned_by=currentUser)`.
- Audit log: `action='create', entityType='lead'`.
- Trigger `NotificationService.notifyAdminsOfNewLead()` (qua Dev 4 service).

---

### T2.2. GET `/api/leads` — Danh sách lead

- **Auth:** Authenticated
- **SP:** 3
- **Phụ thuộc:** Service `PlatformSavedViewService` (nếu FE truyền `viewId`)

**Query:** `?page=1&limit=20&status=new,contacted,qualified,lost&source=website,linkedin&minScore=0&maxScore=100&assignee=me|userId|all&search=&sortBy=name|source|status|score|createdAt&sortDir=asc|desc&inPool=true|false&quickFilter=all|new|recent|highScore|myLeads&viewId=...`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 123, "name": "John Smith", "company": "Acme Corp", "email": "john@acme.com", "phone": "...", "source": "website",
      "status": "new", "score": 85, "inPool": false, "order": 0, "tags": ["hot","vip"], "remindersCount": 1,
      "ownerId": 1, "ownerName": "Admin", "createdAt": "..." }
  ],
  "meta": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

**Logic DB/Service:**
- Staff mặc định chỉ thấy lead của mình (`owner_id = currentUser.id`), trừ khi `assignee=all` (admin only).
- Filter status multi-value, source multi-value, score range.
- `search` LIKE trên `name`, `company`, `email`, `phone`, `source`, `assignee_name`.
- `quickFilter='recent'` → `created_at >= NOW() - 7 days`.
- `quickFilter='highScore'` → `score >= 70`.
- `quickFilter='myLeads'` → `owner_id = currentUser.id`.
- Sort theo `sortBy` + `sortDir` (whitelist field, chống SQL injection).
- Nếu `viewId` được truyền: inject `PlatformSavedViewService` để load filter/columns từ view đã lưu (xem Phần 4 Service Contract).
- Include `tags` (join `crm_lead_tags` + `crm_tags`) và `remindersCount` (subquery count `crm_lead_reminders` WHERE `status='pending'`).

---

### T2.3. GET `/api/leads/:id` — Chi tiết lead

- **Auth:** Authenticated
- **SP:** 1

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 123, "name": "...", "company": "...", "email": "...", "phone": "...", "source": "...",
    "status": "qualified", "score": 85, "inPool": false, "order": 0,
    "tags": [{ "id": "vip", "label": "VIP", "color": "#8B5CF6", "bgColor": "#EDE9FE" }],
    "reminders": [
      { "id": 1, "leadId": 123, "date": "2026-06-20", "time": "09:00", "note": "Gọi lại", "status": "pending", "createdAt": "..." }
    ],
    "assignments": [
      { "id": 1, "fromUserId": null, "toUserId": 1, "method": "manual", "createdAt": "..." }
    ],
    "ownerId": 1, "ownerName": "Admin", "createdAt": "...", "updatedAt": "..."
  }
}
```

**Response 404:** `code: LEAD_NOT_FOUND`.
**Response 403:** Staff cố xem lead của người khác.

---

### T2.4. PUT `/api/leads/:id` — Cập nhật lead

- **Auth:** Authenticated (owner hoặc admin)
- **SP:** 2

**Request DTO:** tương tự CreateLeadDto + các field optional `status`, `score`, `tags`.

**Response 200:** lead sau khi update.
**Response 403:** không phải owner/admin.
**Response 404:** không tìm thấy.

**Logic:**
- Capture `details.before` (snapshot) và `details.after` để ghi audit log.
- Nếu đổi `status='qualified'`: trigger notification cho owner (nếu khác current user).
- Nếu đổi `tags`: diff cũ/mới → insert/delete `crm_lead_tags`.
- Nếu đổi `owner_id`: insert `crm_lead_assignments(fromUserId, toUserId, method, assigned_by)`.

---

### T2.5. DELETE `/api/leads/:id` — Xóa (soft) lead

- **Auth:** Authenticated (owner hoặc admin)
- **SP:** 1

**Response 204.** Audit log `action='delete'`.

**Logic:** set `deleted_at = NOW` trên `crm_leads`. Cascade soft-delete reminders/assignments. KHÔNG xóa activities (giữ lịch sử).

---

### T2.6. PUT `/api/leads/:id/status` — Đổi status nhanh (Kanban)

- **Auth:** Authenticated (owner hoặc admin)
- **SP:** 1

**Request DTO:** `{ "status": "contacted", "order": 0 }`

**Response 200:** lead sau khi update.

**Logic:** update `status` + `order` (cho kanban). Audit log.

---

### T2.7. POST `/api/leads/bulk` — Bulk action

- **Auth:** Authenticated
- **SP:** 2

**Request DTO:**
```ts
class BulkLeadActionDto {
  @IsArray() @ArrayMinSize(1) @IsInt({ each: true }) ids: number[];
  @IsIn(['delete','changeStatus','assign','moveToPool','removeFromPool']) action: string;
  // payload tùy action:
  @IsOptional() @IsIn(['new','contacted','qualified','lost']) status?: 'new'|'contacted'|'qualified'|'lost';
  @IsOptional() @IsInt() toUserId?: number;
}
```

**Response 200:**
```json
{ "success": true, "data": { "affected": 5, "skipped": [123, 456] } }
```

**Response 207 (Multi-Status) — optional:**
```json
{ "success": true, "data": { "affected": 5, "skipped": [{ "id": 123, "reason": "FORBIDDEN" }] } }
```

**Logic:** với mỗi id, check quyền (owner/admin) trước khi áp dụng action. Bỏ qua id không có quyền, không throw.

---

### T2.8. GET `/api/leads/:id/reminders` — List reminders
- **Auth:** Authenticated
- **SP:** 1

**Response 200:** mảng reminder.

### T2.9. POST `/api/leads/:id/reminders` — Tạo reminder

- **Auth:** Authenticated (owner/admin)
- **SP:** 1

**Request DTO:**
```ts
class CreateReminderDto {
  @IsDateString() date: string;   // YYYY-MM-DD
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/) time: string;
  @IsString() @MaxLength(500) note: string;
}
```

**Response 201:** reminder vừa tạo + trigger `NotificationService.create({type:'reminder', userId, leadId, ...})` (scheduled job sẽ xử lý ở Dev 4).

### T2.10. PUT `/api/leads/:id/reminders/:reminderId` — Cập nhật reminder

- **Request DTO:** `{ status: 'pending'|'completed'|'snoozed', date?, time?, note? }`
- **Response 200.**

### T2.11. DELETE `/api/leads/:id/reminders/:reminderId` — Xóa reminder

- **Response 204.**

### T2.12. POST `/api/leads/import/preview` — Preview import (parse CSV)

- **Auth:** Authenticated
- **SP:** 3
- **Phụ thuộc:** `CrmTagService.listAll()` (inject từ chính module — không cross-module)

**Request:** `multipart/form-data` với file CSV.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "headers": ["name","email","phone","company","source"],
    "rows": [
      { "name": "John", "email": "john@x.com", "phone": "0901...", "company": "Acme", "source": "website" }
    ],
    "totalRows": 100,
    "autoMapping": { "name": "name", "email": "email", "phone": "phone", "company": "company", "source": "source" }
  }
}
```

**Logic:** parse CSV bằng `papaparse`, tự động mapping theo header (case-insensitive, alias). Trả preview 10 dòng đầu + mapping đề xuất.

---

## Nhóm B — CONTACTS (5 task)

### T2.13. POST `/api/contacts` — Tạo contact

**Request DTO:**
```ts
class CreateContactDto {
  @IsString() @MinLength(2) @MaxLength(150) name: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() @MaxLength(100) position?: string;
  @IsOptional() @IsInt() companyId?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}
```

**Response 201:** contact object.
**Response 409:** `code: CONTACT_EMAIL_EXISTS` (nếu cùng owner).

**Logic:** insert `crm_contacts` với `owner_id = currentUser`. Nếu `companyId` → validate công ty tồn tại (cùng module).

### T2.14. GET `/api/contacts` — Danh sách contact

**Query:** `?page=1&limit=20&search=&companyId=&sortBy=name|createdAt&sortDir=asc|desc`

**Response 200:** mảng contact + meta.

**Logic:** search LIKE trên `name`, `company`, `email`, `phone`.

### T2.15. GET `/api/contacts/:id` — Chi tiết contact

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1, "name": "...", "email": "...", "phone": "...", "position": "...",
    "companyId": 5, "companyName": "Acme Corp",
    "tags": [], "ownerId": 1, "createdAt": "..."
  }
}
```

### T2.16. PUT `/api/contacts/:id` — Cập nhật contact

**Request DTO:** giống CreateContactDto (mọi field optional).
**Response 200.** Audit log với before/after.

### T2.17. DELETE `/api/contacts/:id` — Xóa (soft) contact

**Response 204.** Audit log.

**Logic:** set `deleted_at`. KHÔNG cascade (giữ liên kết trong deal/quote, chỉ ẩn).

---

## Nhóm C — COMPANIES (5 task)

### T2.18. POST `/api/companies`

**Request DTO:**
```ts
class CreateCompanyDto {
  @IsString() @MinLength(2) @MaxLength(200) name: string;
  @IsOptional() @IsUrl() website?: string;
  @IsOptional() @IsString() @MaxLength(80) industry?: string;
  @IsOptional() @IsString() @MaxLength(40) size?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() @MaxLength(500) address?: string;
  @IsOptional() @IsString() @MaxLength(50) taxCode?: string;
  @IsOptional() @IsString() description?: string;
}
```

**Response 201.** **Response 409:** `code: COMPANY_NAME_EXISTS` (cùng owner).

### T2.19. GET `/api/companies`

**Query:** `?page=1&limit=20&search=&industry=&size=&view=grid|table`

**Response 200:** mảng company, mỗi item kèm `contactCount`, `openDealCount`, `openDealValue` (aggregate từ `crm_contacts`, `sales_deals` — **inject `SalesDealService`** để tính open deal value, xem Phần 4).

### T2.20. GET `/api/companies/:id`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 5, "name": "Acme Corp", "website": "...", "industry": "IT", "size": "100-500", "phone": "...", "address": "...", "taxCode": "...", "description": "...",
    "contactCount": 8, "openDealCount": 3, "openDealValue": 450000000,
    "ownerId": 1, "createdAt": "..."
  }
}
```

### T2.21. PUT `/api/companies/:id` — Cập nhật
### T2.22. DELETE `/api/companies/:id` — Xóa (soft)

---

## Nhóm D — TAGS & LEAD SOURCES (4 task)

### T2.23. GET `/api/tags` — Danh sách tag

**Auth:** Authenticated
**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": "vip", "label": "VIP", "color": "#8B5CF6", "bgColor": "#EDE9FE" }
  ]
}
```

### T2.24. POST `/api/tags` — Tạo tag (Admin)

**Auth:** Authenticated, **Role:** admin
**Request DTO:** `{ "id": "hot-lead", "label": "Hot Lead", "color": "#FF0000", "bgColor": "#FFE5E5" }`
**Response 201.** **Response 409:** `code: TAG_EXISTS`.

### T2.25. PUT `/api/tags/:id` & DELETE `/api/tags/:id` (Admin)

**Logic DELETE:** chỉ xóa nếu không còn lead nào dùng.

### T2.26. GET/POST/PUT/DELETE `/api/lead-sources` (Admin)

- **Auth:** GET = Authenticated, mutations = Admin.
- **Logic:** danh mục nguồn lead (Website, LinkedIn, Facebook, Referral, Zalo, Quảng cáo). Hỗ trợ reorder.

---

## Nhóm E — ACTIVITIES (6 task)

### T2.27. POST `/api/activities` — Tạo activity

**Request DTO:**
```ts
class CreateActivityDto {
  @IsIn(['call','email','meeting','task']) type: 'call'|'email'|'meeting'|'task';
  @IsString() @MinLength(2) @MaxLength(200) title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() leadId?: number;
  @IsOptional() @IsInt() contactId?: number;
  @IsOptional() @IsInt() companyId?: number;
  @IsOptional() @IsInt() dealId?: number;
  @IsOptional() @IsIn(['lead','contact','company','deal','quote']) relatedType?: string;
  @IsOptional() @IsInt() relatedId?: number;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsDateString() remindAt?: string;
  @IsOptional() @IsIn(['high','medium','low']) priority?: 'high'|'medium'|'low';
  @IsOptional() recurrence?: { freq: 'daily'|'weekly'|'monthly'; interval: number; until?: string };
}
```

**Response 201:** activity vừa tạo.

**Logic:** insert `crm_activities`. Nếu có `recurrence` → insert `crm_activity_recurrences(activity_id, freq, interval, until)`. Auto-set `status='pending'`. Nếu `relatedType`+`relatedId` được truyền → validate tồn tại (nếu là deal thì inject `SalesDealService` để check).

### T2.28. GET `/api/activities` — Danh sách

**Query:** `?page=1&limit=20&type=&status=pending|completed|overdue&priority=&dueFrom=&dueTo=&relatedType=&relatedId=&view=list|calendar|today`

**Response 200 (view='list'):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "type": "call", "title": "Gọi lại John", "description": "...", "dueDate": "2026-06-17T14:00:00Z",
      "remindAt": null, "status": "pending", "priority": "high", "ownerId": 1,
      "relatedType": "lead", "relatedId": 123, "recurrence": null, "completedAt": null }
  ],
  "meta": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
}
```

**Response 200 (view='today'):**
```json
{
  "success": true,
  "data": {
    "overdue": [...],
    "today": [...],
    "upcoming": [...],
    "todayReminders": [
      { "id": 1, "leadId": 123, "leadName": "John", "date": "2026-06-16", "time": "09:00", "note": "...", "status": "pending" }
    ]
  }
}
```

**Logic:** bucket theo `dueDate` so với NOW (timezone `Asia/Ho_Chi_Minh`). `overdue` = `status='pending' AND due_date < NOW`. `today` = `DATE(due_date) = TODAY`. `upcoming` = `DATE(due_date) > TODAY`. Lấy thêm reminder hôm nay từ `crm_lead_reminders` join `crm_leads`.

### T2.29. GET `/api/activities/:id` — Chi tiết

### T2.30. PUT `/api/activities/:id` — Cập nhật

**Logic:** cho phép update mọi field. Nếu đổi `recurrence` → upsert `crm_activity_recurrences`.

### T2.31. POST `/api/activities/:id/complete` — Đánh dấu hoàn thành

**Request body:** rỗng.
**Response 200:** activity sau khi complete.

**Logic:**
- Set `status='completed'`, `completed_at = NOW`.
- Nếu có `recurrence` → tạo activity MỚI với `due_date = nextOccurrence(current.due_date, rule)`, status='pending', owner = current user. Link với `parent_id` (nếu schema hỗ trợ) hoặc tách riêng.

### T2.32. DELETE `/api/activities/:id` — Xóa

**Response 204.** Soft delete.

---

## Nhóm F — TIMELINE (3 task)

### T2.33. GET `/api/timeline` — Lấy timeline (polymorphic)

**Query:** `?recordType=lead|contact|company|deal|quote|activity&recordId=...&type=all|note|call|email|meeting|task|system&page=1&limit=50`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "type": "note", "title": "Ghi chú từ Admin", "content": "Đã gọi điện...", "meta": {}, "mentions": [2,3], "createdBy": 1, "createdByName": "Admin", "createdAt": "2026-06-16T10:00:00Z" },
    { "id": 2, "type": "system", "title": "Lead qualified", "content": "Lead đã được qualified bởi Admin", "meta": { "oldStatus": "contacted", "newStatus": "qualified" }, "createdBy": 1, "createdAt": "..." }
  ],
  "meta": { "page": 1, "limit": 50, "total": 25, "totalPages": 1 }
}
```

### T2.34. POST `/api/timeline` — Thêm item

**Request DTO:**
```ts
class CreateTimelineItemDto {
  @IsIn(['lead','contact','company','deal','quote','activity']) recordType: string;
  @IsInt() recordId: number;
  @IsIn(['note','call','email','meeting','task','system']) type: string;
  @IsOptional() @IsString() @MaxLength(200) title?: string;
  @IsString() @MaxLength(5000) content: string;
  @IsOptional() meta?: Record<string, any>;
  @IsOptional() @IsArray() @IsInt({ each: true }) mentions?: number[];
}
```

**Response 201:** item vừa tạo.

**Logic:**
- Insert `crm_timeline_items`.
- Parse `mentions` (số user_id) → gọi `NotificationService.createMany(userIds, {type:'mention', title, link, ...})`.

### T2.35. GET `/api/timeline/filters` — Danh sách filter (tùy chọn)

**Response 200:**
```json
{ "success": true, "data": { "types": ["note","call","email","meeting","task","system"] } }
```

---

## Nhóm G — ATTACHMENTS (3 task)

### T2.36. POST `/api/attachments` — Upload file

**Auth:** Authenticated
**Request:** `multipart/form-data` với field `file` (≤10MB, allow: PDF/DOC/DOCX/XLS/XLSX/PNG/JPG/TXT) + fields `recordType`, `recordId`.

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1, "fileName": "contract.pdf", "mimeType": "application/pdf", "sizeBytes": 524288,
    "url": "/api/attachments/1/download", "uploadedBy": 1, "createdAt": "..."
  }
}
```

**Response 413:** quá 10MB. **Response 415:** MIME không hợp lệ.

**Logic:**
- Lưu file vào `uploads/<yyyy>/<mm>/<uuid>.<ext>`.
- Insert `crm_attachments`.
- Trả URL download qua API T2.38.

### T2.37. DELETE `/api/attachments/:id`

**Response 204.** Xóa file vật lý + row.

### T2.38. GET `/api/attachments/:id/download` — Download file

**Response 200:** stream file với header `Content-Disposition: attachment`.

---

## Nhóm H — EMAIL TEMPLATES (3 task)

### T2.39. GET `/api/email-templates` — Danh sách

**Query:** `?ownerId=me|all&shared=true|false`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Mẫu chào hàng", "subject": "Chào {{contact.name}}", "body": "...", "ownerId": 1, "isShared": true }
  ]
}
```

### T2.40. POST `/api/email-templates` — Tạo

**Request DTO:** `{ name, subject, body, isShared }`
**Response 201.**

### T2.41. PUT `/api/email-templates/:id` & DELETE

**Logic:** chỉ owner hoặc admin (nếu shared) được sửa/xóa. Nếu dùng placeholder `{{contact.name}}` → validate bằng regex `/^\{\{[a-zA-Z._]+\}\}$/`.

---

## Nhóm I — DISTRIBUTION (3 task)

### T2.42. GET `/api/distribution/summary` — Tổng quan (Admin)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "unassignedCount": 12, "poolCount": 5, "activeRuleCount": 3, "assignedTodayCount": 8
  }
}
```

**Logic:** count từ `crm_leads` (`owner_id IS NULL OR in_pool=true`), `crm_distribution_rules` (active), `crm_lead_assignments` (created_at >= TODAY).

### T2.43. GET `/api/distribution/assignable` — Lead có thể gán

**Query:** `?search=&source=&status=&page=1&limit=20`

**Response 200:** mảng lead chưa assign hoặc đang trong pool (chỉ admin).

### T2.44. POST `/api/distribution/assign` — Gán lead cho user

**Request DTO:**
```ts
class AssignLeadsDto {
  @IsArray() @ArrayMinSize(1) @IsInt({ each: true }) leadIds: number[];
  @IsInt() toUserId: number;
  @IsOptional() @IsString() note?: string;
}
```

**Response 200:** `{ "success": true, "data": { "assigned": 5 } }`

**Logic:**
- Với mỗi lead: update `owner_id = toUserId`, `in_pool = false`.
- Insert `crm_lead_assignments(lead_id, to_user_id, method='manual', assigned_by=currentUser)`.
- Trigger `NotificationService.create({type:'assignment', userId: toUserId, ...})`.
- Audit log `action='assign'`.

### T2.45. POST `/api/distribution/apply-rules` — Áp dụng rules tự động

**Response 200:**
```json
{
  "success": true,
  "data": {
    "assignedCount": 12,
    "details": [
      { "leadId": 1, "leadName": "...", "userName": "Staff A", "ruleName": "Source=LinkedIn" }
    ]
  }
}
```

**Logic:**
- Load tất cả `crm_distribution_rules` ORDER BY priority ASC, is_active=true.
- Với mỗi rule: parse `conditions` (JSON), match với lead unassigned/in-pool. Áp dụng `action` (assign theo `strategy`: round_robin / least_load / first_available / pool).
- Insert `crm_lead_assignments(method='auto_assign', ruleId)`.
- Notification + audit.

### T2.46. CRUD `/api/distribution/rules` (5 sub-endpoint: list/create/update/delete/toggle)

- **Auth:** Role admin
- **Body:** `{ name, priority, isActive, conditions: RuleCondition[], action: RuleAction }`
- **Logic:** validate JSON `conditions` + `action`. Nếu `strategy='least_load'` → gọi `IamUserService` (hoặc đếm lead/deal qua Dev 1/3 service).

### T2.47. GET/PUT `/api/distribution/pool-config` — Cấu hình pool

**Response 200:** `{ enabled: true, claimLimit: 5 }`
**Logic:** upsert `crm_pool_config` (1 dòng).

---

## Nhóm J — LEAD ASSIGNMENT HISTORY (1 task)

### T2.48. GET `/api/leads/:id/assignments` — Lịch sử gán

**Response 200:** mảng `LeadAssignment` (from_user, to_user, method, rule, note, created_at).

---

## Export contract (Interface) Dev 2 phải expose cho module khác

Đặt tại `src/modules/crm-core/interfaces/`:

```ts
// CrmLeadService — dùng cho Sales (convert), Platform (search/report)
export const CRM_LEAD_SERVICE = Symbol('CRM_LEAD_SERVICE');
export interface ICrmLeadService {
  findById(id: number): Promise<LeadDto | null>;
  findByIds(ids: number[]): Promise<LeadDto[]>;
  searchForPicker(query: string, limit?: number): Promise<PickerItem[]>;
  countByOwner(ownerId: number): Promise<number>;
  countUnassigned(): Promise<number>;
  countInPool(): Promise<number>;
  // cho Platform report
  countByStatus(status: string, ownerId?: number): Promise<number>;
  countBySource(source: string, ownerId?: number): Promise<number>;
  // cho convert lead → deal (Sales gọi)
  convertToContact(input: { leadId: number; name?: string; email?: string; phone?: string; companyId?: number }): Promise<{ contactId: number }>;
  markQualified(leadId: number, by: number): Promise<void>;
}

// CrmContactService — cho Sales (deal), Platform (search/report)
export const CRM_CONTACT_SERVICE = Symbol('CRM_CONTACT_SERVICE');
export interface ICrmContactService {
  findById(id: number): Promise<ContactDto | null>;
  findByIds(ids: number[]): Promise<ContactDto[]>;
  searchForPicker(query: string, companyId?: number, limit?: number): Promise<PickerItem[]>;
  countByCompany(companyId: number): Promise<number>;
}

// CrmCompanyService — cho Sales, Platform
export const CRM_COMPANY_SERVICE = Symbol('CRM_COMPANY_SERVICE');
export interface ICrmCompanyService {
  findById(id: number): Promise<CompanyDto | null>;
  findByIds(ids: number[]): Promise<CompanyDto[]>;
  searchForPicker(query: string, limit?: number): Promise<PickerItem[]>;
  openDealValueByCompany(companyId: number): Promise<number>;   // aggregate sales_deals
  openDealCountByCompany(companyId: number): Promise<number>;
}

// CrmActivityService — cho Sales (ghi activity cho deal), Platform (report)
export const CRM_ACTIVITY_SERVICE = Symbol('CRM_ACTIVITY_SERVICE');
export interface ICrmActivityService {
  create(input: CreateActivityInput): Promise<ActivityDto>;
  countByDeal(dealId: number): Promise<number>;
  countPendingByOwner(ownerId: number): Promise<number>;
  countByStage(stage: string, from: Date, to: Date): Promise<number>;
}

// CrmTimelineService — cho Sales (ghi timeline khi đổi stage deal), Platform
export const CRM_TIMELINE_SERVICE = Symbol('CRM_TIMELINE_SERVICE');
export interface ICrmTimelineService {
  add(input: AddTimelineInput): Promise<TimelineItemDto>;
  listByRecord(recordType: string, recordId: number, type?: string, page?: number, limit?: number): Promise<{ data: TimelineItemDto[]; total: number }>;
}

// CrmAttachmentService — cho Sales
export const CRM_ATTACHMENT_SERVICE = Symbol('CRM_ATTACHMENT_SERVICE');
export interface ICrmAttachmentService {
  upload(input: { recordType: string; recordId: number; file: Buffer; fileName: string; mimeType: string; userId: number }): Promise<AttachmentDto>;
  delete(id: number, byUserId: number): Promise<void>;
  listByRecord(recordType: string, recordId: number): Promise<AttachmentDto[]>;
}

// CrmTagService, CrmLeadSourceService, CrmEmailTemplateService — cho Platform settings
export const CRM_TAG_SERVICE = Symbol('CRM_TAG_SERVICE');
export interface ICrmTagService {
  listAll(): Promise<TagDto[]>;
  getByIds(ids: string[]): Promise<TagDto[]>;
}
```

Tất cả service này được `export` trong `CrmCoreModule` (xem Phần 4).
