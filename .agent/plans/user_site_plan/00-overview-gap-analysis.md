# 00 — Tổng quan & Gap Analysis (phía người dùng)

## 1. Khung đánh giá: CRM chuẩn doanh nghiệp gồm gì?

Một CRM bán hàng đạt chuẩn doanh nghiệp (đối chiếu Salesforce, HubSpot, Zoho, Pipedrive) cần đủ
các trụ cột sau ở phía người dùng:

| # | Trụ cột | Cấu phần lõi |
|---|---------|--------------|
| 1 | **Quản lý quan hệ (Records)** | Lead, Contact (người), **Company/Account (tổ chức)**, quan hệ giữa chúng |
| 2 | **Pipeline & Deal** | Nhiều pipeline, kéo-thả, **line items/sản phẩm**, win/loss + lý do |
| 3 | **Hoạt động & Lịch** | Task có ưu tiên/lặp lại, **calendar**, nhật ký gọi/họp, "việc hôm nay" |
| 4 | **Giao tiếp (Communication)** | **Email gửi & log**, template, ghi chú @mention, đính kèm file |
| 5 | **Bán hàng (Sales tooling)** | **Catalog sản phẩm/bảng giá**, **báo giá (quote) + PDF** |
| 6 | **Năng suất (Productivity)** | **Global search**, **import/export**, **notification**, custom fields, saved views |
| 7 | **Phân tích (Analytics)** | **Report builder**, dashboard, **forecast**, **quota/goals**, leaderboard |
| 8 | **Nền tảng (Platform)** | Auth/quyền (đã có ở admindocs), audit, i18n, mobile, hiệu năng |

Dưới đây chấm điểm hiện trạng từng trụ cột.

---

## 2. Bảng chấm trưởng thành (Maturity scorecard)

Thang: 0 = không có · 1 = sơ khai · 2 = dùng được cơ bản · 3 = đạt chuẩn doanh nghiệp

| Trụ cột | Hiện trạng | Điểm | Khoảng cách chính |
|---------|-----------|:----:|-------------------|
| Lead | Kanban, tag, reminder, score, convert, timeline | **2.5** | Dữ liệu mock, chưa lưu thật; chưa có lead web-to-form, dedupe |
| Contact | Card grid + search; có trang detail | **1** | Không có Company, không liên kết deal/activity, không lịch sử |
| **Company/Account** | Không tồn tại | **0** | Thiếu hoàn toàn — chặn nhiều nghiệp vụ B2B |
| Deal/Pipeline | Kanban 1 pipeline, drag-drop, detail cơ bản | **1.5** | Không timeline, không line items, 1 pipeline cứng, không lý do thua |
| Activities/Tasks | List + filter trạng thái | **1** | Không calendar, không ưu tiên/lặp lại, không gắn record rõ |
| **Communication/Email** | Nút "Email" chỉ scroll tới form note | **0.5** | Không gửi/log email, không template, không đính kèm |
| **Products & Quotes** | Không có | **0** | Thiếu hoàn toàn — không tạo được báo giá |
| Global Search | Không có | **0** | Không tìm xuyên record; điều hướng thủ công |
| Import/Export | "Export" tĩnh, không chạy | **0.5** | Không nhập CSV, không xuất thật |
| Notifications | Settings bật/tắt tĩnh | **0.5** | Không có notification center/real-time |
| Custom fields / Saved views | Không có | **0** | Không tùy biến field, không lưu bộ lọc |
| Reports/Analytics | 4 chart tĩnh | **1** | Không builder, không forecast, không quota |
| Settings (cá nhân) | Form tĩnh, không lưu | **0.5** | Không lưu, không i18n nhất quán |

**Điểm trung bình ~0.8/3** → đẹp về UI nhưng còn xa chuẩn doanh nghiệp về chiều sâu nghiệp vụ.

---

## 3. Gap analysis chi tiết theo module

### 3.1 Leads — `app/(dashboard)/leads/*` 🟡 (mạnh nhất)
**Đang có:** bảng + kanban, filter nâng cao & nhanh, bulk select, tag tùy biến, reminder
(date/time, snooze, complete), lead score, convert→deal, timeline tương tác, chatbox.
**Thiếu so với chuẩn:**
- Tất cả là **mock/local state** → reload mất dữ liệu (phụ thuộc backend ở `plans/`).
- Không **web-to-lead form** (thu lead từ website/landing).
- Không **chống trùng (dedupe)** khi tạo lead/contact.
- Không **lead nurturing / cadence** (chuỗi follow-up tự động).
- Score là tĩnh theo field, chưa có công thức cấu hình.
- Quick action "Call/Email" **không thực sự gọi/gửi** — chỉ cuộn tới form ghi chú.

### 3.2 Contacts — `app/(dashboard)/contacts/*` 🟡→❌
**Đang có:** grid card (tên, công ty, email, phone, vị trí), search, trang detail.
**Thiếu nghiêm trọng:**
- **Không có entity Company/Account** — `company` chỉ là chuỗi text trên contact. Không gom được
  nhiều contact về một tổ chức, không xem "tất cả deal của công ty X".
- Contact **không liên kết** với deal/activity/email (không có "lịch sử khách hàng").
- Không **timeline** trên contact (mọi tương tác).
- Không nhiều địa chỉ/nhiều số điện thoại, không social, không owner hiển thị.
- Add/Edit/Delete **chưa hoạt động thật** (nút tĩnh).

### 3.3 Deals — `app/(dashboard)/deals/*` 🟡
**Đang có:** pipeline kanban 6 stage, kéo-thả, deal card, detail (giá trị, xác suất, stage list, contact liên quan).
**Thiếu so với chuẩn:**
- **Không timeline hoạt động** trên deal (khác hẳn lead detail vốn có timeline) → không thấy lịch sử.
- **Không line items/sản phẩm** → giá trị deal nhập tay, không tính từ sản phẩm.
- **Chỉ 1 pipeline** cứng; doanh nghiệp thường cần nhiều pipeline (vd: New Business / Renewal).
- **Không lý do thắng/thua** (won/lost reason) → không phân tích được vì sao mất deal.
- Không **deal rotting** (cảnh báo deal "ì" lâu không đổi stage).
- Không gắn nhiều contact (vai trò: người quyết định, ảnh hưởng...).
- Edit/Delete tĩnh; không có activity kế tiếp bắt buộc.

### 3.4 Activities — `app/(dashboard)/activities/*` 🟡
**Đang có:** list activity (call/email/meeting/task), filter theo trạng thái, add/edit/delete (local), đổi trạng thái.
**Thiếu so với chuẩn:**
- **Không calendar view** (ngày/tuần/tháng).
- **Không độ ưu tiên**, không **task lặp lại (recurring)**.
- Không **"My Day"/Today** tổng hợp việc đến hạn xuyên mọi record.
- Không **liên kết rõ** activity ↔ lead/contact/deal trong UI (type có field nhưng không hiển thị/điều hướng).
- Không nhắc nhở real-time/thông báo khi tới hạn.
- `overdue` set thủ công, không tự động theo `dueDate`.

### 3.5 Reports — `app/(dashboard)/reports/*` 🟡
**Đang có:** 4 biểu đồ (revenue trend, lead sources, leads vs deals, deal stages) từ mock.
**Thiếu so với chuẩn:**
- **Không report builder** (tự chọn chiều/đo lường/bộ lọc).
- **Không forecast** doanh thu, **không quota/goals** & tiến độ.
- **Không leaderboard**, không so sánh theo nhân viên/kỳ.
- **Export không hoạt động**; không lịch gửi báo cáo định kỳ.
- Không drill-down từ chart vào danh sách record.

### 3.6 Settings — `app/(dashboard)/settings/*` 🟡
**Đang có:** form profile + preferences (tĩnh), trang team (tĩnh).
**Thiếu:** không **lưu** gì; không đổi mật khẩu thật; **i18n lẫn lộn** (tiêu đề EN, nội dung VI);
không cấu hình hiển thị (mật độ bảng, cột); không chữ ký email.

### 3.7 Dashboard — `app/(dashboard)/page.tsx` 🟡
**Đang có:** stat cards, AI score, chart 6 tháng, recent deals, AI insights.
**Thiếu:** không cá nhân hóa theo user thật; widget không cấu hình; **không "việc hôm nay"/"deal cần chú ý"**;
số liệu mock không phản ánh quyền sở hữu.

---

## 4. Những thứ thiếu xuyên suốt (cross-cutting)

1. **Persistence thật** — toàn bộ dùng `lib/mock-data.ts`; cần backend (đã hoạch định ở `plans/`).
2. **Global search / command palette** — không tìm nhanh được lead/contact/deal.
3. **Notification center** — không có chuông thông báo, không real-time.
4. **Import/Export** — không nhập CSV (onboarding dữ liệu), export giả.
5. **File attachments** — không đính kèm tài liệu vào record.
6. **Custom fields & saved views** — không tùy biến theo nghiệp vụ doanh nghiệp.
7. **i18n** — chưa thống nhất; doanh nghiệp VN cần tiếng Việt hoàn chỉnh (+ tùy chọn EN).
8. **Mobile/responsive sâu** — một số bảng chưa tối ưu màn nhỏ.
9. **Empty/loading/error states** — nhiều trang thiếu.
10. **Audit ở mức record** (ai sửa gì) — gắn với admindocs nhưng cần lộ ở UI record.

---

## 5. Định hướng khắc phục (tóm tắt — chi tiết ở 01 & 09)

- **Nền tảng dữ liệu trước:** thêm **Company/Account**, gắn quan hệ Contact↔Company↔Deal↔Activity.
- **Làm dày Deal & Contact:** timeline thống nhất (dùng lại pattern timeline của lead), line items.
- **Bổ sung trụ cột thiếu:** Email/Communication, Products/Quotes, Global search, Import/Export, Notifications.
- **Nâng Analytics:** report builder + forecast + quota.
- **Hoàn thiện nền tảng UX:** custom fields, saved views, i18n, states chuẩn.

> Thứ tự ưu tiên và lộ trình cụ thể: xem [01-feature-catalog-priorities.md](./01-feature-catalog-priorities.md)
> và [09-data-model-and-roadmap.md](./09-data-model-and-roadmap.md).
