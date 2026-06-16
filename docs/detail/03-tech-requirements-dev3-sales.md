# Phần 3 — Technical Requirement: Dev 3 (Module Sales)

> **Dev 3** sở hữu module `sales/` — Deals, Pipelines, Line Items, Products, Quotes, Loss Reasons, Convert Lead.
> **Tổng task: 28.**
>
> Quy ước Response/Status chung xem file `99-appendix-conventions.md`.

---

## Nhóm A — PIPELINES (4 task)

### T3.1. GET `/api/pipelines` — Danh sách pipeline

**Auth:** Authenticated
**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "New Business", "stages": [
      { "id": "lead", "label": "Lead", "color": "#9CA3AF", "probability": 10 },
      { "id": "qualified", "label": "Qualified", "color": "#3B82F6", "probability": 30 },
      { "id": "proposal", "label": "Proposal", "color": "#F59E0B", "probability": 50 },
      { "id": "negotiation", "label": "Negotiation", "color": "#F97316", "probability": 70 },
      { "id": "won", "label": "Won", "color": "#10B981", "probability": 100 },
      { "id": "lost", "label": "Lost", "color": "#EF4444", "probability": 0 }
    ] },
    { "id": 2, "name": "Renewal", "stages": [...] }
  ]
}
```

### T3.2. POST `/api/pipelines` (Admin)

**Request DTO:** `{ name: string, stages: { id, label, color, probability }[] }`
**Response 201.** Validate `probability` ∈ [0..100], `id` unique trong pipeline.

### T3.3. PUT `/api/pipelines/:id` (Admin)
### T3.4. DELETE `/api/pipelines/:id` (Admin)

**Logic DELETE:** chỉ xóa nếu không còn deal nào dùng.

---

## Nhóm B — DEALS (10 task)

### T3.5. POST `/api/deals` — Tạo deal

**Request DTO:**
```ts
class CreateDealDto {
  @IsString() @MinLength(2) @MaxLength(200) title: string;
  @IsNumber() @Min(0) value: number;
  @IsOptional() @IsIn(['VND','USD']) currency?: 'VND' | 'USD';
  @IsOptional() @IsInt() pipelineId?: number;
  @IsOptional() @IsInt() leadId?: number;
  @IsOptional() @IsInt() contactId?: number;
  @IsOptional() @IsInt() companyId?: number;
  @IsOptional() @IsIn(['lead','qualified','proposal','negotiation','won','lost']) stage?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) probability?: number;
  @IsOptional() @IsDateString() expectedCloseDate?: string;
  @IsOptional() @IsArray() lineItems?: {
    productId?: number; name: string; qty: number; unitPrice: number; discountPct?: number; taxPct?: number;
  }[];
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 5, "title": "...", "value": 50000000, "currency": "VND", "stage": "lead", "probability": 10,
    "status": "open", "pipelineId": 1, "leadId": 123, "contactId": 8, "companyId": 5,
    "expectedCloseDate": "2026-08-30", "stageEnteredAt": "2026-06-16T10:00:00Z",
    "ownerId": 1, "wonAt": null, "lostAt": null, "lossReasonId": null, "competitor": null,
    "lineItems": [...], "createdAt": "...", "updatedAt": "..."
  }
}
```

**Logic DB/Service:**
- Inject `CrmLeadService` để validate `leadId` (nếu có) — KHÔNG tự ý truy cập `crm_leads`.
- Inject `CrmContactService`, `CrmCompanyService` tương tự.
- Insert `sales_deals` với `status='open'`, `stage_entered_at=NOW`.
- Nếu có `lineItems` → insert `sales_deal_line_items`, tính `total` từng dòng = `qty * unitPrice * (1 - discountPct/100) * (1 + taxPct/100)`.
- Insert `sales_deal_stage_history(deal_id, from_stage=null, to_stage=current, by=currentUser)`.
- Nếu `leadId` được truyền → gọi `CrmLeadService.markQualified(leadId, currentUser.id)`.
- Audit log `action='create', entityType='deal'`.

### T3.6. GET `/api/deals` — Danh sách (kanban)

**Query:** `?pipelineId=&stage=&contactId=&companyId=&minValue=&maxValue=&rotting=true&page=1&limit=50`

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 5, "title": "Acme Enterprise", "value": 50000000, "currency": "VND", "stage": "proposal",
      "probability": 50, "status": "open", "contactId": 8, "contactName": "John", "companyName": "Acme Corp",
      "expectedCloseDate": "2026-08-30", "stageEnteredAt": "2026-06-10T10:00:00Z",
      "rotting": false, "ownerId": 1, "ownerName": "Admin" }
  ],
  "meta": { "page": 1, "limit": 50, "total": 25, "totalPages": 1 }
}
```

**Logic:**
- Stage filter (multi), pipeline filter, value range, `rotting=true` → `stage_entered_at < NOW() - 7 days AND status='open'`.
- Include `contactName` (inject `CrmContactService`), `companyName` (inject `CrmCompanyService`).
- Tính `rotting` ở service layer (so với NOW).

### T3.7. GET `/api/deals/board` — Board view (grouped theo stage)

**Query:** `?pipelineId=`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "pipelineId": 1, "pipelineName": "New Business",
    "stages": [
      { "id": "lead", "label": "Lead", "color": "#9CA3AF", "probability": 10, "totalValue": 0, "deals": [...] },
      { "id": "qualified", "label": "Qualified", "color": "#3B82F6", "probability": 30, "totalValue": 120000000, "deals": [...] },
      { "id": "won", "label": "Won", "color": "#10B981", "probability": 100, "totalValue": 500000000, "deals": [...] }
    ]
  }
}
```

**Logic:** group deals theo `stage`. Tính `totalValue` = SUM(value) theo từng stage.

### T3.8. GET `/api/deals/:id` — Chi tiết

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 5, "title": "...", "value": 50000000, "currency": "VND", "stage": "negotiation", "probability": 70,
    "status": "open", "pipelineId": 1, "leadId": 123, "contactId": 8, "contactName": "John", "companyId": 5, "companyName": "Acme",
    "expectedCloseDate": "2026-08-30", "stageEnteredAt": "2026-06-10T10:00:00Z",
    "wonAt": null, "lostAt": null, "lossReasonId": null, "lossReasonLabel": null, "competitor": null,
    "lineItems": [
      { "id": 1, "dealId": 5, "productId": 3, "name": "License Pro", "qty": 10, "unitPrice": 5000000, "discountPct": 10, "taxPct": 10, "total": 49500000 }
    ],
    "stageHistory": [
      { "id": 1, "fromStage": "proposal", "toStage": "negotiation", "byUserId": 1, "createdAt": "..." }
    ],
    "ownerId": 1, "createdAt": "...", "updatedAt": "..."
  }
}
```

### T3.9. PUT `/api/deals/:id` — Cập nhật

**Request DTO:** các field optional, kèm `lineItems` (PUT toàn bộ → xóa cũ + insert mới).

**Logic:**
- Capture before/after để audit.
- Nếu `lineItems` được gửi → xóa hết `sales_deal_line_items WHERE deal_id=:id` rồi insert lại.
- Nếu `stage` đổi → update `stage_entered_at = NOW`, insert `sales_deal_stage_history`.

### T3.10. DELETE `/api/deals/:id` — Xóa (soft)

**Response 204.** Audit log.

### T3.11. PUT `/api/deals/:id/stage` — Đổi stage nhanh (drag-drop kanban)

**Request DTO:** `{ "stage": "negotiation" }`

**Response 200:** deal sau khi update.

**Logic:**
- Validate `stage` thuộc pipeline hiện tại.
- Update `stage` + `stage_entered_at = NOW`.
- Insert `sales_deal_stage_history(fromStage, toStage, byUserId)`.
- Nếu stage mới = 'won' → set `status='won', won_at=NOW`. Nếu 'lost' → KHÔNG tự set (FE phải gọi T3.12 với loss reason).
- Gọi `CrmTimelineService.add({recordType:'deal', recordId, type:'system', title:'Deal moved to ${stage}', ...})`.
- Trigger `NotificationService.create({type:'deal_stage', userId: ownerId, link, ...})`.

### T3.12. POST `/api/deals/:id/mark-won`

**Response 200:** deal với `status='won', won_at=NOW`.
**Audit log** `action='won'`.

### T3.13. POST `/api/deals/:id/mark-lost`

**Request DTO:**
```ts
class MarkLostDto {
  @IsInt() lossReasonId: number;
  @IsOptional() @IsString() @MaxLength(200) competitor?: string;
  @IsOptional() @IsString() @MaxLength(1000) note?: string;
}
```

**Response 200:** deal với `status='lost', lost_at=NOW, loss_reason_id, competitor`.

**Logic:**
- Validate `lossReasonId` tồn tại trong `sales_loss_reasons`.
- Gọi `CrmTimelineService.add({type:'system', title:'Deal lost', meta:{reason, competitor}})`.

### T3.14. POST `/api/deals/convert-from-lead` — Convert Lead (dùng cho modal ở FE lead detail)

- **Phụ thuộc:** `CrmLeadService` (Dev 2) — gọi `convertToContact()`.

**Request DTO:**
```ts
class ConvertFromLeadDto {
  @IsInt() leadId: number;
  @IsString() @MinLength(2) dealTitle: string;
  @IsNumber() @Min(0) dealValue: number;
  @IsIn(['lead','qualified','proposal','negotiation']) dealStage: string;
  @IsDateString() expectedCloseDate: string;
  @IsBoolean() createContact: boolean;
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "dealId": 5, "contactId": 8
  }
}
```

**Logic:**
- Validate `leadId` tồn tại và owner có quyền.
- Nếu `createContact=true` → gọi `CrmLeadService.convertToContact({leadId, ...})` → nhận `contactId`.
- Tạo deal (gọi T3.5 logic).
- Update lead: `status='qualified'`, `score += 10` (optional rule).
- Thêm timeline cho lead: `type='system', title='Converted to deal #${dealId}'`.
- Audit log `action='convert', entityType='lead'`.

---

## Nhóm C — LINE ITEMS (3 task)

### T3.15. POST `/api/deals/:id/line-items` — Thêm dòng

**Request DTO:**
```ts
class CreateLineItemDto {
  @IsOptional() @IsInt() productId?: number;
  @IsString() @MaxLength(200) name: string;
  @IsNumber() @Min(0) qty: number;
  @IsNumber() @Min(0) unitPrice: number;
  @IsOptional() @IsNumber() @Min(0) @Max(100) discountPct?: number;
  @IsOptional() @IsNumber() @Min(0) @Max(100) taxPct?: number;
}
```

**Response 201:** line item (server tính `total`).

### T3.16. PUT `/api/deals/:id/line-items/:lineItemId` — Sửa dòng

**Request DTO:** các field optional. **Response 200.**

### T3.17. DELETE `/api/deals/:id/line-items/:lineItemId` — Xóa dòng

**Response 204.**

---

## Nhóm D — PRODUCTS (5 task)

### T3.18. POST `/api/products`

**Request DTO:**
```ts
class CreateProductDto {
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsString() @MinLength(2) @MaxLength(200) name: string;
  @IsOptional() @IsString() @MaxLength(80) group?: string;
  @IsNumber() @Min(0) unitPrice: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsIn(['VND','USD']) currency?: 'VND' | 'USD';
  @IsOptional() @IsNumber() @Min(0) @Max(100) defaultTaxPct?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
```

**Response 201.** **Response 409:** `code: PRODUCT_CODE_EXISTS` (nếu code trùng).

### T3.19. GET `/api/products`

**Query:** `?page=1&limit=20&search=&group=&isActive=true|false&sortBy=name|code|unitPrice|createdAt&sortDir=asc|desc`

**Response 200:** mảng product + meta.

### T3.20. GET `/api/products/:id`

**Response 200:** product.

### T3.21. PUT `/api/products/:id`

**Logic:** cập nhật các field. Nếu đổi `unitPrice` → không tự động update các line item đang dùng (giữ nguyên giá snapshot).

### T3.22. DELETE `/api/products/:id` — Soft delete

**Logic:** set `is_active=false, deleted_at=NOW`. KHÔNG xóa line item trong deal cũ.

### T3.23. GET `/api/products/picker` — Search cho picker (autocomplete ở quote/deal)

**Query:** `?q=&limit=10`
**Response 200:** `[{ id, code, name, unitPrice, currency, defaultTaxPct }]`

---

## Nhóm E — QUOTES (6 task)

### T3.24. POST `/api/quotes` — Tạo báo giá

**Request DTO:**
```ts
class CreateQuoteDto {
  @IsString() @MinLength(2) title: string;
  @IsOptional() @IsInt() dealId?: number;
  @IsOptional() @IsInt() companyId?: number;
  @IsOptional() @IsInt() contactId?: number;
  @IsOptional() @IsDateString() validUntil?: string;
  @IsOptional() @IsIn(['VND','USD']) currency?: 'VND' | 'USD';
  @IsOptional() @IsString() terms?: string;
  @IsArray() lineItems: {
    productId?: number; name: string; qty: number; unitPrice: number; discountPct?: number; taxPct?: number;
  }[];
}
```

**Response 201:** quote object với `number` tự generate (`Q-YYYY-###`).

**Logic:**
- Generate `number` qua `sales_quote_number_seq` (lock row theo năm, increment).
- Insert `sales_quotes` với `status='draft'`, owner=currentUser.
- Insert `sales_quote_line_items`, tính `subtotal`, `discountTotal`, `taxTotal`, `total`.
- Audit log.

### T3.25. GET `/api/quotes`

**Query:** `?page=1&limit=20&status=draft|sent|accepted|rejected|expired&search=&contactId=&companyId=&dealId=`

**Response 200:** mảng quote (kèm customer name qua inject CrmContactService/CrmCompanyService) + meta.

### T3.26. GET `/api/quotes/:id`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1, "number": "Q-2026-001", "title": "...",
    "dealId": 5, "companyId": 5, "companyName": "Acme Corp", "contactId": 8, "contactName": "John",
    "status": "draft", "validUntil": "2026-07-30",
    "subtotal": 50000000, "discountTotal": 5000000, "taxTotal": 4500000, "total": 49500000,
    "currency": "VND", "terms": "...",
    "lineItems": [...],
    "ownerId": 1, "ownerName": "Admin", "createdAt": "...", "sentAt": null, "decidedAt": null
  }
}
```

### T3.27. PUT `/api/quotes/:id`

**Request DTO:** các field optional + `lineItems` (PUT toàn bộ).
**Logic:** chỉ sửa được khi `status='draft'`. Nếu `status='sent' → chỉ cho phép sửa `terms`.

### T3.28. DELETE `/api/quotes/:id` — Soft delete

**Response 204.** Chỉ xóa khi `status='draft'`.

### T3.29. POST `/api/quotes/:id/send` — Gửi báo giá

**Response 200:** quote với `status='sent', sent_at=NOW`.
**Logic:**
- Update status.
- Trigger `CrmActivityService.create({type:'email', relatedType:'quote', relatedId, ...})` (lưu log).
- Notification cho owner.

### T3.30. POST `/api/quotes/:id/accept`

**Response 200:** quote với `status='accepted', decided_at=NOW`.
**Logic:** nếu quote có `dealId` → optional: gọi `SalesDealService.markWon(dealId)` (cùng module).

### T3.31. POST `/api/quotes/:id/reject`

**Request DTO:** `{ "reason"?: string }`
**Response 200:** quote với `status='rejected', decided_at=NOW`.

---

## Nhóm F — LOSS REASONS (3 task)

### T3.32. GET `/api/loss-reasons` — Danh sách

**Response 200:** `[{ id, label }]`

### T3.33. POST `/api/loss-reasons` (Admin)

**Request DTO:** `{ label: string }`

### T3.34. PUT/DELETE `/api/loss-reasons/:id` (Admin)

---

## Export contract (Interface) Dev 3 phải expose cho module khác

Đặt tại `src/modules/sales/interfaces/`:

```ts
// SalesDealService — dùng cho Platform (report/forecast/goal), CRM Core (open deal count by company)
export const SALES_DEAL_SERVICE = Symbol('SALES_DEAL_SERVICE');
export interface ISalesDealService {
  findById(id: number): Promise<DealDto | null>;
  findByIds(ids: number[]): Promise<DealDto[]>;
  searchForPicker(query: string, limit?: number): Promise<PickerItem[]>;
  countOpenByOwner(ownerId: number): Promise<number>;
  countOpenByCompany(companyId: number): Promise<number>;
  sumOpenValueByCompany(companyId: number): Promise<number>;
  // cho Platform report
  countByStage(stage: string, from: Date, to: Date, ownerId?: number): Promise<number>;
  sumWonValue(from: Date, to: Date, ownerId?: number): Promise<number>;
  weightedValue(from: Date, to: Date, ownerId?: number): Promise<number>;
  groupBySource(from: Date, to: Date, ownerId?: number): Promise<{ source: string; count: number; value: number }[]>;
  groupByStage(from: Date, to: Date, ownerId?: number): Promise<{ stage: string; count: number; value: number }[]>;
  groupByMonth(from: Date, to: Date, ownerId?: number): Promise<{ month: string; count: number; value: number }[]>;
  winRate(from: Date, to: Date, ownerId?: number): Promise<number>;
  // cho Platform goal
  revenueByOwnerInPeriod(ownerId: number, periodKey: string): Promise<number>;
  dealsWonByOwnerInPeriod(ownerId: number, periodKey: string): Promise<number>;
  // cho Platform forecast
  forecastBuckets(periodKey: string, ownerId?: number): Promise<{ committed: number; best_case: number; pipeline: number }>;
}

// SalesProductService — dùng cho Platform search
export const SALES_PRODUCT_SERVICE = Symbol('SALES_PRODUCT_SERVICE');
export interface ISalesProductService {
  findById(id: number): Promise<ProductDto | null>;
  findByIds(ids: number[]): Promise<ProductDto[]>;
  searchForPicker(query: string, limit?: number): Promise<PickerItem[]>;
  isActive(id: number): Promise<boolean>;
}

// SalesQuoteService — chỉ module khác dùng khi cần
export const SALES_QUOTE_SERVICE = Symbol('SALES_QUOTE_SERVICE');
export interface ISalesQuoteService {
  countByOwner(ownerId: number): Promise<number>;
  sumAcceptedTotal(from: Date, to: Date): Promise<number>;
}
```

Tất cả service này được `export` trong `SalesModule` (xem Phần 4).
