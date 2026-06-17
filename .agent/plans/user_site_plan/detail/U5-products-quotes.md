# U5 — Products & Quotes (báo giá + PDF) (Detailed Plan)

> **Giải quyết:** không có catalog sản phẩm & không tạo được báo giá. Tham chiếu: `userdocs/06`.
> **Phụ thuộc:** U2 (deal line items), U1 (`EntityPicker`).

## 0. Mục tiêu & DoD
- **Product catalog** `/products`: CRUD, đơn giá, đơn vị, thuế, trạng thái.
- **Quote builder** `/quotes`: tạo từ deal hoặc độc lập; line items; chiết khấu/thuế/tổng; trạng thái.
- **Xuất PDF** báo giá; lưu vào file của deal (U4 attachments).
- Liên kết Deal ↔ Quote (nút "Tạo báo giá" prefill từ deal line items).

## 1. Phạm vi file

### Tạo mới
```
app/(dashboard)/products/page.tsx
app/(dashboard)/quotes/page.tsx
app/(dashboard)/quotes/[id]/page.tsx           # builder/edit
components/products/product-table.tsx
components/products/product-form-dialog.tsx
components/products/product-picker.tsx          # select-or-create (dùng ở line items)
components/quotes/quote-list.tsx
components/quotes/quote-builder.tsx
components/quotes/quote-line-item-row.tsx
components/quotes/quote-totals.tsx
components/quotes/quote-pdf-preview.tsx
components/quotes/quote-status-badge.tsx
lib/quotes.ts                                   # tính tổng, sinh số BG
lib/pdf.ts                                      # render HTML -> PDF
```

### Sửa
```
types/index.ts                                  # Product, Quote, QuoteLineItem
lib/constants.ts                                # PRODUCT_GROUPS, TAX_RATES, QUOTE_STATUS
lib/mock-data.ts                                # products[], quotes[]
lib/constants.ts (NAV)                          # +Sản phẩm, +Báo giá
app/(dashboard)/deals/[id]/page.tsx             # nút "Tạo báo giá" từ line items (U2)
```

## 2. Data layer

### 2.1 Types
```ts
export interface Product {
  id: string; code?: string; name: string; group?: string;
  unitPrice: number; currency: "VND"|"USD"; unit?: string;
  defaultTaxPct?: number; description?: string; isActive: boolean; createdAt: string;
}
export type QuoteStatus = "draft"|"sent"|"accepted"|"rejected"|"expired";
export interface QuoteLineItem {
  id: string; quoteId: string; productId?: string; name: string;
  qty: number; unitPrice: number; discountPct: number; taxPct: number; total: number;
}
export interface Quote {
  id: string; number: string; title: string;
  dealId?: string; companyId?: string; contactId?: string;
  status: QuoteStatus; validUntil?: string;
  subtotal: number; discountTotal: number; taxTotal: number; total: number;
  currency: "VND"|"USD"; terms?: string; ownerId?: string;
  createdAt: string; sentAt?: string; decidedAt?: string;
}
```

### 2.2 Helpers (`lib/quotes.ts`)
```ts
export function computeQuoteTotals(items: QuoteLineItem[]) {
  const subtotal = items.reduce((s,i)=> s + i.qty*i.unitPrice, 0);
  const discountTotal = items.reduce((s,i)=> s + i.qty*i.unitPrice*(i.discountPct/100), 0);
  const taxable = subtotal - discountTotal;
  const taxTotal = items.reduce((s,i)=> s + (i.qty*i.unitPrice*(1-i.discountPct/100))*(i.taxPct/100), 0);
  return { subtotal, discountTotal, taxTotal, total: taxable + taxTotal };
}
export function nextQuoteNumber(seq: number, year = 2026) { return `Q-${year}-${String(seq).padStart(3,"0")}`; }
```

### 2.3 PDF (`lib/pdf.ts`)
- **Giai đoạn 1 (FE):** dùng `window.print()` trên `QuotePdfPreview` (CSS `@media print`) — không cần lib.
- **Giai đoạn 2 (backend):** render HTML → PDF (vd thư viện PDF server) tại `GET /api/quotes/:id/pdf`; lưu vào attachments.

### 2.4 API (backend)
```
GET/POST/PUT/DELETE /api/products
GET/POST/PUT/DELETE /api/quotes    GET /api/quotes/:id
GET /api/quotes/:id/pdf            PUT /api/quotes/:id/status
POST /api/deals/:id/quotes          (tạo quote từ deal)
```

## 3. UX/UI
- Product list & form: `userdocs/06` §2. Quote list: §3.1. Quote builder: §3.2. PDF: §3.3.
- `ProductPicker` tái dùng ở cả deal line items (U2) và quote line items.

## 4. Component skeleton

### 4.1 `QuoteBuilder`
```tsx
"use client";
// state: lineItems[]; totals = computeQuoteTotals(lineItems)
// header: title, validUntil, khách hàng (company/contact picker)
// table: QuoteLineItemRow[] (ProductPicker | qty | unitPrice | discountPct | taxPct | total)
// footer: QuoteTotals (subtotal/discount/tax/total)
// actions: Lưu nháp | Xem trước PDF | Xuất PDF | Đánh dấu đã gửi
```

### 4.2 `QuotePdfPreview`
```tsx
// layout A4 in được: logo + thông tin cty/khách + bảng line items + tổng + điều khoản + chữ ký
// CSS @media print để window.print() ra PDF sạch
```

## 5. Các bước thực thi
1. [ ] Types Product/Quote/QuoteLineItem; constants groups/tax/status; NAV thêm Sản phẩm + Báo giá.
2. [ ] Mock products[] + quotes[] mẫu.
3. [ ] `products/page.tsx` + `ProductTable` + `ProductFormDialog` (CRUD).
4. [ ] `ProductPicker` (select-or-create) — dùng lại ở deal (U2) & quote.
5. [ ] `lib/quotes.ts` (totals, số BG).
6. [ ] `quotes/page.tsx` + `QuoteList` + `QuoteStatusBadge`.
7. [ ] `quotes/[id]/page.tsx` = `QuoteBuilder` + `QuoteLineItemRow` + `QuoteTotals`.
8. [ ] `QuotePdfPreview` + print CSS (giai đoạn 1).
9. [ ] Nút "Tạo báo giá" trên deal → prefill từ deal line items.
10. [ ] Chuyển trạng thái quote; `accepted` gợi ý cập nhật deal (U2 won).
11. [ ] (Backend) endpoints + PDF server + lưu attachment.
12. [ ] Empty/loading/error; responsive (builder mobile: dòng xếp dọc).

## 6. Test & nghiệm thu
- [ ] CRUD sản phẩm; lọc theo nhóm/trạng thái.
- [ ] Tạo báo giá từ deal: line items prefill đúng; tổng tính chính xác (subtotal/discount/tax/total).
- [ ] Xuất PDF đúng layout; in/PDF sạch.
- [ ] Chuyển trạng thái (draft→sent→accepted/rejected); accepted gợi ý cập nhật deal.
- [ ] Số báo giá tăng đúng định dạng Q-YYYY-NNN.

## 7. Rủi ro & giảm thiểu
- **PDF chất lượng/khác trình duyệt** (giai đoạn print) → có sẵn lộ trình PDF server giai đoạn 2.
- **Sai số tiền do làm tròn** → tính trên số nguyên đồng (VND không có phần lẻ); test các mức chiết khấu/thuế.
- **Đồng bộ line items deal↔quote** → quote là bản chụp (snapshot) tại thời điểm tạo, không ràng buộc 2 chiều.
