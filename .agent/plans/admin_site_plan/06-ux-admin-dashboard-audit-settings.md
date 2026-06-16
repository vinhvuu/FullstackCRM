# 06 — UX/UI: Admin Dashboard, Audit Log & System Settings

> Ba khu vực còn lại của admin site: `/admin` (tổng quan), `/admin/audit` (nhật ký),
> `/admin/settings/*` (cấu hình hệ thống).

---

## 1. Admin Dashboard `/admin`

Khác Dashboard nghiệp vụ (`/`) ở chỗ: nhìn **toàn hệ thống** và **theo từng nhân viên**.

### 1.1 Wireframe
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Admin › Tổng quan                                          [ Tuần ▾ ] [Tháng] │
│                                                                                │
│  ── KPI toàn hệ thống ──                                                       │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │ Nhân viên  │ │ Tổng lead  │ │ Lead chưa  │ │ Doanh thu  │                  │
│  │  12 active │ │   1,240    │ │ gán: 17    │ │  2.85 tỷ   │                  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                  │
│                                                                                │
│  ┌─────────────────────────────────┐ ┌──────────────────────────────────┐    │
│  │  Hiệu suất theo nhân viên        │ │  Phân bổ lead theo nhân viên      │    │
│  │  (bảng xếp hạng)                 │ │  (donut / bar — recharts)         │    │
│  │  ─────────────────────────────  │ │                                  │    │
│  │  # NV        Lead  Chốt  Tỷ lệ  │ │     ▓▓▓▓ A 28%                    │    │
│  │  1 Trần B    28    5    18%     │ │     ▓▓▓  B 22%                    │    │
│  │  2 Vũ E      24    4    17%     │ │     ▓▓   D 15%                    │    │
│  │  3 Phạm D    12    1     8%     │ │     ...                           │    │
│  └─────────────────────────────────┘ └──────────────────────────────────┘    │
│                                                                                │
│  ┌─────────────────────────────────┐ ┌──────────────────────────────────┐    │
│  │  Hoạt động gần đây (audit feed)  │ │  Cảnh báo                        │    │
│  │  • Trần B nhận 2 lead  2 phút    │ │  ⚠ 17 lead chưa gán > 24h        │    │
│  │  • Admin tạo user "Lê C" 1 giờ  │ │  ⚠ Phạm D chưa đăng nhập 5 ngày  │    │
│  │  • Luật "Website hot" gán... 1h │ │  ⚠ 3 lead score>80 còn trong pool│    │
│  │              [ Xem tất cả → ]    │ │                                  │    │
│  └─────────────────────────────────┘ └──────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Thành phần
| Khối | Dữ liệu | Nguồn |
|------|---------|-------|
| KPI cards | đếm user active, tổng lead, lead chưa gán, doanh thu | API dashboard admin |
| Bảng hiệu suất | per-user: lead, deal chốt, tỷ lệ, doanh thu | aggregate theo owner_id |
| Donut phân bổ | tỷ lệ lead theo nhân viên | recharts (đã có lib) |
| Audit feed | 10 audit gần nhất | `/api/audit?limit=10` |
| Cảnh báo | lead chưa gán quá SLA, user lười đăng nhập, lead "ngon" kẹt pool | logic ngưỡng từ settings |

### 1.3 Tương tác
- Bộ chọn khoảng thời gian (Hôm nay / Tuần / Tháng) áp cho KPI & biểu đồ.
- Click một nhân viên trong bảng → mở `/admin/users/[id]` tab Lead.
- Click cảnh báo "17 lead chưa gán" → nhảy sang `/admin/leads?owner=unassigned`.
- Tái dùng `Card`, `Progress`, `Badge` và pattern chart từ Dashboard hiện có.

---

## 2. Audit Log `/admin/audit`

### 2.1 Wireframe
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Admin › Nhật ký hoạt động                                       [ ⭳ Xuất CSV ] │
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Tìm...  [Người dùng ▾] [Hành động ▾] [Đối tượng ▾] [Từ ngày][Đến]    │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  THỜI GIAN          NGƯỜI       HÀNH ĐỘNG          ĐỐI TƯỢNG       CHI TIẾT    │
│  ──────────────────────────────────────────────────────────────────────────  │
│  07/06 15:42  (A) Nguyễn A   ●Gán lead          Lead #1240     → Trần B  ⌄   │
│  07/06 15:30  (A) Nguyễn A   ●Tạo người dùng    User "Lê C"             ⌄   │
│  07/06 14:10  (B) Trần B     ○Đăng nhập         —                       ⌄   │
│  07/06 13:55  (A) Nguyễn A   ⚑Đổi vai trò       User "Vũ E"   user→admin ⌄  │
│  07/06 11:02  —              ⚙Luật tự động       Lead #1238    rule "Hot" ⌄  │
│  ──────────────────────────────────────────────────────────────────────────  │
│                                                                                │
│  ▼ Mở rộng 1 dòng (⌄) → xem JSON before/after:                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Đổi vai trò User "Vũ E"                                                 │  │
│  │  before: { role: "user" }   →   after: { role: "admin" }                │  │
│  │  IP: 192.168.1.20 · Lúc: 07/06/2026 13:55:02                            │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│  ◀ 1 2 3 ... 18 ▶                                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Quy ước
- **Màu icon hành động:** tạo/gán = primary; đăng nhập/đọc = xám; nhạy cảm (đổi vai trò, xóa, khóa) = đỏ/amber có icon cờ ⚑.
- Mỗi dòng mở rộng để xem `details` (before/after, IP, meta) — không nhồi hết vào hàng.
- Bộ lọc theo: người dùng, loại hành động, loại đối tượng, khoảng ngày. Lưu vào query string.
- **Xuất CSV** theo bộ lọc hiện tại (chỉ admin).
- Phân trang server-side (audit có thể rất nhiều dòng).
- **Chỉ đọc** — audit không sửa/xóa được (đảm bảo tính toàn vẹn).

---

## 3. System Settings `/admin/settings/*`

Bố cục: sidebar phụ bên trái + nội dung bên phải.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Admin › Cấu hình hệ thống                                                      │
│  ┌──────────────────┐ ┌──────────────────────────────────────────────────┐   │
│  │ • Chung          │ │  (nội dung mục đang chọn)                          │   │
│  │ • Nguồn lead     │ │                                                    │   │
│  │ • Tag            │ │                                                    │   │
│  │ • SLA & vòng đời │ │                                                    │   │
│  └──────────────────┘ └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Chung (`/admin/settings/general`)
```
Tên hệ thống        [ VanhCorp CRM            ]
Múi giờ             [ (GMT+7) Asia/Ho_Chi_Minh ▾ ]
Vai trò mặc định    [ User ▾ ]   (khi tạo nhanh)
Cho phép tự đăng ký [ ○ Tắt ]   (nếu tắt, chỉ admin tạo tài khoản)
Thời hạn lời mời    [ 72 ] giờ
                                          [ Lưu thay đổi ]
```

### 3.2 Nguồn lead (`/admin/settings/lead-sources`)
```
Nguồn lead (dùng trong form lead & luật chia)
┌──────────────────────────────────────────┐
│  ⠿  Website                          🗑    │
│  ⠿  Referral                         🗑    │
│  ⠿  LinkedIn                         🗑    │
│  [ + Thêm nguồn ]  [ ........ ] [Thêm]    │
└──────────────────────────────────────────┘
ⓘ Xóa nguồn không ảnh hưởng lead cũ; chỉ ẩn khỏi lựa chọn mới.
```
> Hiện `LEAD_SOURCES` đang hardcode trong `lib/constants.ts` → chuyển sang `system_settings` để admin sửa được.

### 3.3 Tag (`/admin/settings/tags`)
Quản lý `TAG_CONFIGS` toàn cục (id, nhãn, màu chữ, màu nền). Cho thêm/sửa/xóa tag, chọn màu bằng color picker. Tái dùng cấu trúc `TagConfig` sẵn có.
```
TAG          NHÃN        MÀU            
●vip         VIP         [#8B5CF6] 🎨    [Sửa][Xóa]
●hot         Hot         [#EF4444] 🎨    [Sửa][Xóa]
[ + Thêm tag ]
```

### 3.4 SLA & vòng đời (`/admin/settings/sla`)
```
Lead chưa gán cảnh báo sau      [ 24 ] giờ
Reminder mặc định nhắc trước    [ 1  ] giờ
Lead "ngủ đông" nếu không có
hoạt động sau                   [ 14 ] ngày  → tự gắn tag "inactive"
Cho phép tự nhận lead (pool)    [ ● Bật ]
Giới hạn pool mỗi người         [ 20 ] lead đang mở
                                          [ Lưu thay đổi ]
```

### 3.5 Quy ước settings
- Lưu vào bảng `system_settings` (key-value JSON).
- Mọi thay đổi ghi audit (`setting.update`, kèm before/after).
- Nút "Lưu" disable khi chưa có thay đổi; cảnh báo khi rời trang còn thay đổi chưa lưu.
- Validation: số > 0, tên không rỗng, màu đúng hex.

---

## 4. Component (chi tiết [08])
- `AdminKpiCard`, `EmployeePerformanceTable`, `LeadDistributionChart`, `AuditFeed`, `AlertList`
- `AuditTable`, `AuditRow` (expandable), `AuditFilters`, `ExportCsvButton`
- `SettingsLayout` (sub-sidebar), `SettingItem`, `SortableList` (kéo-thả, dùng @dnd-kit), `ColorPicker`, `TagEditor`
- Tái dùng: `Card`, `Badge`, `Progress`, recharts components, `dropdown-menu`, `popover`.

## 5. Empty / Loading / Error
- Audit rỗng (mới triển khai): "Chưa có hoạt động nào được ghi."
- Dashboard khi 0 user/lead: KPI = 0, biểu đồ hiện trạng thái rỗng nhã nhặn.
- Settings lỗi lưu: giữ giá trị nhập, toast lỗi, không reset form.

## 6. Responsive
- Dashboard: grid 4 cột → 2 → 1; biểu đồ full-width khi hẹp.
- Audit: bảng → card list; bộ lọc gom vào nút "Bộ lọc" mở sheet.
- Settings: sub-sidebar → tab ngang cuộn ngang ở mobile.
