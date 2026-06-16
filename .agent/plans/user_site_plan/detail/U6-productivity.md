# U6 — Productivity Platform (Detailed Plan)

> **Giải quyết:** không global search; không import/export thật; không notification center;
> không custom fields/saved views; i18n lẫn lộn; settings không lưu. Tham chiếu: `userdocs/07`.
> **Phụ thuộc:** U1 (records để search/import), nhận sự kiện từ U2–U5 (notification).
> Đây là phase nhiều tính năng — có thể chia nhỏ thành U6a..U6f.

## 0. Mục tiêu & DoD
- **Global search / Command palette** (Ctrl/Cmd+K) xuyên record + hành động.
- **Import CSV** (3 bước, khớp cột, dedupe) + **Export thật** (CSV).
- **Notification center** (chuông + trang + real-time cơ bản).
- **Custom fields** theo entity; **Saved views**; **i18n** VI/EN; **Settings** lưu thật.

## 1. Phạm vi file (chia theo nhóm)

### U6a Global search
```
components/search/command-palette.tsx
components/search/global-search-results.tsx
components/layout/header.tsx            # nút search + Ctrl/Cmd+K
lib/search.ts                           # tìm xuyên mock entity
```
### U6b Import/Export
```
app/(dashboard)/import/page.tsx
components/io/import-wizard.tsx
components/io/column-mapper.tsx
components/io/export-button.tsx
lib/csv.ts                              # parse + stringify CSV
```
### U6c Notifications
```
components/notifications/notification-bell.tsx
components/notifications/notification-list.tsx
app/(dashboard)/notifications/page.tsx
lib/notifications.ts                    # tạo/đọc; polling
```
### U6d Custom fields
```
components/fields/custom-field-renderer.tsx
lib/custom-fields.ts
```
### U6e Saved views
```
components/views/saved-view-tabs.tsx
lib/saved-views.ts
```
### U6f i18n + Settings
```
lib/i18n.ts                             # dictionary vi/en + t()
locales/vi.ts  locales/en.ts
components/layout/language-switcher.tsx
app/(dashboard)/settings/page.tsx       # làm cho lưu thật + password + preferences
```

### Sửa chung
```
types/index.ts                          # Notification, SavedView, CustomFieldDef/Value, UserPrefs
lib/mock-data.ts                        # notifications[], customFieldDefs[], savedViews[]
```

## 2. Data layer

### 2.1 Types
```ts
export interface Notification { id:string; userId:string; type:string; title:string; body?:string; link?:string; isRead:boolean; createdAt:string; }
export interface SavedView { id:string; userId:string; entity:RecordType; name:string; filters:Record<string,unknown>; columns:string[]; sort?:string; isShared:boolean; }
export type CustomFieldType = "text"|"number"|"date"|"select"|"checkbox";
export interface CustomFieldDef { id:string; entity:RecordType; key:string; label:string; type:CustomFieldType; options?:string[]; required:boolean; order:number; }
export interface CustomFieldValue { entity:RecordType; recordId:string; fieldKey:string; value:string; }
export interface SearchResult { type:RecordType|"action"; id:string; title:string; subtitle?:string; link:string; }
export interface UserPrefs { language:"vi"|"en"; timezone:string; density:"compact"|"comfortable"; emailSignature?:string; notify:Record<string,boolean>; }
```

### 2.2 Helpers
```ts
// lib/search.ts
export function globalSearch(q: string): SearchResult[] { /* lọc leads/contacts/companies/deals/products + actions */ }
// lib/csv.ts
export function parseCsv(text: string): { headers:string[]; rows:string[][] }
export function toCsv(rows: Record<string,unknown>[], columns: string[]): string
// lib/i18n.ts
export function t(key: string): string  // đọc theo prefs.language
```

### 2.3 API (backend)
```
GET /api/search?q=
POST /api/imports (upload+map+mode)   GET /api/imports/:id
GET /api/:entity/export?format=csv&filters=
GET /api/notifications  PUT /api/notifications/:id/read  PUT /api/notifications/read-all
GET/POST/DELETE /api/saved-views
GET /api/custom-fields?entity=  PUT /api/:entity/:id/custom-fields
GET/PUT /api/me/preferences   PUT /api/auth/change-password
```

## 3. UX/UI (wireframe ở `userdocs/07`)
- Command palette §1.2 · Import wizard §2.1 · Notification §3 · Custom fields §4 · Saved views §5 · i18n §7 · Settings §8.

## 4. Component skeleton (điểm nhấn)

### 4.1 `CommandPalette`
```tsx
"use client";
// mở bằng Ctrl/Cmd+K (listener ở header/layout)
// ô input -> globalSearch(q) debounce; nhóm kết quả theo type + nhóm "Hành động"
// ↑↓ điều hướng, Enter -> router.push(result.link)
// khi rỗng: hiển thị "Gần đây" (localStorage)
```

### 4.2 `ImportWizard`
```tsx
// 3 bước: Upload (parseCsv) -> ColumnMapper (map header->field) -> Preview & Confirm
// mode dedupe: skip|update|create; báo cáo success/skipped/failed; tải file lỗi
```

### 4.3 `NotificationBell`
```tsx
// badge số chưa đọc; popover NotificationList; polling lib/notifications mỗi 30s (giai đoạn 1)
// nguồn sự kiện: assign lead (admindocs), @mention (U4), task/reminder đến hạn (U3), deal stage, quote accepted
```

### 4.4 `lib/i18n.ts` + `t()`
```tsx
// locales/vi.ts, en.ts: { "nav.leads":"Khách hàng tiềm năng" / "Leads", ... }
// thay chuỗi cứng (tiêu đề trang EN) bằng t('...'); mặc định 'vi'
```

## 5. Các bước thực thi (theo nhóm, làm tuần tự)
1. [ ] **U6f i18n nền tảng**: tạo `lib/i18n.ts` + locales; thay các tiêu đề EN trong page bằng `t()`; LanguageSwitcher.
2. [ ] **U6a Search**: `lib/search.ts` + `CommandPalette` + nút header + phím tắt.
3. [ ] **U6b Import/Export**: `lib/csv.ts` + `ImportWizard`/`ColumnMapper` + `ExportButton` thật (gắn các list).
4. [ ] **U6c Notifications**: types + mock + `NotificationBell`/list + trang + polling; nối sự kiện U2–U5.
5. [ ] **U6d Custom fields**: defs + `CustomFieldRenderer` nhúng vào form/detail; lọc/sort theo field.
6. [ ] **U6e Saved views**: lưu/khôi phục filter+columns+sort; `SavedViewTabs` đầu list.
7. [ ] **Settings**: làm form lưu thật (prefs, đổi mật khẩu, chữ ký, template từ U4, notify toggles).
8. [ ] Empty/loading/error; responsive.

## 6. Test & nghiệm thu
- [ ] Ctrl/Cmd+K mở palette; tìm & nhảy tới lead/contact/company/deal/product + hành động.
- [ ] Import CSV: map cột, dedupe theo mode, báo cáo kết quả, tải file lỗi.
- [ ] Export CSV thật theo bộ lọc & cột hiển thị; tôn trọng quyền.
- [ ] Chuông hiển thị số chưa đọc; đánh dấu đã đọc; sự kiện thật tạo notification.
- [ ] Custom field hiển thị trong form/detail; lọc theo field.
- [ ] Saved view lưu & khôi phục đúng; UI VI nhất quán, chuyển EN hoạt động.
- [ ] Settings lưu thật; đổi mật khẩu hoạt động.

## 7. Rủi ro & giảm thiểu
- **Phase quá lớn** → chia U6a..U6f, ưu tiên Must (search, import/export, notification, i18n) trước.
- **CSV tiếng Việt/encoding** → ép UTF-8, hỗ trợ phân tách `,`/`;`, escape dấu ngoặc kép; test file Excel VN.
- **Custom fields (EAV) phình query** → giới hạn số field/entity, index `(entity, record_id)`.
- **i18n bỏ sót chuỗi** → grep chuỗi cứng; ưu tiên các page tiêu đề EN đã phát hiện (Leads/Reports/Contacts...).
- **Polling tốn tài nguyên** → giai đoạn 2 nâng lên SSE/WebSocket.
