# 07 — Productivity & Platform UX

> Các tính năng "xương sống" giúp dùng CRM hằng ngày hiệu quả mà hiện đang thiếu:
> **Global search, Import/Export, Notification center, Custom fields, Saved views, i18n**.

## 1. Global Search / Command Palette [M]

### 1.1 Vấn đề
Không có cách tìm nhanh xuyên record; phải vào từng trang. Doanh nghiệp cần tìm tức thì + điều hướng nhanh.

### 1.2 UX
- Phím tắt **Ctrl/Cmd + K** mở command palette (đặt ở header, icon 🔍).
- Tìm xuyên: Lead, Contact, Company, Deal, Quote, Product + **hành động nhanh** (tạo lead, đi tới trang).
```
┌────────────────────────────────────────────────────┐
│  🔍 Tìm hoặc gõ lệnh...                       Ctrl+K │
│  ──────────────────────────────────────────────────  │
│  KẾT QUẢ                                              │
│  👤 Nguyễn Văn A — ABC Corp (Contact)                │
│  🏢 ABC Corp (Company)                               │
│  💰 Triển khai ERP — 800tr (Deal)                    │
│  ──────────────────────────────────────────────────  │
│  HÀNH ĐỘNG                                            │
│  ＋ Tạo lead mới        ＋ Tạo deal       → Đi tới Báo cáo│
└────────────────────────────────────────────────────┘
```
- Kết quả nhóm theo loại; ↑↓ chọn, Enter mở; gần đây (recent) khi chưa gõ.
- API: `GET /api/search?q=` trả kết quả đa entity (giới hạn mỗi loại + tổng).

## 2. Import / Export [M]

### 2.1 Import CSV (onboarding dữ liệu)
Quan trọng để doanh nghiệp **đưa dữ liệu hiện có vào** (lead/contact/company/product).
```
┌──────────────────────────────────────────────────────────────┐
│  Nhập dữ liệu — Bước 2/3: Khớp cột                            │
│  ──────────────────────────────────────────────────────────  │
│  Cột trong file        →   Trường CRM                         │
│  "Họ tên"              →   [ Tên ▾ ]                          │
│  "Cty"                →   [ Công ty ▾ ]                       │
│  "Mail"               →   [ Email ▾ ]                         │
│  "SĐT"                →   [ Điện thoại ▾ ]                    │
│  ──────────────────────────────────────────────────────────  │
│  Khi trùng:  (•) Bỏ qua  ( ) Cập nhật  ( ) Tạo mới           │
│  ☑ Bỏ dòng lỗi và tiếp tục                                   │
│              [← Quay lại]  [ Xem trước ]  [ Nhập 245 dòng ]   │
└──────────────────────────────────────────────────────────────┘
```
- 3 bước: tải file → khớp cột → xem trước & xác nhận.
- Báo cáo kết quả: thành công / bỏ qua / lỗi (tải file lỗi để sửa).
- Dùng luật dedupe ([02] §5).

### 2.2 Export thật [M]
- "Export" hiện tĩnh → xuất **CSV/Excel** theo bộ lọc & cột đang hiển thị.
- Áp ở: Leads, Contacts, Companies, Deals, Activities, Quotes, Reports.
- Tôn trọng quyền (user chỉ xuất dữ liệu của mình).

## 3. Notification Center [M]
```
Header:  🔔(3)  ← chuông + badge
┌────────────────────────────────────────────┐
│  Thông báo                      [Đọc hết]   │
│  ──────────────────────────────────────────  │
│  ● Bạn được giao 2 lead mới       2 phút     │
│  ● @Vũ E nhắc bạn trong deal ABC  1 giờ      │
│  ● Task "Gọi Nguyễn A" quá hạn    3 giờ      │
│  ○ Reminder: theo dõi Hoàng Mai   hôm qua    │
│              [ Xem tất cả → ]                 │
└────────────────────────────────────────────┘
```
- Nguồn: được giao lead ([admindocs] chia lead), @mention ([05]), task/reminder đến hạn ([04]),
  deal đổi stage, quote được chấp nhận.
- Real-time: polling đơn giản (giai đoạn 1) hoặc SSE/WebSocket (giai đoạn 2).
- Trang `/notifications` đầy đủ + lọc theo loại; đánh dấu đã đọc.

## 4. Custom Fields [S]
- Cho phép thêm trường tùy biến theo entity (Lead/Contact/Company/Deal): text, số, ngày, chọn, checkbox.
- Hiển thị trong form & detail; lọc/sort theo custom field.
- Quản trị field thuộc cấu hình (giao với admindocs); người dùng nhập giá trị.
```
Định nghĩa: { entity, key, label, type, options?, required, order }
Giá trị:    { entity, recordId, fieldKey, value }  (EAV)
```

## 5. Saved Views / Bộ lọc lưu [S]
- Lưu tổ hợp bộ lọc + cột + sắp xếp thành "view" đặt tên (vd "Lead nóng tuần này").
- Hiển thị dạng tab/dropdown ở đầu danh sách; chia sẻ view [C].
- Tận dụng query-string filter sẵn có → lưu thành bản ghi `saved_views`.

## 6. Bulk edit nâng cao [S]
- Mở rộng bulk hiện có (leads) cho mọi danh sách: đổi owner, đổi stage/status, thêm/bớt tag,
  thêm vào chuỗi follow-up, xóa — với xác nhận và giới hạn quyền.

## 7. i18n — Tiếng Việt hoàn chỉnh [M]
- Hiện UI **lẫn lộn VI/EN** (vd tiêu đề "Leads/Reports" tiếng Anh, nội dung tiếng Việt).
- Chuẩn hóa: hệ thống i18n (vi mặc định, en tùy chọn), tách chuỗi ra file ngôn ngữ.
- Định dạng ngày/giờ/tiền tệ theo locale VN (đã có `formatCurrency`/`formatDate` — mở rộng).
- Bộ chọn ngôn ngữ trong settings cá nhân.

## 8. Settings cá nhân — làm cho hoạt động [M]
Nâng cấp `settings/page.tsx` (hiện form tĩnh không lưu):
- Lưu profile thật; **đổi mật khẩu** thật.
- Tùy chọn: ngôn ngữ, múi giờ, mật độ bảng (compact/comfortable), cột mặc định.
- **Chữ ký email** ([05]); quản lý **email template** cá nhân.
- Notification preferences thật (bật/tắt từng loại) — nối với §3.

## 9. States chuẩn & responsive [M]
- Mọi danh sách/detail: **loading skeleton, empty state, error + retry**.
- Responsive: bảng → card ở mobile; dialog full-screen ở mobile; calendar gọn.

## 10. Data model (chi tiết [09])
```ts
interface Notification {
  id; userId; type; title; body?; link?; isRead; createdAt;
}
interface SavedView { id; userId; entity; name; filters; columns; sort; isShared; }
interface CustomFieldDef { id; entity; key; label; type; options?; required; order; }
interface CustomFieldValue { entity; recordId; fieldKey; value; }
interface ImportJob { id; entity; status; total; success; skipped; failed; createdBy; createdAt; }
```

## 11. API (chi tiết [09])
```
GET /api/search?q=
POST /api/imports (upload+map)   GET /api/imports/:id (kết quả)
GET /api/<entity>/export?format=csv&filters=
GET /api/notifications  PUT /api/notifications/:id/read  PUT /api/notifications/read-all
GET/POST/DELETE /api/saved-views
GET /api/custom-fields?entity=   PUT /api/<entity>/:id/custom-fields
```

## 12. Component
`CommandPalette`, `GlobalSearchResults`, `ImportWizard` (3 bước), `ColumnMapper`, `ExportButton` (thật),
`NotificationBell`, `NotificationList`, `CustomFieldRenderer`, `SavedViewTabs`, `LanguageSwitcher`,
`Skeleton`, `EmptyState`, `ErrorState`.

## 13. Acceptance criteria
- [ ] Ctrl/Cmd+K mở search; tìm & điều hướng tới mọi loại record.
- [ ] Import CSV (khớp cột, dedupe, báo cáo kết quả) cho lead/contact/company/product.
- [ ] Export CSV/Excel thật theo bộ lọc & quyền.
- [ ] Chuông thông báo + trang notifications; đánh dấu đã đọc; real-time cơ bản.
- [ ] Custom field hiển thị trong form/detail và lọc được.
- [ ] Saved views lưu/khôi phục bộ lọc; UI tiếng Việt nhất quán + chuyển EN.
- [ ] Settings cá nhân lưu thật, đổi mật khẩu được.
