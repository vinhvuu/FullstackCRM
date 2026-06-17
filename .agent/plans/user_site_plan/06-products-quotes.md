# 06 — Products & Quotes (Báo giá)

> Thiếu hoàn toàn. Quy trình bán B2B cần **catalog sản phẩm/bảng giá** và **báo giá (quote)** xuất PDF.
> Gắn chặt với line items của deal ([03] §5).

## 1. Mục tiêu
- **Product catalog**: danh mục sản phẩm/dịch vụ + đơn giá (price book).
- **Quote builder**: tạo báo giá từ deal (hoặc độc lập), chiết khấu/thuế, xuất **PDF**.
- Vòng đời quote: nháp → gửi → chấp nhận/từ chối → (chốt deal).

## 2. Product catalog `/products` (route mới)

### 2.1 Danh sách
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Sản phẩm & Dịch vụ                                  [⭱ Nhập] [+ Thêm sản phẩm] │
│  🔍 Tìm...   [Nhóm ▾] [Trạng thái ▾]                                           │
│                                                                                │
│  MÃ SP     TÊN                  NHÓM        ĐƠN GIÁ       ĐVT     TRẠNG THÁI ⋮ │
│  ──────────────────────────────────────────────────────────────────────────  │
│  ERP-001   ERP Core License     Phần mềm    500.000.000  gói     ● Active   ⋮ │
│  SVC-010   Triển khai & đào tạo Dịch vụ     200.000.000  gói     ● Active   ⋮ │
│  SVC-020   Bảo trì năm          Dịch vụ     100.000.000  năm     ● Active   ⋮ │
│  ──────────────────────────────────────────────────────────────────────────  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Form sản phẩm
```
Mã SP           [ ERP-001 ]
Tên *           [ ERP Core License ]
Nhóm            [ Phần mềm ▾ ]
Đơn giá *       [ 500.000.000 ]   Tiền tệ [ VND ▾ ]
Đơn vị tính     [ gói ]
Thuế mặc định   [ VAT 10% ▾ ]
Mô tả           [ textarea ]
Trạng thái      [● Active]
                                              [Hủy] [Lưu]
```
> Nhiều bảng giá (price book) theo phân khúc là [C] — giai đoạn sau.

## 3. Quotes `/quotes` (route mới)

### 3.1 Danh sách báo giá
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Báo giá                                                      [+ Tạo báo giá]   │
│  🔍 ...  [Trạng thái ▾]                                                        │
│  SỐ BG      TIÊU ĐỀ              KHÁCH HÀNG   GIÁ TRỊ      TRẠNG THÁI   NGÀY  ⋮ │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Q-2026-001 Triển khai ERP       ABC Corp     869tr       ◐ Đã gửi     06/06 ⋮ │
│  Q-2026-002 Gói bảo trì          XYZ Ltd      110tr       ● Chấp nhận  04/06 ⋮ │
│  ──────────────────────────────────────────────────────────────────────────  │
└──────────────────────────────────────────────────────────────────────────────┘
```
Trạng thái: `draft` (nháp) · `sent` (đã gửi) · `accepted` (chấp nhận) · `rejected` (từ chối) · `expired`.

### 3.2 Quote builder
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Tạo báo giá  ←  Deal: Triển khai ERP (ABC Corp)                               │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Tiêu đề   [ Báo giá triển khai ERP ]      Hiệu lực đến [ 30/06/2026 ]         │
│  Khách hàng [ 🏢 ABC Corp / Nguyễn A ]                                          │
│                                                                                │
│  DÒNG SẢN PHẨM                              SL   ĐƠN GIÁ      CK%   THÀNH TIỀN  │
│  ──────────────────────────────────────────────────────────────────────────  │
│  [🔍 ERP Core License        ▾]            1    500.000.000  0     500.000.000 │
│  [🔍 Triển khai & đào tạo     ▾]            1    200.000.000  0     200.000.000 │
│  [🔍 Bảo trì năm              ▾]            1    100.000.000  10     90.000.000 │
│  [+ Thêm dòng]                                                                 │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Ghi chú/điều khoản [ textarea ]              Tạm tính:        790.000.000      │
│                                              Chiết khấu tổng:  [ 0 ]            │
│                                              Thuế VAT 10%:      79.000.000      │
│                                              ─────────────────────────────     │
│                                              TỔNG CỘNG:        869.000.000      │
│  ──────────────────────────────────────────────────────────────────────────  │
│  [ Lưu nháp ]   [ Xem trước PDF ]   [ Xuất PDF ]   [ Đánh dấu đã gửi ]         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Xuất PDF [M]
- Mẫu PDF có: logo/tên công ty, thông tin khách hàng, bảng dòng sản phẩm, tổng tiền, điều khoản, chữ ký.
- Triển khai: render HTML → PDF (vd thư viện PDF phía server, hoặc print-to-PDF của trình duyệt cho giai đoạn đầu).
- Lưu file PDF vào attachments của deal/quote (liên kết [05] §6).

## 4. Liên kết Deal ↔ Quote
- Nút "Tạo báo giá" trên deal ([03]) prefill line items.
- Quote `accepted` → gợi ý cập nhật giá trị deal & chuyển stage (Won).
- Một deal có thể có nhiều phiên bản báo giá (versioning [C]).

## 5. Data model (chi tiết [09])
```ts
interface Product {
  id; code?; name; group?; unitPrice; currency:'VND'|'USD';
  unit?; defaultTaxPct?; description?; isActive; createdAt;
}
interface Quote {
  id; number; title; dealId?; companyId?; contactId?;
  status:'draft'|'sent'|'accepted'|'rejected'|'expired';
  validUntil?; subtotal; discountTotal; taxTotal; total; currency;
  terms?; ownerId; createdAt; sentAt?; decidedAt?;
}
interface QuoteLineItem { id; quoteId; productId?; name; qty; unitPrice; discountPct; taxPct; total; }
```

## 6. API (chi tiết [09])
```
GET/POST/PUT/DELETE /api/products
GET/POST/PUT/DELETE /api/quotes      GET /api/quotes/:id
GET /api/quotes/:id/pdf              PUT /api/quotes/:id/status
POST /api/deals/:id/quotes           (tạo quote từ deal)
```

## 7. Component
`ProductTable`, `ProductFormDialog`, `ProductPicker` (select-or-create, dùng trong line items),
`QuoteList`, `QuoteBuilder`, `QuoteLineItemRow`, `QuoteTotals`, `QuotePdfPreview`, `QuoteStatusBadge`.

## 8. Acceptance criteria
- [ ] Quản lý catalog sản phẩm (CRUD, đơn giá, thuế, đơn vị).
- [ ] Tạo báo giá từ deal với line items prefill; tính tạm tính/chiết khấu/thuế/tổng đúng.
- [ ] Xuất PDF báo giá đúng định dạng; lưu vào file của deal.
- [ ] Chuyển trạng thái báo giá; accepted gợi ý cập nhật deal.
- [ ] Tìm/lọc sản phẩm & báo giá; empty/loading/error đầy đủ.
