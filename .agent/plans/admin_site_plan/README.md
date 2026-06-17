# VanhCorp CRM — Admin Site Documentation (admindocs)

> Bộ tài liệu thiết kế **UX/UI + kỹ thuật** cho phần Quản trị (Admin) của VanhCorp CRM.
> Mục tiêu: mở rộng CRM từ một app frontend mock-data thành hệ thống có quản trị người dùng,
> phân quyền, chia lead và kiểm soát vận hành đầy đủ.

**Phiên bản:** 1.0
**Ngày:** 2026-06-07
**Phạm vi:** Admin Site (quản lý user, phân quyền, chia lead, audit, cấu hình hệ thống)
**Mô hình phân quyền đã chốt:** 2 cấp — **Admin** / **User** (xem [02](./02-roles-permissions.md))
**Cơ chế chia lead đã chốt:** **Gán thủ công** + **Theo luật (rule-based)** (xem [05](./05-ux-lead-distribution.md))

---

## 1. Bộ tài liệu gồm những gì

| # | File | Nội dung | Loại |
|---|------|----------|------|
| 00 | [00-overview.md](./00-overview.md) | Tầm nhìn, bối cảnh, gap analysis, nguyên tắc thiết kế | Tổng quan |
| 01 | [01-information-architecture.md](./01-information-architecture.md) | Sitemap, điều hướng, cấu trúc route admin | IA |
| 02 | [02-roles-permissions.md](./02-roles-permissions.md) | RBAC 2 cấp, ma trận quyền theo module/action | Kỹ thuật |
| 03 | [03-data-model.md](./03-data-model.md) | Schema mở rộng, TypeScript types, quan hệ dữ liệu | Kỹ thuật |
| 04 | [04-ux-user-management.md](./04-ux-user-management.md) | UX/UI quản lý user, tạo tài khoản, mời, khóa, reset MK | UX/UI |
| 05 | [05-ux-lead-distribution.md](./05-ux-lead-distribution.md) | UX/UI chia lead: gán tay, bulk, rule builder, pool | UX/UI |
| 06 | [06-ux-admin-dashboard-audit-settings.md](./06-ux-admin-dashboard-audit-settings.md) | Admin dashboard, audit log, cấu hình hệ thống | UX/UI |
| 07 | [07-api-spec.md](./07-api-spec.md) | Đặc tả REST API cho toàn bộ tính năng admin | Kỹ thuật |
| 08 | [08-component-spec.md](./08-component-spec.md) | Component tái sử dụng + design tokens admin | UX/UI |
| 09 | [09-implementation-roadmap.md](./09-implementation-roadmap.md) | Kế hoạch triển khai theo phase, acceptance criteria | Plan |
| 10 | [10-missing-admin-ui-implementation-plan.md](./10-missing-admin-ui-implementation-plan.md) | Plan code 3 UI còn thiếu: chia lead, audit, settings | Plan |

---

## 2. Đọc theo vai trò

- **Product / chủ dự án** → 00 → 01 → 04 → 05 → 09
- **Designer (UX/UI)** → 01 → 04 → 05 → 06 → 08
- **Backend dev** → 02 → 03 → 07 → 09
- **Frontend dev** → 01 → 04 → 05 → 06 → 08 → 07

---

## 3. Quan hệ với tài liệu hiện có

Bộ `admindocs` **bổ sung và làm chi tiết hóa** phần admin vốn còn sơ sài:

- `docs/` — tài liệu kiến trúc backend nền tảng (database, API, auth, security). Vẫn còn giá trị.
- `plans/phase_5_admin_access_control.md` — plan admin **cũ, sơ sài** (chỉ CRUD user + audit cơ bản, không có UX/UI). `admindocs` **thay thế và mở rộng** plan này.
- `plans/phase_1..7` — roadmap backend tổng. `admindocs/09` ăn khớp như phần con của Phase 5–6.

> Khi có mâu thuẫn về phần admin, **admindocs là nguồn chuẩn (source of truth)**.

---

## 4. Design system kế thừa (bắt buộc tuân thủ)

Lấy từ `tailwind.config.ts` hiện tại — admin **không tạo theme mới**, dùng lại:

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `primary` | `#6366F1` (hover `#4F46E5`) | Nút chính, link, active nav |
| `cta` | `#10B981` (hover `#059669`) | Hành động xác nhận tích cực |
| `background` | `#F5F3FF` | Nền trang |
| `text-dark` | `#1E1B4B` | Tiêu đề, text chính |
| `text-muted` | `#64748B` | Text phụ, label |
| radius | `2xl=16px`, `xl=12px` | Card, dialog, input |
| font | Poppins (heading), Open Sans (body) | Typography |

Chi tiết mở rộng cho admin (badge role, trạng thái, bảng) ở [08-component-spec.md](./08-component-spec.md).

---

## 5. Trạng thái & quy ước

- ✅ = đã có trong codebase | 🟡 = có một phần | ❌ = chưa có (cần làm)
- Tất cả wireframe dùng ASCII để độc lập công cụ; kèm mô tả layout responsive.
- Route admin nằm dưới nhóm `app/(dashboard)/admin/*`, chỉ Admin truy cập được.
