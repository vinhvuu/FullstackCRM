# U1 — Companies + Contact nâng cấp + RecordTimeline (Detailed Plan)

> **Giải quyết:** thiếu entity Company/Account; Contact mỏng (CRUD tĩnh, không lịch sử); timeline chỉ
> nằm ở lead detail. **Đây là phase nền** — tạo `RecordTimeline` & `EntityPicker` dùng lại ở U2–U7.
> Tham chiếu: `userdocs/02`, `userdocs/05` §2.

## 0. Mục tiêu & Definition of Done
- Có entity **Company** với CRUD thật + danh sách + detail + related lists.
- **Contact** liên kết `companyId`, có detail timeline, CRUD thật, chế độ lưới + bảng.
- Tách **`RecordTimeline`** (composer + timeline) từ `leads/[id]` thành component dùng chung cho
  lead/contact/company (và sẵn cho deal ở U2).
- Lead detail **giữ nguyên hành vi** sau refactor.

## 1. Phạm vi file

### Tạo mới
```
app/(dashboard)/companies/page.tsx            # list
app/(dashboard)/companies/[id]/page.tsx       # detail
components/companies/company-table.tsx
components/companies/company-card.tsx
components/companies/company-form-dialog.tsx
components/companies/company-picker.tsx        # select-or-create (EntityPicker dạng company)
components/shared/record-timeline.tsx          # ★ dùng chung
components/shared/timeline-composer.tsx        # ★ tabs note/call/email/meeting/task
components/shared/related-list-panel.tsx       # contacts/deals/activities của 1 record
components/shared/entity-picker.tsx            # generic select-or-create
components/shared/empty-state.tsx
components/shared/error-state.tsx
components/ui/skeleton.tsx
lib/timeline.ts                                # gom interaction từ mock theo record
```

### Sửa
```
types/index.ts                                 # +Company, Contact mở rộng, TimelineItem
lib/mock-data.ts                               # +companies[], gắn companyId cho contacts/leads
lib/constants.ts                               # +NAV thêm "Công ty"; +INDUSTRIES, COMPANY_SIZES
components/layout/sidebar.tsx                   # thêm mục Companies (qua NAV_ITEMS)
app/(dashboard)/contacts/page.tsx              # CRUD thật + bảng + bộ lọc
app/(dashboard)/contacts/[id]/page.tsx         # dùng RecordTimeline + link company
app/(dashboard)/leads/[id]/page.tsx            # thay timeline cục bộ bằng RecordTimeline (giữ hành vi)
```

## 2. Data layer

### 2.1 Types (`types/index.ts`)
```ts
export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;            // "1-10" | "11-50" | "51-200" | "201-500" | "500+"
  phone?: string;
  address?: string;
  taxCode?: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  // computed (tính khi đọc)
  contactCount?: number;
  openDealCount?: number;
  openDealValue?: number;
}

// Contact: mở rộng
export interface Contact {
  id: string; name: string; company: string;   // giữ 'company' text để backward-compat
  companyId?: string;                            // ★ liên kết mới
  email: string; phone: string; position: string;
  ownerId?: string; tags?: string[]; createdAt?: string;
}

// Item hợp nhất cho timeline (note/call/email/meeting/task/system)
export type TimelineItemType = "note" | "call" | "email" | "meeting" | "task" | "system";
export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  content: string;
  createdAt: string;       // ISO hoặc chuỗi hiển thị
  createdBy: string;
  meta?: Record<string, unknown>;   // vd { outcome, durationMin, to, attachments }
}

export type RecordType = "lead" | "contact" | "deal" | "company";
```

### 2.2 Mock (`lib/mock-data.ts`)
```ts
export const companies: Company[] = [
  { id: "c1", name: "Công ty ABC", website: "abc.vn", industry: "Công nghệ",
    size: "51-200", phone: "02812345678", address: "Q1, TP.HCM", ownerId: "u2",
    createdAt: "2026-02-10", description: "Khách hàng tiềm năng mảng ERP" },
  // ...2-3 công ty khớp với company text của leads/contacts hiện có
];
// Gắn companyId cho contacts hiện có dựa trên trùng tên company.
// Helper computed:
export function getCompanyStats(companyId: string) {
  const cs = contacts.filter(c => c.companyId === companyId);
  const ds = deals.filter(d => /* d.companyId === companyId khi U2 */ false);
  return { contactCount: cs.length, openDealCount: ds.length, openDealValue: 0 };
}
```

### 2.3 Timeline source (`lib/timeline.ts`)
```ts
// Giai đoạn mock: tổng hợp interaction sẵn có thành TimelineItem theo record.
// Tái dụng generateMockInteractions hiện có trong leads/[id] (chuyển về đây).
export function getTimeline(recordType: RecordType, recordId: string): TimelineItem[] { /* ... */ }
export function addTimelineItem(recordType: RecordType, recordId: string, item: TimelineItem): void { /* local */ }
```

### 2.4 API (giai đoạn backend — tham chiếu `userdocs/09`)
```
GET/POST/PUT/DELETE /api/companies        GET /api/companies/:id
GET /api/companies/:id/contacts|deals|activities
POST /api/companies/dedupe-check
GET  /api/:recordType/:id/timeline        (gộp note/call/email/meeting/task)
POST /api/:recordType/:id/timeline
```

## 3. UX/UI

### 3.1 Companies list — `/companies`
(wireframe chi tiết: `userdocs/02` §3.1) — bổ sung tương tác:
- Toggle **Lưới/Bảng** (lưu vào query `?view=grid|table`).
- Bộ lọc: ngành, quy mô, chủ sở hữu → query string.
- Nút **+ Thêm công ty** mở `CompanyFormDialog`; **⭱ Nhập** → trỏ tới U6 import.

### 3.2 Company detail — `/companies/[id]`
(wireframe: `userdocs/02` §3.2) — tab: Tổng quan | Liên hệ | Deal | Hoạt động | File.
- Cột trái: thẻ thông tin + tóm tắt (computed).
- Cột phải: `RelatedListPanel` (contacts/deals) + `RecordTimeline`.

### 3.3 Contact detail — `/contacts/[id]` (nâng cấp)
- Header link tới company (`companyId`).
- Body = `RecordTimeline` (thay block tương tác cũ).

## 4. Component skeleton (chính)

### 4.1 `RecordTimeline`
```tsx
"use client";
import { TimelineComposer } from "./timeline-composer";
import { TimelineItem, RecordType } from "@/types";

export function RecordTimeline({
  recordType, recordId, items, onAdd, filter = "all",
}: {
  recordType: RecordType; recordId: string;
  items: TimelineItem[];
  onAdd: (item: Omit<TimelineItem, "id" | "createdAt">) => void;
  filter?: TimelineItemType | "all";
}) {
  // 1) <TimelineComposer onSubmit={onAdd} />
  // 2) filter chips: Tất cả / Ghi chú / Email / Gọi / Họp / Task / File
  // 3) render danh sách items theo pattern timeline ở leads/[id] (lines 472-495)
  //    - dùng cùng typeConfig (icon + màu) — chuyển sang lib/constants để dùng chung
}
```
> **Quan trọng:** copy nguyên cấu trúc markup timeline + composer từ `leads/[id]/page.tsx`
> (form lines 429-470, timeline lines 472-495) để giữ y hệt giao diện lead, rồi tham số hóa.

### 4.2 `CompanyPicker` / `EntityPicker` (select-or-create)
```tsx
// Hiển thị danh sách + ô tìm; nếu không khớp → nút "Tạo '<từ khóa>'" mở form nhanh.
// Dùng trong contact form (chọn company) và sau này deal form.
```

### 4.3 `CompanyFormDialog`
Form theo `userdocs/02` §6, validation: tên bắt buộc; website dùng dedupe-check (cảnh báo `DedupeWarning`).

## 5. Các bước thực thi (checklist)

1. [ ] Thêm types `Company`, mở rộng `Contact`, `TimelineItem`, `RecordType` vào `types/index.ts`.
2. [ ] Thêm `companies[]` vào mock; gắn `companyId` cho contacts/leads theo tên company.
3. [ ] Thêm `INDUSTRIES`, `COMPANY_SIZES` và NAV "Công ty" vào `lib/constants.ts`; cập nhật sidebar.
4. [ ] Tạo `lib/timeline.ts`, chuyển `generateMockInteractions` + `typeConfig` ra đây (dùng chung).
5. [ ] Tạo `components/shared/skeleton|empty-state|error-state`.
6. [ ] Tạo `RecordTimeline` + `TimelineComposer` (port từ lead detail, tham số hóa).
7. [ ] **Refactor `leads/[id]`** dùng `RecordTimeline`; QA so sánh trước/sau (hồi quy).
8. [ ] Tạo `EntityPicker`/`CompanyPicker`, `CompanyFormDialog`, `RelatedListPanel`, `DedupeWarning`.
9. [ ] Tạo `companies/page.tsx` (list, lưới/bảng, lọc) + `company-table`/`company-card`.
10. [ ] Tạo `companies/[id]/page.tsx` (tabs + related + timeline).
11. [ ] Nâng cấp `contacts/page.tsx` (CRUD thật, bảng, lọc) + `contacts/[id]` (timeline + link company).
12. [ ] Empty/loading/error cho mọi màn mới.
13. [ ] (Backend) thay mock bằng API client khi sẵn sàng.

## 6. Test & nghiệm thu
- [ ] Tạo company; tạo/sửa contact gắn company; mở company thấy đúng contact/deal liên quan.
- [ ] Contact & company detail hiển thị timeline; thêm note/call/email/meeting hoạt động.
- [ ] **Lead detail không đổi hành vi** (timeline, convert, reminder vẫn chạy) — checklist hồi quy:
  - thêm interaction, convert to deal, set/complete/snooze reminder, quick actions cuộn form.
- [ ] Dedupe cảnh báo khi trùng website/email.
- [ ] Lưới/bảng + bộ lọc phản ánh query string; reload giữ trạng thái.
- [ ] Responsive: lưới→1 cột, bảng→card; dialog full-screen mobile.

## 7. Rủi ro & giảm thiểu
- **Refactor timeline làm vỡ lead detail** → port nguyên markup + viết checklist hồi quy ở §6; làm trên nhánh riêng.
- **`company` text vs `companyId`** lệch dữ liệu → giữ cả hai field giai đoạn chuyển tiếp; migration map theo tên.
- **Computed stats chậm khi nhiều record** → giai đoạn backend tính bằng query + index `company_id`.
