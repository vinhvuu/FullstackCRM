# U2 — Deals deep: Timeline, Line Items, Win/Loss, Multi-pipeline (Detailed Plan)

> **Giải quyết:** deal detail không có timeline; giá trị nhập tay (không sản phẩm); 1 pipeline cứng;
> không lý do thắng/thua; không cảnh báo deal ì. Tham chiếu: `userdocs/03`, `userdocs/06` §2.
> **Phụ thuộc:** U1 (`RecordTimeline`, `EntityPicker`).

## 0. Mục tiêu & DoD
- Deal detail có **timeline** (dùng `RecordTimeline`).
- **Line items**: thêm sản phẩm vào deal, giá trị deal = tổng line items (override được).
- **Win/Loss flow**: Mark Won/Lost; Lost bắt buộc lý do.
- **Multi-pipeline**: chọn pipeline, mỗi pipeline có bộ stage riêng.
- **Deal rotting**: cảnh báo deal không đổi stage quá N ngày; bộ lọc "Cần chú ý".
- Kanban header hiển thị tổng giá trị + đếm theo cột.

## 1. Phạm vi file

### Tạo mới
```
components/deals/won-dialog.tsx
components/deals/lost-dialog.tsx
components/deals/deal-line-item-table.tsx
components/deals/deal-contacts-panel.tsx
components/deals/deal-rotting-badge.tsx
components/deals/pipeline-selector.tsx
components/deals/deal-stage-stepper.tsx
```

### Sửa
```
types/index.ts                                 # Deal mở rộng, DealLineItem, DealContact, Pipeline, LossReason
lib/constants.ts                               # PIPELINES (thay DEAL_STAGES cứng), LOSS_REASONS, DEAL_ROT_DAYS
lib/mock-data.ts                               # deals gắn companyId/status/stageEnteredAt; +products tối thiểu
app/(dashboard)/deals/page.tsx                 # pipeline selector + header tổng + lọc "cần chú ý"
app/(dashboard)/deals/[id]/page.tsx            # timeline + tab sản phẩm + win/loss + nhiều contact
components/deals/pipeline-board.tsx            # header cột (tổng/đếm), rotting badge, theo pipeline
components/deals/deal-card.tsx                 # badge rotting, avatar chủ, weighted value
```

## 2. Data layer

### 2.1 Types
```ts
export type DealStatus = "open" | "won" | "lost";
export interface Deal {            // mở rộng (giữ field cũ)
  id: string; title: string; value: number; stage: DealStage; probability: number;
  contactId: string; createdAt: string; expectedCloseDate: string;
  pipelineId?: string; companyId?: string; ownerId?: string;
  status?: DealStatus; wonAt?: string; lostAt?: string;
  lossReason?: string; competitor?: string;
  stageEnteredAt?: string;          // cho rotting
}
export interface DealLineItem {
  id: string; dealId: string; productId?: string; name: string;
  qty: number; unitPrice: number; discountPct: number; taxPct?: number; total: number;
}
export interface DealContactRef { dealId: string; contactId: string; role: "decision"|"influencer"|"user"|"primary"; }
export interface PipelineStage { id: string; label: string; color: string; probability: number; }
export interface Pipeline { id: string; name: string; stages: PipelineStage[]; }
export interface LossReason { id: string; label: string; }
```

### 2.2 Constants
```ts
export const PIPELINES: Pipeline[] = [
  { id: "new-business", name: "New Business", stages: [
    { id:"lead", label:"Lead", color:"#818CF8", probability:10 },
    { id:"qualified", label:"Qualified", color:"#6366F1", probability:30 },
    { id:"proposal", label:"Proposal", color:"#8B5CF6", probability:60 },
    { id:"negotiation", label:"Negotiation", color:"#A855F7", probability:80 },
    { id:"won", label:"Won", color:"#10B981", probability:100 },
    { id:"lost", label:"Lost", color:"#EF4444", probability:0 },
  ]},
  { id: "renewal", name: "Renewal", stages: [/* Due, Contacted, Negotiation, Renewed, Churned */] },
];
export const LOSS_REASONS: LossReason[] = [
  { id:"price", label:"Giá cao" }, { id:"competitor", label:"Chọn đối thủ" },
  { id:"budget", label:"Không có ngân sách" }, { id:"timing", label:"Sai thời điểm" },
  { id:"no_response", label:"Không phản hồi" }, { id:"other", label:"Khác" },
];
export const DEAL_ROT_DAYS = 7;   // SLA cảnh báo (sau cấu hình ở settings)
```
> `DEAL_STAGES` cũ → suy ra từ `PIPELINES[0].stages` để backward-compat.

### 2.3 Tính toán (helpers `lib/utils.ts` hoặc `lib/deals.ts`)
```ts
export function lineItemTotal(li: {qty:number;unitPrice:number;discountPct:number}) {
  return li.qty * li.unitPrice * (1 - li.discountPct/100);
}
export function dealTotals(items: DealLineItem[], taxPct = 10) {
  const subtotal = items.reduce((s,i)=>s+i.total,0);
  const tax = subtotal * taxPct/100;
  return { subtotal, tax, total: subtotal + tax };
}
export function isRotting(deal: Deal, rotDays = DEAL_ROT_DAYS) {
  if (!deal.stageEnteredAt || deal.status !== "open") return false;
  const days = (Date.now() - new Date(deal.stageEnteredAt).getTime())/86400000;
  return days > rotDays;
}
export function weightedValue(deal: Deal) { return deal.value * deal.probability/100; }
```

### 2.4 API (backend)
```
PUT /api/deals/:id/stage     (cập nhật stage + stageEnteredAt)
POST /api/deals/:id/won       POST /api/deals/:id/lost
GET/POST/PUT/DELETE /api/deals/:id/line-items
GET/POST/DELETE /api/deals/:id/contacts
GET /api/pipelines
```

## 3. UX/UI
- Deal detail nâng cấp: wireframe `userdocs/03` §2 (tab Hoạt động | Sản phẩm | Liên hệ | File + cảnh báo ì).
- Won/Lost dialog: `userdocs/03` §3.
- Line item table: `userdocs/03` §5 / `userdocs/06` §3.2.
- Kanban: header cột tổng giá trị + đếm; card có rotting badge + avatar.

## 4. Component skeleton

### 4.1 `DealLineItemTable`
```tsx
"use client";
// rows: DealLineItem[]; onChange(rows)
// mỗi dòng: ProductPicker | qty | unitPrice | discountPct | total(auto) | xóa
// footer: subtotal / tax(VAT %) / total; nút "Tạo báo giá" (→ U5)
// value deal = total (cho phép override bằng toggle "Nhập tay")
```

### 4.2 `LostDialog`
```tsx
// bắt buộc chọn lossReason (LOSS_REASONS), competitor optional, note optional
// onConfirm -> set status='lost', lostAt, lossReason, move stage 'lost'
```

### 4.3 `pipeline-board` (sửa)
```tsx
// nhận pipeline (stages từ PIPELINES theo pipelineId đang chọn)
// mỗi cột header: label + đếm + Σ value; thân: deal-card có isRotting badge
```

## 5. Các bước thực thi
1. [ ] Mở rộng types Deal + thêm DealLineItem/DealContactRef/Pipeline/LossReason.
2. [ ] `lib/constants.ts`: PIPELINES, LOSS_REASONS, DEAL_ROT_DAYS; suy `DEAL_STAGES` từ pipeline.
3. [ ] Mock: gắn `companyId`, `status='open'`, `stageEnteredAt` cho deals; thêm vài `products` tối thiểu + line items mẫu.
4. [ ] Helpers tính toán trong `lib/deals.ts`.
5. [ ] `PipelineSelector` + sửa `deals/page.tsx` (chọn pipeline, lọc "Cần chú ý", lưu query).
6. [ ] Sửa `pipeline-board` + `deal-card` (header tổng, rotting, weighted).
7. [ ] `DealLineItemTable` + tab Sản phẩm trong deal detail; nối value deal.
8. [ ] `WonDialog` + `LostDialog` + nút Mark Won/Lost; cập nhật trạng thái + system timeline item.
9. [ ] `DealContactsPanel` (nhiều contact + vai trò).
10. [ ] Nhúng `RecordTimeline` (từ U1) vào deal detail.
11. [ ] `DealStageStepper` hiển thị tiến trình theo pipeline.
12. [ ] Empty/loading/error; responsive.

## 6. Test & nghiệm thu
- [ ] Thêm/sửa/xóa line item; deal value tự cập nhật; override hoạt động.
- [ ] Mark Won set status/wonAt; Mark Lost bắt buộc lý do, lưu competitor.
- [ ] Đổi pipeline đổi bộ stage; kéo-thả card cập nhật `stageEnteredAt`.
- [ ] Deal ì hiện badge; bộ lọc "Cần chú ý" lọc đúng.
- [ ] Kanban header tổng giá trị + đếm chính xác.
- [ ] Deal timeline thêm note/call/email; nhiều contact gắn vai trò.

## 7. Rủi ro & giảm thiểu
- **Đổi `DEAL_STAGES` cứng → pipeline** có thể vỡ deal kanban hiện tại → giữ export `DEAL_STAGES` suy từ `PIPELINES[0]`.
- **Drag-drop hiện có (@dnd-kit)** cần cập nhật `stageEnteredAt` khi đổi cột → test kỹ thứ tự/`order`.
- **value override vs line items** mâu thuẫn → 1 nguồn sự thật: mặc định auto, có cờ override rõ ràng.
