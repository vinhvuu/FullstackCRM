# 01 — Danh mục tính năng & Ưu tiên (MoSCoW)

> Tổng hợp toàn bộ tính năng đề xuất cho phía người dùng, gắn mức ưu tiên và tài liệu chi tiết.
> **M** = Must (bắt buộc cho "chuẩn doanh nghiệp") · **S** = Should · **C** = Could (nâng cao/sau).

## 1. Bảng tổng hợp

| Nhóm | Tính năng | Ưu tiên | Trạng thái | Chi tiết |
|------|-----------|:------:|:----------:|----------|
| **Records** | Entity **Company/Account** + quan hệ | **M** | ❌ | [02] |
| | Contact detail có timeline + lịch sử | **M** | 🟡 | [02] |
| | Dedupe contact/company khi tạo | S | ❌ | [02] |
| | Nhiều địa chỉ/SĐT, social, owner | C | ❌ | [02] |
| **Deal** | Deal timeline (hoạt động/ghi chú) | **M** | ❌ | [03] |
| | Line items + sản phẩm trong deal | **M** | ❌ | [03] |
| | Nhiều pipeline | S | ❌ | [03] |
| | Win/Loss + lý do | **M** | ❌ | [03] |
| | Deal rotting (cảnh báo deal ì) | S | ❌ | [03] |
| | Nhiều contact + vai trò trên deal | S | ❌ | [03] |
| **Activities** | Calendar view (ngày/tuần/tháng) | **M** | ❌ | [04] |
| | Task: ưu tiên, lặp lại, gắn record | **M** | 🟡 | [04] |
| | "My Day"/Today tổng hợp | S | ❌ | [04] |
| | Tự động overdue + nhắc nhở | **M** | 🟡 | [04] |
| **Communication** | Gửi & log email từ record | **M** | ❌ | [05] |
| | Email template + biến | S | ❌ | [05] |
| | Ghi chú @mention | S | ❌ | [05] |
| | Log cuộc gọi (call logging) | **M** | 🟡 | [05] |
| | File đính kèm vào record | **M** | ❌ | [05] |
| **Sales tooling** | Catalog sản phẩm + bảng giá | **M** | ❌ | [06] |
| | Báo giá (quote) + xuất PDF | **M** | ❌ | [06] |
| | Chiết khấu, thuế, tổng tiền | S | ❌ | [06] |
| **Productivity** | **Global search / command palette** | **M** | ❌ | [07] |
| | Import CSV (lead/contact/company) | **M** | ❌ | [07] |
| | Export thật (CSV/Excel) | **M** | 🟡 | [07] |
| | Notification center + real-time | **M** | ❌ | [07] |
| | Custom fields theo entity | S | ❌ | [07] |
| | Saved views / bộ lọc lưu lại | S | ❌ | [07] |
| | i18n VI/EN hoàn chỉnh | **M** | 🟡 | [07] |
| | Bulk edit nâng cao | S | 🟡 | [07] |
| **Analytics** | Report builder tùy biến | **M** | ❌ | [08] |
| | Forecast doanh thu | S | ❌ | [08] |
| | Quota/Goals + tiến độ | **M** | ❌ | [08] |
| | Leaderboard | C | ❌ | [08] |
| | Dashboard widget cấu hình | S | ❌ | [08] |
| | Lịch gửi báo cáo định kỳ | C | ❌ | [08] |
| **Platform** | Persistence thật (backend) | **M** | ❌ | `plans/` + [09] |
| | Empty/Loading/Error states | **M** | 🟡 | mọi file |
| | Mobile/responsive sâu | S | 🟡 | mọi file |

## 2. Phân nhóm theo mục tiêu

### 2.1 Must — "đủ để gọi là CRM doanh nghiệp"
Nếu thiếu nhóm này thì chưa thể bán/triển khai cho doanh nghiệp:
1. **Company/Account entity** + quan hệ (nền tảng B2B).
2. **Deal sâu**: timeline, line items, win/loss reason.
3. **Activities + Calendar** + nhắc nhở tự động.
4. **Email/Communication** cơ bản + file đính kèm + call log.
5. **Products & Quotes** (báo giá PDF).
6. **Global search, Import/Export, Notifications, i18n VI**.
7. **Report builder + Quota/Goals**.
8. **Persistence thật** (backend — đã có roadmap riêng ở `plans/`).

### 2.2 Should — tạo khác biệt & hiệu quả
Dedupe, multi-pipeline, deal rotting, email template, @mention, custom fields, saved views,
forecast, dashboard cấu hình, My Day.

### 2.3 Could — nâng cao, làm sau
Nhiều địa chỉ/social, leaderboard, scheduled report, lead nurturing/cadence tự động,
web-to-lead form, công thức scoring cấu hình.

## 3. Bản đồ tính năng ↔ trụ cột doanh nghiệp

```
Trụ cột chuẩn DN            Hiện có   Bổ sung trong userdocs
───────────────────────────────────────────────────────────
1 Records                   Lead✅    +Company❌ +Contact-timeline   → [02]
2 Pipeline & Deal           Kanban🟡  +timeline +line items +win/loss → [03]
3 Hoạt động & Lịch          List🟡    +calendar +task nâng cao         → [04]
4 Communication             —❌       +email +note@mention +call +file → [05]
5 Sales tooling             —❌       +products +quotes/PDF            → [06]
6 Productivity              —❌       +search +import/export +notif +i18n → [07]
7 Analytics                 Charts🟡  +builder +forecast +quota        → [08]
8 Platform                  Auth(WIP) (xem admindocs + plans + [09])
```

## 4. Tiêu chí "đạt chuẩn doanh nghiệp" (Definition of Enterprise-Ready)

Phía người dùng được coi là đạt chuẩn khi:
- [ ] Có đủ 3 loại record lõi: **Lead, Contact, Company** liên kết với nhau.
- [ ] Deal có **timeline + sản phẩm + lý do thắng/thua**, hỗ trợ ≥1 pipeline.
- [ ] Mọi tương tác (gọi/email/họp/ghi chú) được **log tập trung** trên record + có **file đính kèm**.
- [ ] Tạo được **báo giá** từ deal và xuất **PDF**.
- [ ] Có **global search**, **import/export**, **notification**, **tiếng Việt** đầy đủ.
- [ ] Có **report builder** và theo dõi **quota/goal** theo nhân viên.
- [ ] Dữ liệu **lưu thật**, có **empty/loading/error** ở mọi màn, responsive cơ bản.

> Lộ trình triển khai theo phase: [09-data-model-and-roadmap.md](./09-data-model-and-roadmap.md).
