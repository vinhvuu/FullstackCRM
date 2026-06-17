# 09 — Data Model bổ sung & Implementation Roadmap

> Gộp toàn bộ entity mới phía người dùng + lộ trình triển khai theo phase. Bám kiến trúc backend
> trong `docs/`/`plans/` (vanilla Node + SQLite + better-sqlite3). Bổ sung cho schema gốc & `admindocs/03`.

## 1. Bản đồ entity tổng thể (sau khi mở rộng)

```
users (admindocs) ──owns──┐
                          ▼
companies ──< contacts >── deals ──< deal_line_items >── products
   │            │           │  │                          │
   │            │           │  └──< deal_contacts          │
   │            │           │                              │
   └──< activities (lead|contact|deal|company) >──┐        │
        emails / calls / notes / attachments ─────┘        │
                                                  quotes ──< quote_line_items
                          notifications, saved_views,
                          custom_field_defs/values, goals, report_defs
```

## 2. Bảng mới (SQL — tóm tắt, idempotent `IF NOT EXISTS`)

```sql
-- Companies / Accounts
CREATE TABLE companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, website TEXT, industry TEXT, size TEXT,
  phone TEXT, address TEXT, tax_code TEXT, description TEXT,
  owner_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
-- contacts: thêm company_id, owner_id, tags
ALTER TABLE contacts ADD COLUMN company_id INTEGER REFERENCES companies(id);

-- Deals: làm dày
ALTER TABLE deals ADD COLUMN pipeline_id INTEGER;
ALTER TABLE deals ADD COLUMN company_id INTEGER REFERENCES companies(id);
ALTER TABLE deals ADD COLUMN status TEXT DEFAULT 'open' CHECK(status IN ('open','won','lost'));
ALTER TABLE deals ADD COLUMN won_at DATETIME;
ALTER TABLE deals ADD COLUMN lost_at DATETIME;
ALTER TABLE deals ADD COLUMN loss_reason TEXT;
ALTER TABLE deals ADD COLUMN competitor TEXT;
ALTER TABLE deals ADD COLUMN stage_entered_at DATETIME;

CREATE TABLE pipelines (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, stages TEXT /*JSON*/);
CREATE TABLE deal_line_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT, deal_id INTEGER NOT NULL,
  product_id INTEGER, name TEXT, qty REAL DEFAULT 1, unit_price REAL DEFAULT 0,
  discount_pct REAL DEFAULT 0, total REAL DEFAULT 0,
  FOREIGN KEY (deal_id) REFERENCES deals(id)
);
CREATE TABLE deal_contacts (
  deal_id INTEGER, contact_id INTEGER, role TEXT,
  PRIMARY KEY (deal_id, contact_id)
);

-- Activities: làm dày (mở rộng bảng gốc)
ALTER TABLE activities ADD COLUMN priority TEXT DEFAULT 'medium';
ALTER TABLE activities ADD COLUMN related_type TEXT;   -- lead|contact|deal|company
ALTER TABLE activities ADD COLUMN related_id INTEGER;
ALTER TABLE activities ADD COLUMN remind_at DATETIME;
ALTER TABLE activities ADD COLUMN recurrence TEXT;     -- JSON

-- Communication
CREATE TABLE emails (id INTEGER PRIMARY KEY AUTOINCREMENT, related_type TEXT, related_id INTEGER,
  to_addr TEXT, cc TEXT, bcc TEXT, subject TEXT, body TEXT, direction TEXT,
  status TEXT, sent_by INTEGER, sent_at DATETIME);
CREATE TABLE calls (id INTEGER PRIMARY KEY AUTOINCREMENT, related_type TEXT, related_id INTEGER,
  direction TEXT, outcome TEXT, duration_min INTEGER, note TEXT, logged_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, related_type TEXT, related_id INTEGER,
  body TEXT, mentions TEXT /*JSON*/, created_by INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE attachments (id INTEGER PRIMARY KEY AUTOINCREMENT, related_type TEXT, related_id INTEGER,
  file_name TEXT, mime_type TEXT, size_bytes INTEGER, url TEXT, uploaded_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE email_templates (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, subject TEXT,
  body TEXT, owner_id INTEGER, is_shared INTEGER DEFAULT 0);

-- Products & Quotes
CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, name TEXT NOT NULL,
  group_name TEXT, unit_price REAL DEFAULT 0, currency TEXT DEFAULT 'VND', unit TEXT,
  default_tax_pct REAL DEFAULT 0, description TEXT, is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, number TEXT, title TEXT,
  deal_id INTEGER, company_id INTEGER, contact_id INTEGER, status TEXT DEFAULT 'draft',
  valid_until DATE, subtotal REAL, discount_total REAL, tax_total REAL, total REAL,
  currency TEXT DEFAULT 'VND', terms TEXT, owner_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, sent_at DATETIME, decided_at DATETIME);
CREATE TABLE quote_line_items (id INTEGER PRIMARY KEY AUTOINCREMENT, quote_id INTEGER,
  product_id INTEGER, name TEXT, qty REAL, unit_price REAL, discount_pct REAL, tax_pct REAL, total REAL);

-- Productivity
CREATE TABLE notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, type TEXT,
  title TEXT, body TEXT, link TEXT, is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE saved_views (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, entity TEXT,
  name TEXT, filters TEXT, columns TEXT, sort TEXT, is_shared INTEGER DEFAULT 0);
CREATE TABLE custom_field_defs (id INTEGER PRIMARY KEY AUTOINCREMENT, entity TEXT, key TEXT,
  label TEXT, type TEXT, options TEXT, required INTEGER DEFAULT 0, ord INTEGER DEFAULT 0);
CREATE TABLE custom_field_values (entity TEXT, record_id INTEGER, field_key TEXT, value TEXT,
  PRIMARY KEY (entity, record_id, field_key));

-- Analytics
CREATE TABLE report_defs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, entity TEXT,
  chart_type TEXT, dimension TEXT, measure TEXT, filters TEXT, owner_id INTEGER, is_shared INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE goals (id INTEGER PRIMARY KEY AUTOINCREMENT, owner_id INTEGER, is_team INTEGER DEFAULT 0,
  period TEXT, period_key TEXT, metric TEXT, target REAL);
CREATE TABLE dashboard_layouts (user_id INTEGER PRIMARY KEY, widgets TEXT /*JSON*/);
```

> Index khuyến nghị: mọi bảng có `related_type/related_id` → index ghép; `owner_id`, `company_id`,
> `deal_id`, `quote_id`, `(entity, record_id)`.

## 3. TypeScript types — gom về `types/index.ts`
Đã liệt kê rải rác ở các file 02–08. Gom thành nhóm: `Company`, `Deal(mở rộng)`, `DealLineItem`,
`DealContact`, `Pipeline`, `Activity(mở rộng)`, `EmailLog`, `CallLog`, `Note`, `Attachment`,
`EmailTemplate`, `Product`, `Quote`, `QuoteLineItem`, `Notification`, `SavedView`, `CustomFieldDef`,
`CustomFieldValue`, `ReportDef`, `Goal`, `DashboardLayout`.

## 4. Component dùng chung quan trọng nhất
| Component | Dùng ở | Lý do tách |
|-----------|--------|-----------|
| `RecordTimeline` + `TimelineComposer` | lead, contact, deal, company | Hợp nhất giao tiếp (02,03,05) |
| `RelatedListPanel` | company/deal (contacts/deals/activities) | Hiển thị quan hệ |
| `DataTable` + `BulkBar` + `Pagination` | mọi danh sách | Đồng nhất (đã định nghĩa ở admindocs/08) |
| `EntityPicker` (select-or-create) | company/product/contact | Liên kết & dedupe |
| `EmptyState`/`Skeleton`/`ErrorState` | mọi màn | States chuẩn |

## 5. Roadmap theo phase (phía người dùng)

> Tiền đề: backend foundation + auth + persistence (theo `plans/phase_1..4`) đang/đã làm.
> Các phase dưới tập trung **nghiệp vụ người dùng**, có thể chạy song song với admindocs.

### Phase U1 — Nền tảng records & timeline  **[M]**
- Tạo entity **Company**; gắn `company_id` cho contact/deal.
- Tách **RecordTimeline** dùng chung; áp cho lead/contact/deal/company.
- Contact/Company detail + CRUD thật + related lists.
- States chuẩn (empty/loading/error) + i18n VI nền tảng.
**DoD:** Lead, Contact, Company liên kết & có timeline; CRUD lưu thật.
→ Tài liệu: [02], [05] §2.

### Phase U2 — Deal sâu  **[M]**
- Deal timeline (từ U1), **win/loss + lý do**, **stage_entered_at** + deal rotting.
- **Line items** (cần Product tối thiểu — làm Product cơ bản trong phase này).
- Nhiều contact + vai trò trên deal.
**DoD:** Deal có timeline, sản phẩm, win/loss; kanban hiển thị tổng theo cột.
→ [03], [06] §2.

### Phase U3 — Activities & Calendar  **[M]**
- Calendar view; task priority/recurring; auto-overdue; "My Day".
- Liên kết activity ↔ record + tạo từ trong record.
**DoD:** 3 chế độ xem; nhắc nhở hợp nhất; quá hạn tự tính.
→ [04].

### Phase U4 — Communication  **[M/S]**
- Email log/compose + template; call logging; note @mention; **attachments**.
**DoD:** Mọi tương tác log tập trung trên timeline; đính kèm file.
→ [05].

### Phase U5 — Products & Quotes  **[M]**
- Catalog sản phẩm đầy đủ; quote builder; **xuất PDF**; liên kết deal↔quote.
**DoD:** Tạo báo giá từ deal & xuất PDF; chuyển trạng thái quote.
→ [06].

### Phase U6 — Productivity platform  **[M/S]**
- **Global search/command palette**; **Import CSV** + **Export thật**; **Notification center**;
  Saved views; Custom fields; Settings cá nhân hoạt động + i18n hoàn chỉnh.
**DoD:** Tìm xuyên record; nhập/xuất dữ liệu; thông báo real-time cơ bản.
→ [07].

### Phase U7 — Analytics nâng cao  **[M/S]**
- Report builder + presets + drill-down; **Quota/Goals**; Forecast; dashboard widget cấu hình; leaderboard [C].
**DoD:** Tự dựng báo cáo; theo dõi quota; forecast committed/best-case/pipeline.
→ [08].

## 6. Sơ đồ phụ thuộc
```
(backend+auth+persistence: plans/phase_1..4)
        │
        ▼
U1 records+timeline ──▶ U2 deal sâu ──▶ U5 products/quotes
        │                   │
        ├──▶ U3 activities/calendar
        ├──▶ U4 communication (cần timeline U1)
        └──▶ U6 productivity ──▶ U7 analytics (cần dữ liệu U2..U5)
```
**Thứ tự khuyến nghị:** U1 → U2 → U3 → U4 → U5 → U6 → U7.
Song song được: sau U1, (U3) và (U4) có thể làm cùng nhánh với (U2→U5).

## 7. Ước lượng độ lớn
| Phase | Độ lớn | Ghi chú |
|-------|:------:|--------|
| U1 | L | Entity mới + refactor timeline dùng chung |
| U2 | L | Line items + win/loss + multi-pipeline |
| U3 | M | Calendar là phần nặng nhất |
| U4 | M | Email/call/note/attachment |
| U5 | M | PDF là điểm cần thư viện |
| U6 | L | Nhiều tính năng nền tảng |
| U7 | L | Builder + forecast |

## 8. Definition of Done — Enterprise-ready (phía user)
Tham chiếu checklist ở [01] §4. Hoàn tất U1–U7 (Must items) ⇒ đạt chuẩn doanh nghiệp cơ bản;
Should/Could nâng dần theo nhu cầu.

## 9. Rủi ro & lưu ý
- **Refactor timeline (U1)** ảnh hưởng lead detail hiện có — cần test kỹ để không vỡ tính năng lead đang tốt.
- **PDF (U5)** & **email gửi thật (U4)** phụ thuộc thư viện/dịch vụ ngoài — tách "log/manual" (giai đoạn 1) khỏi "gửi thật" (giai đoạn 2) để không chặn tiến độ.
- **Custom fields (EAV)** dễ phình query — giới hạn số field & index hợp lý.
- Mọi tính năng phải tôn trọng **ownership & quyền** đã định ở `admindocs/02`.
- Giữ **một nguồn dữ liệu** — khi backend sẵn sàng, thay `lib/mock-data.ts` bằng API client thống nhất.
