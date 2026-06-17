# userdocs/detail — Detailed Implementation Plans (phía người dùng)

> Plan **implement chi tiết** cho từng vấn đề tồn đọng đã nêu trong `userdocs/` (00–09).
> Mỗi file = một phase (U1–U7), viết để dev **làm theo từng bước**: file đụng tới, types, component,
> API, code skeleton, UX/UI, và checklist nghiệm thu.

**Ngày:** 2026-06-07 · **Cơ sở:** đối chiếu trực tiếp codebase (Next.js 14 App Router, Tailwind, Radix, dnd-kit, recharts).

---

## 1. Danh sách plan

| File | Phase | Giải quyết vấn đề | Ưu tiên |
|------|-------|-------------------|:------:|
| [U1-companies-timeline.md](./U1-companies-timeline.md) | U1 | Thiếu Company entity, contact mỏng, timeline rời rạc | M |
| [U2-deals-deep.md](./U2-deals-deep.md) | U2 | Deal thiếu timeline/sản phẩm/win-loss/multi-pipeline | M |
| [U3-activities-calendar.md](./U3-activities-calendar.md) | U3 | Không calendar, task thiếu ưu tiên/lặp lại, overdue thủ công | M |
| [U4-communication.md](./U4-communication.md) | U4 | Không email/call log thật, không @mention, không file đính kèm | M |
| [U5-products-quotes.md](./U5-products-quotes.md) | U5 | Không có sản phẩm & báo giá PDF | M |
| [U6-productivity.md](./U6-productivity.md) | U6 | Không search/import/export/notification/custom field/i18n/settings | M |
| [U7-analytics.md](./U7-analytics.md) | U7 | Report tĩnh, không quota/forecast/dashboard cấu hình | M/S |

> Tổng quan & lý do từng tính năng: xem `userdocs/00`–`08`. Data model & roadmap gốc: `userdocs/09`.

## 2. Quy ước trong các plan

- **Cấu trúc mỗi plan:** Mục tiêu → Phạm vi file → Data layer (types + mock + API) → UX/UI (wireframe) →
  Component skeleton → Các bước thực thi (checklist) → Test & nghiệm thu → Rủi ro.
- **2 giai đoạn dữ liệu:**
  - **Giai đoạn FE-first (mock):** thêm vào `lib/mock-data.ts` + thao tác local state để chạy UI ngay
    (giống cách codebase đang làm).
  - **Giai đoạn backend:** thay bằng API client thống nhất khi backend (`plans/phase_1..4`) sẵn sàng.
  - Các plan ghi rõ phần nào thuộc giai đoạn nào.
- **Convention bám codebase:** file kebab-case, component PascalCase, `"use client"` cho component
  tương tác, import `@/`, dùng `cn()` (`lib/utils.ts`), tái dùng `components/ui/*`, `formatCurrency`/`formatDate`.
- **Design system:** primary `#6366F1`, cta `#10B981`, radius 16px (`2xl`), Poppins/Open Sans — không tạo theme mới.
- Ký hiệu: ✅ có · 🟡 một phần · ❌ chưa.

## 3. Thứ tự thực hiện khuyến nghị
```
U1 ─▶ U2 ─▶ U5
 ├─▶ U3
 ├─▶ U4         (U4 cần RecordTimeline từ U1)
 └─▶ U6 ─▶ U7   (U7 cần dữ liệu từ U2..U5)
```
Bắt đầu **U1** trước tiên vì nó tạo `RecordTimeline` và `EntityPicker` dùng lại ở hầu hết phase sau.

## 4. Nguyên tắc không phá vỡ
- Module **Lead đang tốt** — khi tách `RecordTimeline` (U1) phải giữ nguyên hành vi lead detail hiện tại.
- Mỗi plan có mục **"Rủi ro & cách giảm thiểu"** nêu điểm dễ vỡ và cách test hồi quy.
