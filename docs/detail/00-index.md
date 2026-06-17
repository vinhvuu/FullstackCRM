# Bản Kế Hoạch Backend NestJS + MySQL — VanhCorp CRM

> **Tech Lead:** Văn H.
> **Ngày lập:** 2026-06-16
> **Version:** 1.0
> **Phạm vi:** Toàn bộ Backend cho ứng dụng **VanhCorp CRM** (FE đã hoàn thiện 100%).
> **Mục tiêu:** Chia việc cho 4 Dev BE sao cho **không xung đột Git**, có **API Contract rõ ràng**, có **Hợp đồng Service** chốt sẵn giữa các Module.

---

## Mục lục

1. [Phần 1 — Thiết kế Cơ sở dữ liệu tổng quan](./01-database-design.md)
2. [Phần 2 — Phân chia Module độc lập cho 4 Dev](./02-modules-and-devs.md)
3. Phần 3 — Đặc tả Yêu cầu Kỹ thuật (Technical Requirement) cho từng Task
   - [Dev 1 — Module IAM](./03-tech-requirements-dev1-iam.md) (22 task)
   - [Dev 2 — Module CRM Core](./03-tech-requirements-dev2-crm.md) (38 task)
   - [Dev 3 — Module Sales](./03-tech-requirements-dev3-sales.md) (28 task)
   - [Dev 4 — Module Platform & Analytics](./03-tech-requirements-dev4-platform.md) (32 task)
4. [Phần 4 — Các điểm giao thoa & Hợp đồng Service](./04-integration-contracts.md)
5. [Phụ lục — Quy ước chung](./99-appendix-conventions.md)

---

## Tổng quan Frontend (Input cho BE)

Dựa trên codebase FE hiện tại (`app/(auth)/*`, `app/(dashboard)/*`, `components/*`, `lib/*`, `types/index.ts`), các nhóm màn hình đã có làm căn cứ để thiết kế API:

### Auth & User
- `/login`, `/register` — đăng nhập, đăng ký
- `/settings` (Profile, Notifications, Password, Language, Email Templates, Email Signature)
- `/settings/team` — quản lý thành viên trong team

### Admin (`/admin/*` — yêu cầu role `admin`)
- `/admin` — Tổng quan: KPI, hiệu suất nhân viên, cảnh báo, audit gần đây
- `/admin/users` — Quản lý người dùng, mời user, đổi role, khóa tài khoản
- `/admin/leads` — Chia lead: Manual / Rules / Pool
- `/admin/audit` — Nhật ký thao tác, filter + export CSV
- `/admin/settings` — Cấu hình: Chung / Nguồn lead / Tag / SLA & Pool

### CRM Core
- `/` (Dashboard) — KPI, AI score, biểu đồ xu hướng, AI Insights, recent deals
- `/leads` (table + kanban) — CRUD lead, filter nâng cao, sort, bulk, chat, saved views
- `/leads/[id]` — Chi tiết lead, timeline, reminders, convert to deal
- `/contacts` (cards) — CRUD contact, search
- `/contacts/[id]` — Chi tiết contact, timeline, related deals
- `/companies` (grid + table) — CRUD company, search, industry/size filter
- `/companies/[id]` — Chi tiết company, stats, timeline, related contacts/deals
- `/activities` (list + calendar + today) — CRUD activity, recurrence, priority

### Sales Pipeline
- `/deals` (kanban) — Pipeline, drag-drop, rotting filter
- `/deals/[id]` — Chi tiết deal, line items, won/lost dialog
- `/products` — Catalog sản phẩm
- `/quotes` — Danh sách báo giá
- `/quotes/[id]` (và `/quotes/new`) — Tạo/sửa báo giá, line items, gửi/duyệt

### Analytics & Support
- `/reports` — Báo cáo preset, KPI tổng hợp
- `/reports/builder` — Tự tạo report (entity/chart/dimension/measure/filter)
- `/goals` — Personal & Team goals, theo dõi tiến độ
- `/import` — Wizard import CSV (lead/contact/company)
- `/settings` (Email Templates) — CRUD template
- Command Palette (Ctrl+K) — global search leads/contacts/companies/deals
- Notification Bell — auto-poll 30s

---

## Nguyên tắc cốt lõi của toàn bộ kế hoạch

1. **Modular Monolith NestJS** — 4 feature module độc lập (`iam`, `crm-core`, `sales`, `platform`) chạy chung 1 process, mỗi module có thư mục riêng.
2. **Mỗi Dev sở hữu 1 module** — chỉ `git add` trong thư mục của mình. File chung (common, app.module.ts, package.json) do Tech Lead maintain.
3. **Shared tables** — chỉ Owner được sửa schema; module khác chỉ đọc/ghi qua **Service export** (DI của NestJS).
4. **API Contract** — mỗi task có endpoint, DTO, response mẫu, status code rõ ràng. Dev FE chỉ cần đọc Phần 3 là tích hợp được.
5. **Service Contract** — trước khi code, mỗi cặp module có giao thoa phải chốt **interface** của service được inject (Phần 4).
