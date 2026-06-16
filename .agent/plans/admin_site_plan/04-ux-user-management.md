# 04 — UX/UI: Quản lý User & Tạo tài khoản

> Khu vực: `/admin/users`. Chỉ Admin. Mục tiêu: tạo tài khoản nhân viên, quản lý vòng đời
> (mời → kích hoạt → khóa → xóa), đổi vai trò, reset mật khẩu — nhanh và an toàn.

## 1. Luồng người dùng (User flows)

### 1.1 Tạo tài khoản — 2 cách
```
Cách A — Tạo trực tiếp (admin đặt mật khẩu tạm):
  Admin → "Thêm người dùng" → nhập tên/email/vai trò → đặt MK tạm
        → Lưu → user status=active → admin gửi MK cho nhân viên

Cách B — Mời qua link (khuyến nghị):
  Admin → "Mời người dùng" → nhập email/vai trò → Gửi lời mời
        → tạo invitation (token, hết hạn 72h) → user status=invited
        → nhân viên mở link /accept-invite?token= → tự đặt mật khẩu
        → status=active
```

### 1.2 Vòng đời tài khoản
```
[invited] ──(đặt MK)──▶ [active] ──(khóa)──▶ [inactive] ──(mở khóa)──▶ [active]
   │                       │                                              │
   │(hết hạn)              └──────────────(xóa: soft-delete)──────────────┘
   ▼                                              ▼
[expired]                                     [deleted]
```

## 2. Màn hình: Danh sách người dùng `/admin/users`

### 2.1 Wireframe (desktop)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Admin › Người dùng                                                             │
│                                                                                │
│  Người dùng                                          [ + Mời ] [ + Thêm mới ]  │
│  Quản lý tài khoản, vai trò và trạng thái nhân viên                            │
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Tìm tên/email...   [Vai trò ▾] [Trạng thái ▾] [Sắp xếp ▾]   12 user  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ☐  NGƯỜI DÙNG            VAI TRÒ   TRẠNG THÁI   LEAD   ĐĂNG NHẬP    ⋮         │
│  ──────────────────────────────────────────────────────────────────────────  │
│  ☐  (A) Nguyễn Văn A      ●Admin    ●Active      45     2 giờ trước  ⋮         │
│      a@vanhcorp.com                                                            │
│  ☐  (B) Trần Thị B        ○User     ●Active      28     hôm qua      ⋮         │
│      b@vanhcorp.com                                                            │
│  ☐  (C) Lê Văn C          ○User     ◐Invited     0      —            ⋮         │
│      c@vanhcorp.com                  (chờ đặt MK)                              │
│  ☐  (D) Phạm Thị D        ○User     ✕Inactive    12     5 ngày trước ⋮         │
│      d@vanhcorp.com                  (đã khóa)                                 │
│  ──────────────────────────────────────────────────────────────────────────  │
│  ◀ 1 2 3 ▶                                              Hiển thị 10/12        │
└──────────────────────────────────────────────────────────────────────────────┘

Khi chọn checkbox → hiện thanh bulk:
┌──────────────────────────────────────────────────────────────────────────────┐
│  Đã chọn 2 ·  [Đổi vai trò ▾] [Khóa] [Mở khóa] [Xóa]            [Bỏ chọn]     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Cột & quy ước hiển thị
| Cột | Nội dung | Ghi chú |
|-----|----------|---------|
| Checkbox | chọn để bulk | header có "chọn tất cả" |
| Người dùng | avatar (chữ cái đầu) + tên + email | click → trang chi tiết |
| Vai trò | Badge: Admin = primary đậm, User = xám | xem badge spec [08] |
| Trạng thái | Badge màu: active=cta, invited=amber, inactive=đỏ nhạt, deleted ẩn | dot + nhãn |
| Lead | số lead đang sở hữu | giúp quyết định reassign |
| Đăng nhập | `last_login_at` dạng tương đối | "—" nếu chưa |
| ⋮ | menu hành động dòng | xem §2.3 |

### 2.3 Menu hành động mỗi dòng (⋮)
```
┌─────────────────────────┐
│  Xem chi tiết           │
│  Chỉnh sửa              │
│  Đổi vai trò       ▸    │  → submenu: Admin / User
│  ─────────────          │
│  Reset mật khẩu         │
│  Khóa tài khoản         │  (hoặc "Mở khóa" nếu đang inactive)
│  Gửi lại lời mời        │  (chỉ khi status=invited)
│  ─────────────          │
│  Xóa                  🗑 │  (đỏ, có xác nhận)
└─────────────────────────┘
```
- Với **chính mình**: ẩn "Đổi vai trò", "Khóa", "Xóa" (theo rule §02-4.1).
- Với admin cuối cùng: "Đổi vai trò → User", "Khóa", "Xóa" bị disable + tooltip "Phải còn ít nhất 1 Admin".

### 2.4 Bộ lọc
- **Vai trò:** Tất cả / Admin / User
- **Trạng thái:** Tất cả / Active / Invited / Inactive
- **Sắp xếp:** Mới nhất / Tên A→Z / Đăng nhập gần nhất / Số lead nhiều nhất
- Tất cả phản ánh vào query string (xem [01] §5).

## 3. Màn hình: Tạo / Mời người dùng

### 3.1 Dialog "Thêm người dùng" (tạo trực tiếp)
```
┌────────────────────────────────────────────┐
│  Thêm người dùng                      ✕      │
│  ──────────────────────────────────────────  │
│  Họ và tên *                                 │
│  [ ........................................ ] │
│                                              │
│  Email *                                     │
│  [ ........................................ ] │
│  ⓘ Dùng để đăng nhập                         │
│                                              │
│  Vai trò *                                   │
│  ( ) Admin   (•) User                        │
│  ⓘ User chỉ thấy lead được giao cho họ       │
│                                              │
│  Mật khẩu tạm thời *                         │
│  [ ............................ ] [Tạo ngẫu] │
│  ⓘ Tối thiểu 8 ký tự. Nhân viên nên đổi      │
│     sau lần đăng nhập đầu.                    │
│  ☑ Bắt buộc đổi mật khẩu lần đăng nhập đầu   │
│  ──────────────────────────────────────────  │
│                        [ Hủy ]  [ Tạo TK ]   │
└────────────────────────────────────────────┘
```

### 3.2 Dialog "Mời người dùng" (qua link)
```
┌────────────────────────────────────────────┐
│  Mời người dùng                       ✕      │
│  ──────────────────────────────────────────  │
│  Email *                                     │
│  [ ........................................ ] │
│  ⓘ Có thể nhập nhiều email, phân tách bằng , │
│                                              │
│  Vai trò *      ( ) Admin   (•) User         │
│                                              │
│  Lời mời hết hạn sau:  [ 72 giờ ▾ ]          │
│  ──────────────────────────────────────────  │
│  ⓘ Hệ thống tạo link mời. Sao chép & gửi cho │
│    nhân viên (chưa tích hợp email server).   │
│  ──────────────────────────────────────────  │
│                       [ Hủy ]  [ Gửi mời ]   │
└────────────────────────────────────────────┘

Sau khi gửi → hiển thị link để copy:
┌────────────────────────────────────────────┐
│  ✓ Đã tạo lời mời cho c@vanhcorp.com         │
│  https://app/accept-invite?token=ab12... 📋  │
└────────────────────────────────────────────┘
```

### 3.3 Validation (FE + BE)
| Trường | Luật |
|--------|------|
| Tên | bắt buộc, 2–80 ký tự |
| Email | bắt buộc, đúng định dạng, **chưa tồn tại** trong users/invitations pending |
| Vai trò | bắt buộc, ∈ {admin, user} |
| Mật khẩu | ≥ 8 ký tự, có chữ + số (gợi ý mạnh) |

Lỗi hiển thị inline dưới từng field (đỏ, 13px). Email trùng → "Email này đã được dùng".

## 4. Màn hình: Chi tiết người dùng `/admin/users/[id]`

```
┌──────────────────────────────────────────────────────────────────────┐
│ Admin › Người dùng › Trần Thị B                                        │
│                                                                        │
│  ┌────────────────────────┐   ┌────────────────────────────────────┐ │
│  │   (B)  Trần Thị B       │   │  Tab: Hồ sơ | Lead | Hoạt động     │ │
│  │   b@vanhcorp.com        │   │  ────────                          │ │
│  │   ○ User   ● Active     │   │                                    │ │
│  │                         │   │  Họ tên   [ Trần Thị B          ]  │ │
│  │  [ Chỉnh sửa ]          │   │  Email    [ b@vanhcorp.com      ]  │ │
│  │  [ Reset mật khẩu ]     │   │  Vai trò  [ User ▾ ]               │ │
│  │  [ Khóa tài khoản ]     │   │  Trạng thái  ● Active              │ │
│  │  [ Xóa ]          🗑     │   │                                    │ │
│  │                         │   │  Tạo lúc   12/05/2026              │ │
│  │  ─── Thống kê ───       │   │  Đăng nhập cuối  hôm qua 14:20     │ │
│  │  Lead sở hữu:    28     │   │                   [ Lưu thay đổi ] │ │
│  │  Deal đang mở:   6      │   │                                    │ │
│  │  Tỷ lệ chốt:    18%     │   └────────────────────────────────────┘ │
│  └────────────────────────┘                                          │
└──────────────────────────────────────────────────────────────────────┘
```

- **Tab Lead:** bảng lead user này đang sở hữu + nút "Chuyển lead sang người khác" (mở dialog reassign — xem [05]).
- **Tab Hoạt động:** audit log lọc theo user này (đăng nhập, thao tác gần đây).

## 5. Hành động nhạy cảm — mẫu xác nhận

### 5.1 Khóa tài khoản
```
┌──────────────────────────────────────────┐
│  Khóa tài khoản Trần Thị B?               │
│  ──────────────────────────────────────  │
│  Người dùng sẽ không đăng nhập được.      │
│  28 lead của họ vẫn giữ nguyên cho tới    │
│  khi bạn chuyển cho người khác.           │
│                                           │
│  ☐ Đồng thời chuyển 28 lead về pool       │
│  ──────────────────────────────────────  │
│                  [ Hủy ]  [ Khóa ]        │
└──────────────────────────────────────────┘
```

### 5.2 Reset mật khẩu
```
┌──────────────────────────────────────────┐
│  Reset mật khẩu cho Trần Thị B            │
│  ──────────────────────────────────────  │
│  ( ) Tạo mật khẩu tạm thời ngẫu nhiên     │
│  (•) Gửi link đặt lại mật khẩu            │
│  ──────────────────────────────────────  │
│                 [ Hủy ]  [ Xác nhận ]     │
└──────────────────────────────────────────┘
```

### 5.3 Xóa người dùng (soft-delete + chặn nếu còn lead)
```
┌──────────────────────────────────────────────────┐
│  ⚠ Xóa tài khoản Trần Thị B?                       │
│  ────────────────────────────────────────────────  │
│  User này còn sở hữu 28 lead, 6 deal.             │
│  Cần xử lý trước khi xóa:                          │
│                                                    │
│  (•) Chuyển toàn bộ cho:  [ Chọn người dùng ▾ ]    │
│  ( ) Đưa toàn bộ về pool                           │
│                                                    │
│  Gõ "XOA" để xác nhận:  [ ........ ]              │
│  ────────────────────────────────────────────────  │
│                      [ Hủy ]  [ Xóa vĩnh viễn ]   │
└──────────────────────────────────────────────────┘
```
> Nguyên tắc: **không để lead mồ côi**. Xóa buộc reassign hoặc đẩy về pool. Dùng soft-delete (`status='deleted'`) để giữ lịch sử audit.

## 6. Component sử dụng (chi tiết ở [08])
- `UserTable`, `UserTableRow`, `UserBulkBar`
- `UserFormDialog` (dùng cho cả tạo & sửa, prop `mode`)
- `InviteUserDialog`
- `RoleBadge`, `StatusBadge`
- `ConfirmDialog` (tái sử dụng cho khóa/xóa/reset, prop `requireTyping`)
- `ReassignLeadsDialog` (chung với [05])
- Tái sử dụng UI có sẵn: `dialog`, `dropdown-menu`, `input`, `button`, `avatar`, `badge`.

## 7. Trạng thái rỗng & lỗi
- **Empty (0 user — hiếm):** minh họa + "Chưa có người dùng. Thêm thành viên đầu tiên." + nút.
- **Lỗi tải:** banner đỏ + "Thử lại".
- **Mời thất bại (email trùng):** giữ dialog, lỗi inline.

## 8. Responsive
- ≥1024px: bảng đầy đủ.
- 768–1023px: ẩn cột "Đăng nhập", gộp "Lead" vào dòng phụ.
- <768px: chuyển bảng thành **card list** (mỗi user 1 card: avatar, tên, badge, nút ⋮). Bulk vẫn dùng được qua nút chọn.

## 9. Phím tắt & tiện ích (nice-to-have)
- `/` focus ô tìm kiếm.
- `n` mở dialog thêm user.
- Enter trong ô tìm = áp dụng; Esc đóng dialog.
