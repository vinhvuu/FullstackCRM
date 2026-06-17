# 05 — UX/UI: Chia Lead (Lead Distribution)

> Khu vực: `/admin/leads`. Chỉ Admin. Cơ chế đã chốt: **Gán thủ công** + **Theo luật (rule-based)**.
> Bổ sung pool tự nhận như tầng hỗ trợ cho rule-based (strategy `pool`).
> Mục tiêu: không lead nào bị bỏ sót, chia việc công bằng & nhanh.

## 1. Tổng quan trung tâm chia lead

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Admin › Chia lead                                                              │
│                                                                                │
│  Chia lead                                                                     │
│  ┌──────────────┬──────────────┬──────────────┐                               │
│  │ Gán thủ công │  Luật tự động │     Pool     │   ← 3 tab                      │
│  └──────────────┴──────────────┴──────────────┘                               │
│                                                                                │
│  ── Thẻ tổng quan ──                                                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │ Chưa gán   │ │ Trong pool │ │ Luật active│ │ Gán hôm nay│                  │
│  │    17      │ │    34      │ │     3      │ │    52      │                  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. TAB 1 — Gán thủ công (Manual assignment)

### 2.1 Wireframe
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Gán thủ công] Luật tự động   Pool                                            │
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Tìm lead...  [Nguồn ▾] [Trạng thái ▾] [Chủ sở hữu ▾] [Score ▾]       │  │
│  │ Lọc nhanh:  ( Chưa gán )( Của tôi )( Score cao )( Mới hôm nay )          │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ☐  LEAD               CÔNG TY      NGUỒN     SCORE  CHỦ HIỆN TẠI   TẠO LÚC    │
│  ──────────────────────────────────────────────────────────────────────────  │
│  ☑  Nguyễn Thành      ABC Corp     Website    82    — (chưa gán)   2 giờ     │
│  ☑  Hoàng Mai         XYZ Ltd      LinkedIn   75    — (chưa gán)   3 giờ     │
│  ☐  Đỗ Quang          DEF Inc      Referral   60    Trần Thị B     hôm qua   │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                                │
│  ▼ Khi chọn → thanh bulk hiện lên:                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Đã chọn 2 lead   →  Gán cho [ Chọn nhân viên ▾ ]  [ Gán ]   [Về pool]   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Dialog gán (bulk assign)
```
┌──────────────────────────────────────────────┐
│  Gán 2 lead cho nhân viên              ✕      │
│  ──────────────────────────────────────────  │
│  Chọn người nhận *                            │
│  [ 🔍 Tìm nhân viên...                     ▾] │
│  ┌──────────────────────────────────────────┐ │
│  │ (B) Trần Thị B   · 28 lead · 6 deal mở    │ │  ← hiển thị tải hiện tại
│  │ (D) Phạm Thị D   · 12 lead · 2 deal mở    │ │     để chia công bằng
│  │ (E) Vũ Văn E     · 9  lead · 1 deal mở    │ │
│  └──────────────────────────────────────────┘ │
│                                              │
│  ⓘ Gợi ý: Vũ Văn E đang giữ ít lead nhất     │
│                                              │
│  Ghi chú (tùy chọn)                          │
│  [ ........................................ ] │
│  ──────────────────────────────────────────  │
│                      [ Hủy ]  [ Gán 2 lead ] │
└──────────────────────────────────────────────┘
```
- Mỗi nhân viên hiển thị **tải hiện tại** (lead/deal mở) → admin chia công bằng bằng mắt.
- Có **gợi ý** người ít tải nhất.
- Sau khi gán → toast "Đã gán 2 lead cho Vũ Văn E" + ghi `lead_assignments` (method=`manual`) + audit.

### 2.3 Đổi chủ nhanh trên trang Leads chính
Trên `/leads` (trang nghiệp vụ), với Admin: thêm cột/menu "Đổi chủ" mỗi dòng + bulk bar có nút "Gán". Mở cùng dialog §2.2. (User không thấy nút này — [02] §3.)

### 2.4 Reassign khi khóa/xóa user
Dialog `ReassignLeadsDialog` (dùng chung với [04] §5): chuyển toàn bộ lead của 1 user sang người khác hoặc về pool, trong 1 thao tác.

---

## 3. TAB 2 — Luật tự động (Rule-based engine)

### 3.1 Danh sách luật
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Gán thủ công  [Luật tự động]  Pool                          [ + Tạo luật ]    │
│                                                                                │
│  ⓘ Lead mới sẽ chạy qua các luật theo thứ tự ưu tiên (trên xuống).            │
│    Luật đầu tiên khớp sẽ quyết định người nhận.                                │
│                                                                                │
│  ⇅  ƯU TIÊN  TÊN LUẬT              ĐIỀU KIỆN              CHIA CHO        BẬT   │
│  ──────────────────────────────────────────────────────────────────────────  │
│  ⠿   1       Lead Website hot      Nguồn=Website,        Round-robin    [●]   │
│                                    Score≥70              A, B, E              │
│  ⠿   2       Khách doanh nghiệp    Công ty chứa "Corp"   Ít tải nhất     [●]   │
│                                                          B, D                 │
│  ⠿   3       Còn lại → Pool        (mọi lead khác)       → Pool          [○]   │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                                │
│  ⠿ = kéo để đổi thứ tự ưu tiên (dùng @dnd-kit như kanban hiện có)             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Rule builder (tạo / sửa luật)
```
┌────────────────────────────────────────────────────────────────┐
│  Tạo luật chia lead                                       ✕      │
│  ──────────────────────────────────────────────────────────────  │
│  Tên luật *      [ Lead Website hot                            ] │
│  Độ ưu tiên      [ 1 ▾ ]   (số nhỏ chạy trước)                   │
│                                                                  │
│  ── ĐIỀU KIỆN (tất cả phải đúng) ──                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Nguồn ▾]    [là một trong ▾]  [Website ✕][LinkedIn ✕] + │  │
│  │ [Score ▾]    [≥ ▾]             [ 70 ]                  🗑 │  │
│  │ [+ Thêm điều kiện]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ── HÀNH ĐỘNG ──                                                 │
│  Chia cho:  (•) Nhân viên cụ thể   ( ) Đưa vào pool              │
│  Nhân viên: [ (A) Nguyễn Văn A ✕ ] [ (B) Trần B ✕ ] [ + ]      │
│  Cách chia: [ Round-robin ▾ ]                                    │
│             • Round-robin — luân phiên đều                       │
│             • Ít tải nhất — ai giữ ít lead mở nhất               │
│             • Người đầu tiên rảnh                                │
│                                                                  │
│  ── XEM TRƯỚC ──                                                 │
│  ⓘ Có 23 lead hiện tại khớp luật này.                            │
│     [ Xem danh sách ]   [ Áp dụng luật cho lead cũ ]            │
│  ──────────────────────────────────────────────────────────────  │
│                              [ Hủy ]  [ Lưu luật ]              │
└────────────────────────────────────────────────────────────────┘
```

### 3.3 Builder điều kiện — chi tiết tương tác
- Mỗi dòng điều kiện = **[Field] [Operator] [Value]**.
- Operator thay đổi theo field:
  - `source`, `status`, `tag` → `là / không là / là một trong / không thuộc` (value = chip chọn nhiều)
  - `score` → `≥ / ≤ / = ` (value = số, có slider phụ)
  - `company`, `email_domain` → `chứa / bằng` (value = text)
- Field `email_domain` ví dụ: chứa "gmail.com" → cá nhân; chứa "corp" → doanh nghiệp.
- Nút "Thêm điều kiện" thêm dòng; các dòng nối nhau bằng **AND** (ghi rõ "tất cả phải đúng").

### 3.4 Xem trước (Preview) — quan trọng cho lòng tin
- Khi điều kiện thay đổi, gọi API đếm "bao nhiêu lead hiện tại khớp" (debounce).
- Nút "Xem danh sách" mở panel lead khớp để admin kiểm chứng trước khi lưu.
- "Áp dụng luật cho lead cũ": tùy chọn chạy luật ngược cho lead đang chưa gán/đang trong pool.

### 3.5 Cách engine chạy (mô tả nghiệp vụ)
```
Khi 1 lead được TẠO (hoặc đưa vào pool & bật auto):
  1. Lấy các luật is_active=1, sắp theo priority tăng dần.
  2. Với mỗi luật: kiểm tra TẤT CẢ conditions (AND).
  3. Luật đầu tiên khớp → thực thi action:
       - assign + round_robin  → chọn target kế tiếp theo con trỏ luân phiên
       - assign + least_load   → target có ít lead "đang mở" nhất
       - assign + first_available → target active đầu tiên
       - pool                  → owner_id = NULL
  4. Ghi lead_assignments(method='rule', rule_id) + audit(lead.assign).
  5. Nếu không luật nào khớp → lead vào pool (mặc định an toàn) hoặc giữ chưa gán
     (tùy system_settings).
```
> Edge case cần xử lý: target đang bị khóa (inactive) → bỏ qua, chọn target kế. Không còn target hợp lệ → rơi về pool.

---

## 4. TAB 3 — Pool (lead tự nhận)

### 4.1 Cấu hình & danh sách pool
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Gán thủ công  Luật tự động  [Pool]                                            │
│                                                                                │
│  Cấu hình pool                                                                 │
│  Cho phép nhân viên tự nhận lead   [● Bật]                                     │
│  Giới hạn mỗi người tự nhận tối đa  [ 20 ] lead đang mở                        │
│                                                  [ Lưu cấu hình ]              │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Lead trong pool (34)                              [ Gán hết cho... ]          │
│                                                                                │
│  LEAD            NGUỒN      SCORE   VÀO POOL LÚC      ⋮                         │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Phan Tú         Website    68      hôm nay 09:12    [Gán]                     │
│  Ngô Hạnh        Cold Call  40      hôm qua          [Gán]                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Phía User — nhận lead từ pool (trên trang `/leads`)
```
┌────────────────────────────────────────────────────┐
│  Lead trong pool (34)            [ Xem pool ]        │  ← banner cho User
│  Bạn đang giữ 12/20 lead. Còn nhận được 8.          │
└────────────────────────────────────────────────────┘

Dialog xem pool (User):
┌──────────────────────────────────────────────┐
│  Pool lead                            ✕       │
│  ──────────────────────────────────────────  │
│  LEAD          NGUỒN     SCORE      ACTION    │
│  Phan Tú       Website   68      [ Nhận ]    │
│  Ngô Hạnh      Cold Call 40      [ Nhận ]    │
│  ──────────────────────────────────────────  │
│  ⓘ Nhận lead nào, lead đó thuộc về bạn.       │
└──────────────────────────────────────────────┘
```
- "Nhận" → set owner_id = user.id, ghi `lead_assignments(method='claim')` + audit.
- Chặn khi đã chạm giới hạn → toast "Bạn đã đạt giới hạn 20 lead đang mở."

---

## 5. Quy tắc nghiệp vụ tổng hợp
1. Lead luôn có đúng một trạng thái sở hữu: **có chủ** (owner_id) hoặc **trong pool** (NULL).
2. Gán tay luôn ghi đè (kèm cảnh báo nếu lead đã có chủ khác).
3. Mọi thao tác gán/đổi/nhận ghi vào `lead_assignments` + `audit_logs`.
4. Round-robin lưu con trỏ theo từng luật (không global) để công bằng trong phạm vi luật.
5. Khi user inactive: lead giữ nguyên owner; admin có thể "Chuyển về pool" hàng loạt.
6. Giới hạn pool tính theo lead **đang mở** (status ∉ {won, lost}).

## 6. Component (chi tiết [08])
- `LeadDistributionTabs`
- `AssignableLeadTable` + `AssignBulkBar`
- `AssignLeadDialog` (hiển thị tải nhân viên + gợi ý)
- `RuleList` (kéo-thả ưu tiên), `RuleCard`, `RuleToggle`
- `RuleBuilderDialog` → `ConditionRow`, `ActionEditor`, `RulePreview`
- `PoolConfigPanel`, `PoolLeadTable`, `ClaimLeadDialog`
- `ReassignLeadsDialog` (dùng chung [04])
- `EmployeeLoadPicker` (select nhân viên kèm số tải) — tái sử dụng nhiều nơi.

## 7. Empty / Loading / Error
- **Chưa có luật:** minh họa + "Tạo luật đầu tiên để tự động chia lead" + nút.
- **Pool rỗng:** "Không có lead nào trong pool. Lead chưa gán sẽ xuất hiện ở đây."
- **Preview lỗi:** ẩn số đếm, hiện "Không tải được xem trước".

## 8. Responsive
- Tab giữ nguyên; bảng → card list ở mobile.
- Rule builder: trên mobile các dòng điều kiện xếp dọc, mỗi phần (field/op/value) full-width.
- `EmployeeLoadPicker` trên mobile hiện dạng list chọn 1, kèm số tải.
