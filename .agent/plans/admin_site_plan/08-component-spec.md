# 08 — Component Spec & Design System (Admin)

> Đặc tả component tái sử dụng cho admin site và mở rộng design tokens.
> **Nguyên tắc:** tái dùng tối đa UI primitives sẵn có trong `components/ui/`, không tạo theme mới.

## 1. Design tokens kế thừa + mở rộng

### 1.1 Màu (đã có trong `tailwind.config.ts`)
| Token | Hex | Dùng |
|-------|-----|------|
| `primary` | #6366F1 | nút chính, nav active, link |
| `primary.hover` | #4F46E5 | hover |
| `cta` | #10B981 | xác nhận tích cực, trạng thái active |
| `background` | #F5F3FF | nền |
| `text-dark` | #1E1B4B | tiêu đề |
| `text-muted` | #64748B | phụ |

### 1.2 Màu trạng thái mở rộng (thêm vào tailwind config)
```ts
// thêm vào theme.extend.colors
status: {
  active:   { DEFAULT: '#10B981', bg: '#D1FAE5' },  // active / thành công
  invited:  { DEFAULT: '#F59E0B', bg: '#FEF3C7' },  // chờ / amber
  inactive: { DEFAULT: '#EF4444', bg: '#FEE2E2' },  // khóa / lỗi
  neutral:  { DEFAULT: '#6B7280', bg: '#F3F4F6' },  // trung tính
},
role: {
  admin: { DEFAULT: '#6366F1', bg: '#E0E7FF' },
  user:  { DEFAULT: '#64748B', bg: '#F1F5F9' },
},
```

### 1.3 Token khác
- Radius: card/dialog `2xl` (16px), input/badge `xl` (12px) — đã có.
- Spacing: `card` 24px, `section` 48px — đã có.
- Font: heading Poppins, body Open Sans — đã có.
- Bảng: hàng cao 56px (desktop), header 44px, zebra nhẹ `#FAFAFE`, border `#EEE`.

## 2. Component dùng lại (đã có — không viết lại)
`Button`, `Card`, `Dialog`, `Badge`, `Input`, `Avatar`, `DropdownMenu`, `Progress`, `Popover`
(trong `components/ui/`). Kanban kéo-thả tái dùng `@dnd-kit` như `pipeline-board.tsx`.

## 3. Component mới — đặt trong `components/admin/`

### 3.1 Nền tảng / guard
| Component | Props chính | Mô tả |
|-----------|-------------|------|
| `AdminGuard` | `children` | Chặn non-admin, render 403/redirect. Bọc trong `admin/layout.tsx` |
| `Can` | `role, children` | Render có điều kiện theo role |
| `AdminSubnav` | `items, active` | Tab ngang điều hướng khu admin |
| `Breadcrumb` | `segments[]` | Đường dẫn phân cấp |
| `Forbidden` | — | Trang 403 thân thiện |
| `PageHeader` | `title, subtitle, actions` | Tiêu đề + nút hành động (chuẩn hóa mọi trang admin) |

### 3.2 Badge & hiển thị
| Component | Props | Mô tả |
|-----------|-------|------|
| `RoleBadge` | `role` | Badge Admin/User theo màu role token |
| `StatusBadge` | `status` | dot + nhãn: active/invited/inactive |
| `RelativeTime` | `value` | "2 giờ trước" từ ISO date |
| `UserCell` | `user` | Avatar (chữ cái đầu) + tên + email — dùng trong bảng |
| `LoadIndicator` | `leads, deals` | "28 lead · 6 deal mở" — hiển thị tải nhân viên |

### 3.3 Bảng & bulk (pattern chung)
| Component | Props | Mô tả |
|-----------|-------|------|
| `DataTable` | `columns, rows, selectable, onSelect, sort, onSort` | Bảng tổng quát: chọn nhiều, sắp xếp, responsive→card |
| `BulkBar` | `count, actions[], onClear` | Thanh hành động hàng loạt (sticky dưới hoặc trên) |
| `Pagination` | `page, totalPages, onChange` | Phân trang |
| `FilterBar` | `filters[], value, onChange` | Hàng bộ lọc + tìm kiếm, sync query string |
| `EmptyState` | `icon, title, hint, action` | Trạng thái rỗng chuẩn |
| `ConfirmDialog` | `title, body, danger, requireTyping, onConfirm` | Xác nhận hành động; `requireTyping="XOA"` cho hành động phá hủy |

### 3.4 User management
| Component | Mô tả |
|-----------|------|
| `UserTable` | Bảng user (dùng `DataTable` + cột riêng) |
| `UserFormDialog` | Tạo/sửa user (`mode: 'create'|'edit'`), validation inline |
| `InviteUserDialog` | Mời qua email, sinh link copy |
| `UserDetailPanel` | Trang chi tiết: hồ sơ + thống kê + tab |
| `ReassignLeadsDialog` | Chuyển lead của user sang người khác/pool |
| `ResetPasswordDialog` | Hai lựa chọn: MK tạm / link reset |

### 3.5 Lead distribution
| Component | Mô tả |
|-----------|------|
| `LeadDistributionTabs` | 3 tab: thủ công / luật / pool |
| `AssignableLeadTable` | Bảng lead có chọn nhiều để gán |
| `AssignLeadDialog` | Chọn người nhận kèm tải + gợi ý ít tải nhất |
| `EmployeeLoadPicker` | Select nhân viên hiển thị số lead/deal mở |
| `RuleList` | Danh sách luật, kéo-thả ưu tiên (@dnd-kit) |
| `RuleCard` | Một luật: tên, điều kiện tóm tắt, chia cho, toggle |
| `RuleBuilderDialog` | Tạo/sửa luật |
| `ConditionRow` | 1 dòng [field][op][value], operator động theo field |
| `ActionEditor` | Chọn targets + strategy |
| `RulePreview` | Đếm + danh sách lead khớp (debounced) |
| `PoolConfigPanel` | Bật/tắt pool + giới hạn |
| `PoolLeadTable` | Lead trong pool |
| `ClaimLeadDialog` | (User) xem & nhận lead từ pool |

### 3.6 Dashboard / Audit / Settings
| Component | Mô tả |
|-----------|------|
| `AdminKpiCard` | Thẻ số liệu (tái dùng `Card` + icon + delta) |
| `EmployeePerformanceTable` | Xếp hạng hiệu suất nhân viên |
| `LeadDistributionChart` | Donut/bar phân bổ lead (recharts) |
| `AuditFeed` | Feed audit gần đây (compact) |
| `AlertList` | Danh sách cảnh báo có link hành động |
| `AuditTable` | Bảng audit, hàng mở rộng xem before/after |
| `AuditRow` | 1 dòng audit expandable |
| `ExportCsvButton` | Xuất CSV theo bộ lọc |
| `SettingsLayout` | Sub-sidebar + content |
| `SortableList` | List kéo-thả (nguồn lead) — @dnd-kit |
| `ColorPicker` | Chọn màu hex (cho tag) |
| `TagEditor` | Thêm/sửa/xóa tag toàn cục |

## 4. Pattern thiết kế dùng chung

### 4.1 PageHeader chuẩn
```
[Tiêu đề lớn — Poppins 24px text-dark]      [Nút phụ] [Nút chính primary]
[Mô tả ngắn — text-muted 14px]
```

### 4.2 Badge spec
```
RoleBadge:    ● Admin   → bg role.admin.bg, text role.admin.DEFAULT, radius xl, 12px
StatusBadge:  ● Active  → dot + nhãn; màu theo status token
```

### 4.3 Bảng → card (responsive)
- `DataTable` nhận prop `mobileCard: (row) => ReactNode`.
- <768px tự render card list thay vì `<table>`; bulk vẫn hoạt động qua checkbox trên card.

### 4.4 Dialog xác nhận phá hủy
- `danger` → nút đỏ; `requireTyping` → phải gõ đúng chuỗi mới enable nút.
- Luôn nêu hệ quả (vd "28 lead sẽ...") trước khi xác nhận.

### 4.5 Toast & feedback
- Tạo `lib/toast.ts` (nếu chưa có) — success/error/info, auto-dismiss 4s.
- Mọi mutation: optimistic update + toast + revalidate.

## 5. Accessibility
- Mọi nút icon-only có `aria-label`.
- Dialog: focus trap, Esc đóng, trả focus về trigger (Radix đã hỗ trợ).
- Bảng chọn nhiều: checkbox có label ẩn; "chọn tất cả" có `aria-checked` mixed.
- Tương phản màu badge đạt WCAG AA (đã chọn bg nhạt + text đậm).
- Kéo-thả luật/nguồn: có phương án bàn phím (dnd-kit keyboard sensor).

## 6. Quy ước code (bám codebase hiện tại)
- File kebab-case, component PascalCase, hằng UPPER_SNAKE.
- `'use client'` cho component tương tác; import tuyệt đối `@/`.
- Tách logic gọi API vào `lib/api-client.ts` (thêm các nhóm: `usersApi`, `rulesApi`, `auditApi`, `settingsApi`).
- Không prop-drill sâu: dùng `lib/auth-context.tsx` cho user/role.
