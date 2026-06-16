# 07 — API Specification (Admin)

> REST API cho toàn bộ tính năng admin. Bám kiến trúc vanilla Node trong `docs/` (router thủ công,
> repository/service, better-sqlite3). Base URL: `/api`. Auth: `Authorization: Bearer <JWT>`.

## 1. Quy ước chung

- **Định dạng phản hồi:**
  - Thành công đơn: `{ "data": {...} }`
  - Danh sách phân trang: `{ "data": [...], "total", "page", "limit", "totalPages" }`
  - Lỗi: `{ "error": "message", "fields"?: { field: "msg" } }`
- **Mã trạng thái:** 200 OK · 201 Created · 400 Bad Request · 401 Unauthorized · 403 Forbidden · 404 Not Found · 409 Conflict.
- **Phân trang:** `?page=1&limit=50`. **Sắp xếp:** `?sort=field:asc|desc`.
- **Phân quyền:** mỗi endpoint ghi rõ `[admin]` (chỉ admin) hoặc `[auth]` (mọi user đăng nhập, lọc theo ownership).
- Mọi hành động ghi-dữ liệu của admin → ghi `audit_logs`.

---

## 2. Auth

| Method | Path | Quyền | Mô tả |
|--------|------|-------|------|
| POST | `/api/auth/login` | public | Đăng nhập → trả JWT + user |
| POST | `/api/auth/logout` | auth | Đăng xuất (xóa cookie/session) |
| GET | `/api/auth/me` | auth | Thông tin user hiện tại |
| POST | `/api/auth/forgot-password` | public | Gửi token đặt lại MK |
| POST | `/api/auth/reset-password` | public | Đặt lại MK bằng token |
| POST | `/api/auth/accept-invite` | public | Đặt MK lần đầu bằng token mời |
| PUT | `/api/auth/change-password` | auth | Đổi MK của chính mình |

**POST /api/auth/login**
```
Req:  { "email": "a@vanhcorp.com", "password": "..." }
Res:  { "data": { "token": "jwt...", "user": { id, name, email, role, status } } }
Err:  401 { "error": "Email hoặc mật khẩu không đúng" }
      403 { "error": "Tài khoản đã bị khóa" }   (status=inactive)
```

---

## 3. Users `[admin]` (trừ ghi chú)

| Method | Path | Quyền | Mô tả |
|--------|------|-------|------|
| GET | `/api/users` | admin | Danh sách (search, role, status, sort, page) |
| GET | `/api/users/:id` | admin / chính mình | Chi tiết user |
| POST | `/api/users` | admin | Tạo trực tiếp (đặt MK tạm) |
| PUT | `/api/users/:id` | admin / chính mình* | Cập nhật (chính mình: chỉ name/avatar) |
| PUT | `/api/users/:id/role` | admin | Đổi vai trò |
| PUT | `/api/users/:id/status` | admin | Khóa/mở khóa (active/inactive) |
| PUT | `/api/users/:id/password` | admin / chính mình | Reset/đổi mật khẩu |
| DELETE | `/api/users/:id` | admin | Soft-delete (yêu cầu reassign) |
| GET | `/api/users/:id/stats` | admin | leadCount, openDeals, winRate |

**GET /api/users** — query: `search, role, status, sort, page, limit`
```
Res: { data: [{ id, name, email, role, status, avatarUrl, lastLoginAt,
                 leadCount, openDealCount, createdAt }], total, page, limit, totalPages }
```

**POST /api/users**
```
Req: { "name", "email", "role": "user", "password", "mustChangePassword": true }
Res: 201 { "data": { id, name, email, role, status: "active" } }
Err: 409 { "error": "Email đã được dùng", "fields": { "email": "..." } }
```

**PUT /api/users/:id/role**
```
Req: { "role": "admin" }
Rule: chặn nếu là chính mình hạ quyền; chặn nếu khiến còn 0 admin.
Audit: user.role_change { before:{role}, after:{role} }
Res: { "data": { id, role } }
```

**PUT /api/users/:id/status**
```
Req: { "status": "inactive", "moveLeadsToPool": false }
Rule: không tự khóa mình; không khóa admin cuối cùng.
Side-effect: nếu moveLeadsToPool=true → set owner_id=NULL cho lead của user.
```

**DELETE /api/users/:id**
```
Req (query/body): { "reassignTo": 5 }  hoặc  { "toPool": true }
Rule: nếu user còn sở hữu bản ghi và không có reassignTo/toPool → 409.
Hành vi: soft-delete (status='deleted') + reassign lead/deal/contact/activity.
```

---

## 4. Invitations `[admin]`

| Method | Path | Mô tả |
|--------|------|------|
| GET | `/api/invitations` | Danh sách lời mời (status filter) |
| POST | `/api/invitations` | Tạo lời mời (1 hoặc nhiều email) |
| POST | `/api/invitations/:id/resend` | Tạo token mới, gia hạn |
| DELETE | `/api/invitations/:id` | Thu hồi (status='revoked') |
| GET | `/api/invitations/verify?token=` | public — kiểm tra token hợp lệ (cho trang accept) |

**POST /api/invitations**
```
Req: { "emails": ["c@vanhcorp.com"], "role": "user", "ttlHours": 72 }
Res: 201 { "data": [{ id, email, token, inviteUrl, expiresAt }] }
```

---

## 5. Leads — gán & phân phối

| Method | Path | Quyền | Mô tả |
|--------|------|-------|------|
| GET | `/api/leads` | auth | List — admin: all; user: owner=self; hỗ trợ `owner=unassigned` |
| PUT | `/api/leads/:id/assign` | admin | Gán 1 lead cho user |
| POST | `/api/leads/assign` | admin | **Bulk assign** nhiều lead |
| POST | `/api/leads/:id/claim` | auth | User tự nhận lead từ pool |
| POST | `/api/leads/reassign-from-user` | admin | Chuyển toàn bộ lead của 1 user |
| GET | `/api/leads/:id/assignments` | admin | Lịch sử gán của 1 lead |

**POST /api/leads/assign** (bulk)
```
Req: { "leadIds": [1240,1241], "toUserId": 5, "note": "..." }
Rule: toUser phải active. Ghi mỗi lead 1 dòng lead_assignments(method='manual').
Res: { "data": { "assigned": 2, "skipped": [] } }
Audit: lead.bulk_assign
```

**POST /api/leads/:id/claim**
```
Quyền: auth. Rule: lead phải owner_id=NULL (trong pool); pool_enabled=true;
       user chưa vượt pool_claim_limit (lead đang mở).
Res: { "data": { leadId, ownerId } }   Err: 409 nếu đã có người nhận / quá giới hạn.
```

**POST /api/leads/reassign-from-user**
```
Req: { "fromUserId": 7, "toUserId": 5 }  hoặc  { "fromUserId": 7, "toPool": true }
Res: { "data": { "moved": 28 } }
```

---

## 6. Distribution Rules `[admin]`

| Method | Path | Mô tả |
|--------|------|------|
| GET | `/api/rules` | Danh sách luật (theo priority) |
| POST | `/api/rules` | Tạo luật |
| PUT | `/api/rules/:id` | Sửa luật |
| DELETE | `/api/rules/:id` | Xóa luật |
| PUT | `/api/rules/:id/toggle` | Bật/tắt |
| PUT | `/api/rules/reorder` | Đổi thứ tự ưu tiên (mảng id) |
| POST | `/api/rules/preview` | Đếm/lấy lead khớp điều kiện (chưa lưu) |
| POST | `/api/rules/:id/apply` | Áp luật cho lead cũ chưa gán |

**POST /api/rules**
```
Req: {
  "name": "Lead Website hot",
  "priority": 1,
  "isActive": true,
  "conditions": [ {"field":"source","op":"in","value":["Website"]},
                  {"field":"score","op":"gte","value":70} ],
  "action": { "type":"assign", "targets":[3,5,8], "strategy":"round_robin" }
}
Res: 201 { "data": { id, ... } }
Validation: targets phải là user active; strategy hợp lệ; ít nhất 1 condition.
```

**POST /api/rules/preview**
```
Req: { "conditions": [...] }     (không cần lưu)
Res: { "data": { "matchCount": 23, "sample": [{id,name,source,score}, ...10] } }
```

**PUT /api/rules/reorder**
```
Req: { "orderedIds": [3,1,2] }   → priority gán lại theo thứ tự.
```

> **Engine tự chia** không phải endpoint riêng — chạy trong `lead-service.create()` và khi đẩy lead vào pool. Xem [05] §3.5.

---

## 7. Pool `[admin]` config + `[auth]` view

| Method | Path | Quyền | Mô tả |
|--------|------|-------|------|
| GET | `/api/pool` | auth | Lead trong pool (owner_id=NULL) |
| GET | `/api/pool/config` | auth | Cấu hình pool (enabled, limit) |
| PUT | `/api/pool/config` | admin | Cập nhật cấu hình pool |
| POST | `/api/pool/assign-all` | admin | Gán toàn bộ pool cho 1 user/luật |

---

## 8. Audit `[admin]`

| Method | Path | Mô tả |
|--------|------|------|
| GET | `/api/audit` | List (user, action, entityType, dateFrom, dateTo, page) |
| GET | `/api/audit/export` | Xuất CSV theo bộ lọc |

```
GET /api/audit?user=1&action=lead.assign&dateFrom=2026-06-01&page=1
Res: { data: [{ id, userId, userName, action, entityType, entityId,
                details, ipAddress, createdAt }], total, page, limit, totalPages }
```

---

## 9. System Settings `[admin]` (đọc: `[auth]` với key công khai)

| Method | Path | Mô tả |
|--------|------|------|
| GET | `/api/settings` | Tất cả settings (hoặc `?keys=a,b`) |
| PUT | `/api/settings` | Cập nhật nhiều key cùng lúc |
| GET | `/api/settings/lead-sources` | Danh sách nguồn lead (auth — dùng ở form) |
| PUT | `/api/settings/lead-sources` | Cập nhật nguồn lead (admin) |
| GET | `/api/settings/tags` | Danh sách tag (auth) |
| PUT | `/api/settings/tags` | Cập nhật tag (admin) |

```
PUT /api/settings
Req: { "pool_enabled": true, "pool_claim_limit": 20, "reminder_sla_hours": 24 }
Audit: setting.update mỗi key đổi (before/after).
```

---

## 10. Admin Dashboard `[admin]`

| Method | Path | Mô tả |
|--------|------|------|
| GET | `/api/admin/overview` | KPI toàn hệ thống (`?period=week`) |
| GET | `/api/admin/performance` | Hiệu suất theo nhân viên |
| GET | `/api/admin/alerts` | Cảnh báo (lead quá SLA, user lười, lead ngon kẹt pool) |

```
GET /api/admin/overview?period=month
Res: { data: { activeUsers, totalLeads, unassignedLeads, revenue,
               leadsByUser: [{userId,name,count,pct}],
               recentAudit: [...] } }
```

---

## 11. Cấu trúc service/repository (gợi ý)

```
server/src/
├── repositories/
│   ├── user-repository.js
│   ├── invitation-repository.js
│   ├── lead-assignment-repository.js
│   ├── rule-repository.js
│   ├── audit-repository.js
│   └── settings-repository.js
├── services/
│   ├── auth-service.js
│   ├── user-service.js
│   ├── distribution-service.js   ★ engine chia lead (rule matching, strategy)
│   ├── audit-service.js          ★ helper log() gọi từ mọi service
│   └── settings-service.js
├── middleware/
│   ├── auth.js                   (requireAuth, requireAdmin, scopeToOwner)
│   └── audit.js                  (ghi audit tự động / helper)
└── routes/
    ├── auth.js  users.js  invitations.js  leads.js
    ├── rules.js  pool.js  audit.js  settings.js  admin.js
```

## 12. Bảo mật API (nhắc lại — chi tiết `docs/07-security.md`)
- Hash mật khẩu (bcrypt). Không bao giờ trả `password` trong response.
- JWT có hạn; refresh hoặc re-login. Kiểm tra `status='active'` mỗi request quan trọng.
- Rate-limit `/auth/login` (chống brute force) + ghi `auth.login_failed`.
- Validate & sanitize toàn bộ input ở service. Dùng prepared statements (đã có với better-sqlite3).
- Ownership filter áp ở repository cho mọi truy vấn của User.
