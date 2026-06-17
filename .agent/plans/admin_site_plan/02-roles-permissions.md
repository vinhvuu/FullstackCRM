# 02 — Roles & Permissions (RBAC 2 cấp)

> Mô hình đã chốt: **2 cấp — Admin / User**. Đơn giản, đủ dùng cho một đội sale.
> Tài liệu này là **source of truth** cho mọi quyết định phân quyền.

## 1. Hai vai trò

| Vai trò | Mã | Mô tả | Ai gán |
|---------|----|------|--------|
| **Admin** | `admin` | Toàn quyền hệ thống: quản lý user, chia lead, cấu hình, xem mọi dữ liệu | Admin khác hoặc seed ban đầu |
| **User** | `user` | Nhân viên sale: chỉ thao tác trên dữ liệu được giao (owner = mình) | Admin |

> `role` lưu ở bảng `users`. DB constraint: `CHECK(role IN ('admin','user'))`.
> (Schema gốc có thêm `manager` — giai đoạn này **không dùng**, để dành mở rộng sau.)

## 2. Khái niệm "quyền sở hữu" (Ownership)

Phân quyền dữ liệu dựa trên **ownership** chứ không chỉ role:

- Mỗi `lead`, `deal`, `contact`, `activity` có `owner_id`.
- **User**: chỉ đọc/sửa/xóa bản ghi mà `owner_id === user.id`.
- **Admin**: đọc/sửa/xóa **mọi** bản ghi, bất kể owner.
- Lead trong **pool** có `owner_id = NULL` → ai cũng có thể "claim" (theo cấu hình).

Đây là tầng lọc **bắt buộc ở server** (mọi query đều kèm điều kiện owner cho User).

## 3. Ma trận quyền theo module / action

Ký hiệu: ✅ toàn bộ · 🟢 chỉ của mình (own) · ❌ không có

| Module | Action | Admin | User |
|--------|--------|:-----:|:----:|
| **Auth** | Đăng nhập / đăng xuất | ✅ | ✅ |
| | Đổi mật khẩu của mình | ✅ | ✅ |
| **Leads** | Xem | ✅ tất cả | 🟢 own |
| | Tạo | ✅ | ✅ (owner = mình) |
| | Sửa | ✅ tất cả | 🟢 own |
| | Xóa | ✅ tất cả | 🟢 own |
| | **Gán / đổi chủ (assign)** | ✅ | ❌ |
| | **Bulk assign** | ✅ | ❌ |
| | Claim từ pool | ✅ | ✅ (nếu pool bật) |
| **Deals** | Xem / Sửa / Xóa | ✅ tất cả | 🟢 own |
| **Contacts** | Xem / Sửa / Xóa | ✅ tất cả | 🟢 own |
| **Activities** | Xem / Sửa / Xóa | ✅ tất cả | 🟢 own |
| **Reports** | Xem báo cáo toàn hệ thống | ✅ | ❌ |
| | Xem báo cáo cá nhân | ✅ | 🟢 own |
| **Users** | Xem danh sách | ✅ | ❌ |
| | Tạo / mời | ✅ | ❌ |
| | Sửa thông tin | ✅ | 🟢 chỉ profile của mình |
| | Đổi vai trò | ✅ | ❌ |
| | Khóa / mở khóa | ✅ | ❌ |
| | Reset mật khẩu người khác | ✅ | ❌ |
| | Xóa user | ✅ | ❌ |
| **Lead Rules** | Xem / Tạo / Sửa / Xóa luật chia | ✅ | ❌ |
| **Pool** | Cấu hình pool | ✅ | ❌ |
| **Audit** | Xem nhật ký | ✅ | ❌ |
| **System Settings** | Nguồn lead, tag, SLA, general | ✅ | ❌ |

## 4. Quy tắc đặc biệt (Business rules)

1. **Không tự hạ/xóa chính mình:** Admin không thể đổi vai trò của chính mình xuống `user`, không thể tự xóa, không thể tự khóa → tránh khóa cứng hệ thống.
2. **Phải còn ≥ 1 Admin:** không cho phép thao tác khiến hệ thống còn 0 admin (chặn ở service).
3. **Đổi vai trò chỉ Admin làm được** và được ghi audit kèm giá trị trước/sau.
4. **User bị khóa (`status='inactive'`)** không đăng nhập được; lead của họ vẫn giữ owner cho tới khi Admin reassign.
5. **Xóa user:** chặn nếu user còn sở hữu bản ghi → buộc reassign trước (xem [04](./04-ux-user-management.md) §xóa user). Hoặc soft-delete (`status='deleted'`) — khuyến nghị soft-delete.

## 5. Thực thi phân quyền — 3 tầng (defense in depth)

```
┌──────────────────────────────────────────────────────────┐
│ Tầng 1 — UI: ẩn nút/menu/route không đủ quyền             │  (UX, không phải bảo mật)
│   <Can role="admin"> ... </Can>                           │
├──────────────────────────────────────────────────────────┤
│ Tầng 2 — Route guard: chặn vào /admin/* nếu không admin   │  (middleware + AdminGuard)
├──────────────────────────────────────────────────────────┤
│ Tầng 3 — API/Service: kiểm tra role + ownership mọi request│  ★ TẦNG BẢO MẬT THẬT SỰ
│   requireAdmin(req)  /  scopeToOwner(query, user)         │
└──────────────────────────────────────────────────────────┘
```

> **Quy tắc vàng:** UI ẩn nút chỉ để trải nghiệm tốt. **Mọi quyết định bảo mật phải ở tầng 3 (server).** Không bao giờ tin client.

## 6. Mô tả kỹ thuật

### 6.1 Middleware backend (vanilla Node — bám codebase docs/)
```javascript
// server/src/middleware/auth.js
function requireAuth(req, res, next) {
  // verify JWT từ header Authorization -> gắn req.user = { id, role }
}
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return sendJson(res, 403, { error: 'Admin access required' });
  next();
}
// Áp dụng ownership filter cho User
function scopeToOwner(user) {
  return user.role === 'admin' ? {} : { owner_id: user.id };
}
```

### 6.2 Guard phía Next.js
```tsx
// components/admin/admin-guard.tsx
'use client';
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSkeleton />;
  if (!user) return <RedirectTo path="/login" />;
  if (user.role !== 'admin') return <Forbidden />; // 403 thân thiện
  return <>{children}</>;
}
```
Đặt trong `app/(dashboard)/admin/layout.tsx` để bọc toàn bộ khu admin.

### 6.3 Helper UI có điều kiện
```tsx
// components/admin/can.tsx
export function Can({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useAuth();
  return user?.role === role ? <>{children}</> : null;
}
// Dùng: <Can role="admin"><Button>Gán lead</Button></Can>
```

### 6.4 Auth context
```tsx
// lib/auth-context.tsx  (mới)
type AuthUser = { id: number; name: string; email: string; role: 'admin' | 'user'; status: string };
// useAuth() -> { user, loading, login, logout, refresh }
// Token lưu httpOnly cookie (khuyến nghị) hoặc localStorage (đơn giản hơn, kém an toàn hơn).
```

## 7. Bảng tham chiếu nhanh permission (dùng cho code)

Định nghĩa hằng số tập trung để cả FE/BE dùng chung khái niệm:

```ts
// lib/permissions.ts (mới)
export const PERMISSIONS = {
  USERS_MANAGE: 'users:manage',
  LEADS_ASSIGN: 'leads:assign',
  LEADS_VIEW_ALL: 'leads:view_all',
  RULES_MANAGE: 'rules:manage',
  AUDIT_VIEW: 'audit:view',
  SETTINGS_MANAGE: 'settings:manage',
} as const;

export const ROLE_PERMISSIONS: Record<'admin' | 'user', string[]> = {
  admin: Object.values(PERMISSIONS),
  user: [], // user dựa trên ownership, không có quyền admin nào
};

export function can(role: 'admin' | 'user', perm: string) {
  return ROLE_PERMISSIONS[role].includes(perm);
}
```

> Thiết kế hằng số này giúp **nâng cấp lên RBAC tùy biến sau** mà không phải sửa rải rác: chỉ cần đổi map `ROLE_PERMISSIONS` thành dữ liệu DB.
