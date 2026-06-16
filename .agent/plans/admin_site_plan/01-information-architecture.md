# 01 — Information Architecture (IA)

## 1. Sitemap tổng thể

```
VanhCorp CRM
│
├── (auth)                         [public]
│   ├── /login                     ✅ có UI — cần nối auth thật
│   ├── /register                  ✅ có UI (cân nhắc tắt nếu chỉ admin tạo tài khoản)
│   ├── /forgot-password           ❌ mới
│   ├── /reset-password?token=     ❌ mới
│   └── /accept-invite?token=      ❌ mới — user đặt mật khẩu lần đầu
│
├── (dashboard)                    [cần đăng nhập — Admin + User]
│   ├── /                          ✅ Dashboard (cá nhân hóa theo quyền)
│   ├── /leads                     ✅ lọc theo owner; Admin thấy tất cả
│   ├── /leads/[id]                ✅
│   ├── /contacts                  ✅
│   ├── /deals                     ✅
│   ├── /activities                ✅
│   ├── /reports                   ✅
│   └── /settings                  ✅ cấu hình cá nhân
│
└── (dashboard)/admin             [CHỈ Admin — toàn bộ là ❌ mới]
    ├── /admin                      Admin overview (dashboard quản trị)
    ├── /admin/users                Danh sách & quản lý user
    │   ├── /admin/users/new        Tạo / mời user
    │   └── /admin/users/[id]       Chi tiết user (edit, khóa, reset MK, hoạt động)
    ├── /admin/leads                Trung tâm chia lead (lead distribution)
    │   ├── /admin/leads/assign     Gán/bulk-assign thủ công
    │   ├── /admin/leads/rules      Rule builder (luật chia tự động)
    │   └── /admin/leads/pool       Quản lý pool tự nhận
    ├── /admin/audit                Nhật ký hoạt động (audit log)
    └── /admin/settings             Cấu hình hệ thống
        ├── /admin/settings/general     Tên hệ thống, múi giờ, mặc định
        ├── /admin/settings/lead-sources Nguồn lead
        ├── /admin/settings/tags        Quản lý tag toàn cục
        └── /admin/settings/sla         SLA / nhắc nhở / vòng đời lead
```

## 2. Cấu trúc thư mục route (Next.js App Router)

```
app/(dashboard)/admin/
├── layout.tsx                     # AdminGuard + AdminSubnav
├── page.tsx                       # /admin overview
├── users/
│   ├── page.tsx                   # list
│   ├── new/page.tsx               # create/invite
│   └── [id]/page.tsx              # detail/edit
├── leads/
│   ├── page.tsx                   # distribution hub
│   ├── assign/page.tsx
│   ├── rules/page.tsx
│   └── pool/page.tsx
├── audit/
│   └── page.tsx
└── settings/
    ├── page.tsx                   # redirect -> general
    ├── general/page.tsx
    ├── lead-sources/page.tsx
    ├── tags/page.tsx
    └── sla/page.tsx
```

## 3. Điều hướng (Navigation)

### 3.1 Sidebar chính — thêm mục "Admin"
Mở rộng `NAV_ITEMS` trong `lib/constants.ts`. Mục Admin **chỉ render khi `role === 'admin'`**.

```
┌─────────────────────┐
│  VANH-CORP  [logo]  │
├─────────────────────┤
│  ▢ Dashboard        │  (mọi user)
│  ▢ Leads            │
│  ▢ Contacts         │
│  ▢ Deals            │
│  ▢ Activities       │
│  ▢ Reports          │
│  ──────────────     │
│  ▣ Admin        ▾   │  ← chỉ Admin thấy; group có submenu
│     • Tổng quan     │
│     • Người dùng    │
│     • Chia lead     │
│     • Nhật ký       │
│     • Cấu hình      │
│  ──────────────     │
│  ▢ Settings         │
└─────────────────────┘
```

**Quy ước:** mục Admin là một nhóm có nhãn phân tách rõ (đường kẻ + chữ "QUẢN TRỊ" màu `text-muted`, uppercase, 11px) để tách biệt khỏi khu nghiệp vụ.

### 3.2 Sub-navigation trong khu Admin
Khi vào `/admin/*`, hiển thị thanh tab ngang (sub-nav) dưới header để chuyển nhanh giữa các khu admin:

```
┌──────────────────────────────────────────────────────────────┐
│  Tổng quan │ Người dùng │ Chia lead │ Nhật ký │ Cấu hình      │
│  ─────────                                                     │  (tab active gạch chân primary)
└──────────────────────────────────────────────────────────────┘
```

- Component: `components/admin/admin-subnav.tsx` (mới).
- Active state: chữ `text-dark` + gạch chân 2px `primary`; inactive: `text-muted`.

### 3.3 Breadcrumb
Trang admin sâu (vd `/admin/users/[id]`) hiển thị breadcrumb:
`Admin › Người dùng › Nguyễn Văn A`

## 4. Bản đồ điều hướng theo quyền (Navigation by role)

| Khu vực | Admin | User |
|---------|:-----:|:----:|
| Sidebar nhóm Admin | ✅ hiện | ❌ ẩn |
| `/admin/*` truy cập trực tiếp URL | ✅ | ❌ → redirect `/` + toast "Không đủ quyền" |
| Nút "Gán lead", "Đổi chủ" trên trang Leads | ✅ | ❌ ẩn |
| Bộ lọc "Theo nhân viên" trên Leads | ✅ (mọi user) | 🟡 chỉ chính mình |

## 5. Quy ước URL & state

- Bộ lọc, phân trang, sắp xếp lưu ở **query string** để chia sẻ link được:
  `/admin/users?role=user&status=active&page=2&sort=name:asc`
- Dialog tạo/sửa dùng route song song hoặc state cục bộ; thao tác bulk giữ state ở client.
- Sau hành động thành công → toast + cập nhật optimistic + revalidate dữ liệu.

## 6. Trạng thái trang chuẩn (mọi trang admin phải có)

| State | Mô tả |
|-------|-------|
| Loading | Skeleton bảng/card, không spinner toàn trang |
| Empty | Minh họa + 1 câu hướng dẫn + nút hành động chính |
| Error | Thông báo lỗi + nút "Thử lại" |
| No-permission | Trang 403 thân thiện + link về Dashboard |
| Success | Toast + cập nhật UI |
