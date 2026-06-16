# VanhCorp CRM — User-Side Feature Documentation (userdocs)

> Bộ tài liệu **rà soát nghiệp vụ + kế hoạch phát triển** cho phía **người dùng cuối (sales rep / sales manager)**
> của VanhCorp CRM. Mục tiêu: nâng CRM từ mức "demo đẹp, mỏng tính năng" lên **đạt chuẩn doanh nghiệp**.

**Phiên bản:** 1.0
**Ngày:** 2026-06-07
**Phạm vi:** Toàn bộ tính năng người dùng dùng hằng ngày (Leads, Contacts/Companies, Deals,
Activities, Communication, Products/Quotes, Reports, Productivity). **Không** trùng phần quản trị
(đã có ở `admindocs/`).

---

## 1. Tài liệu gồm những gì

| # | File | Nội dung | Loại |
|---|------|----------|------|
| 00 | [00-overview-gap-analysis.md](./00-overview-gap-analysis.md) | Hiện trạng từng module, gap so với chuẩn doanh nghiệp, mức độ trưởng thành | Tổng quan |
| 01 | [01-feature-catalog-priorities.md](./01-feature-catalog-priorities.md) | Danh mục tính năng đề xuất + ưu tiên MoSCoW | Plan |
| 02 | [02-contacts-companies.md](./02-contacts-companies.md) | Contacts + **Companies/Accounts** (entity còn thiếu) | UX/Spec |
| 03 | [03-deals-pipeline.md](./03-deals-pipeline.md) | Deal timeline, line items, multi-pipeline, won/lost | UX/Spec |
| 04 | [04-activities-tasks-calendar.md](./04-activities-tasks-calendar.md) | Calendar, task nâng cao, "My Day", nhắc việc | UX/Spec |
| 05 | [05-communication-email.md](./05-communication-email.md) | Email, template, notes @mention, log cuộc gọi, file đính kèm | UX/Spec |
| 06 | [06-products-quotes.md](./06-products-quotes.md) | Catalog sản phẩm/bảng giá, báo giá (quote) + PDF | UX/Spec |
| 07 | [07-productivity-platform.md](./07-productivity-platform.md) | Global search, import/export, notification center, custom fields, saved views, i18n | UX/Spec |
| 08 | [08-reports-forecasting-goals.md](./08-reports-forecasting-goals.md) | Report builder, dashboard, quota/goals, forecast, leaderboard | UX/Spec |
| 09 | [09-data-model-and-roadmap.md](./09-data-model-and-roadmap.md) | Types/schema mở rộng + roadmap theo phase, acceptance criteria | Kỹ thuật/Plan |

---

## 2. Đọc theo vai trò

- **Chủ dự án / Product** → 00 → 01 → 09
- **Designer** → 00 → 02..08 (phần wireframe)
- **Backend** → 09 → 02..08 (phần spec/API)
- **Frontend** → 02..08 → 09

---

## 3. Kết luận nhanh (TL;DR)

CRM hiện tại **mạnh về Lead** (kanban, tag, reminder, scoring, convert, timeline) nhưng:

- ❌ **Thiếu hẳn entity Company/Account** — chuẩn doanh nghiệp B2B bắt buộc phải có.
- 🟡 **Deal mỏng** — không có timeline hoạt động, không line items/sản phẩm, một pipeline cứng.
- 🟡 **Contacts sơ sài** — chỉ là card, không liên kết deal/hoạt động, không lịch sử.
- 🟡 **Activities** — list phẳng, không calendar, không độ ưu tiên/lặp lại.
- ❌ **Không có Email / Communication thật**, không template, không log cuộc gọi.
- ❌ **Không có Products & Quotes** (báo giá) — thiếu cho quy trình bán hàng B2B.
- ❌ **Không có Global Search, Import/Export, Notification center, Custom fields, Saved views.**
- 🟡 **Reports tĩnh** — không builder, không forecast, không quota/goals, export không chạy.
- 🟡 **Settings không lưu**, ngôn ngữ lẫn lộn VI/EN.

Chi tiết & kế hoạch khắc phục ở các file tương ứng.

---

## 4. Quan hệ với tài liệu khác

- `admindocs/` — phần quản trị (user mgmt, RBAC, chia lead, audit). **Bổ trợ, không trùng.**
- `docs/`, `plans/` — nền tảng backend & các tính năng lead đã làm. `userdocs` kế thừa data model ở đó.
- Khi mâu thuẫn về **tính năng người dùng**, `userdocs` là nguồn chuẩn.

## 5. Quy ước
- ✅ đã có · 🟡 có một phần · ❌ chưa có
- Wireframe bằng ASCII; tuân thủ design system hiện có (primary `#6366F1`, radius 16px, Poppins/Open Sans).
- Mọi đề xuất gắn nhãn ưu tiên: **[M]** Must · **[S]** Should · **[C]** Could.
