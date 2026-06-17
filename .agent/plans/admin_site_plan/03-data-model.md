# 03 — Data Model (mở rộng cho Admin)

> Mở rộng schema gốc (`docs/03-database-schema.md`) để hỗ trợ user management, ownership,
> chia lead, pool, luật chia tự động, lời mời và audit. Giữ SQLite + better-sqlite3.

## 1. Sơ đồ quan hệ mở rộng

```
                         ┌───────────────┐
                         │     users     │
                         ├───────────────┤
                         │ id (PK)       │
                         │ email (uniq)  │
                         │ password      │
                         │ name          │
                         │ role          │  admin | user
                         │ status        │  active | inactive | invited | deleted
                         │ avatar_url    │
                         │ last_login_at │
                         │ created_at    │
                         │ updated_at    │
                         └───────┬───────┘
            owner_id ┌───────────┼───────────────┬───────────────┐
                     ▼           ▼               ▼               ▼
              ┌──────────┐ ┌──────────┐   ┌──────────┐   ┌──────────────┐
              │  leads   │ │  deals   │   │ contacts │   │  activities  │
              │ owner_id │ │ owner_id │   │ owner_id │   │  owner_id    │
              │ (NULL=   │ └──────────┘   └──────────┘   └──────────────┘
              │  pool)   │
              └────┬─────┘
                   │ lead_id
       ┌───────────┴────────────┐
       ▼                        ▼
┌────────────────┐     ┌──────────────────┐
│ lead_assignments│     │  (tags/reminders │
│ (lịch sử gán)   │     │   như hiện có)   │
└────────────────┘     └──────────────────┘

┌──────────────────────┐   ┌──────────────────┐   ┌────────────────┐
│ lead_distribution_   │   │   invitations    │   │   audit_logs   │
│ rules                │   │                  │   │                │
└──────────────────────┘   └──────────────────┘   └────────────────┘

┌──────────────────────┐
│   system_settings    │  (key-value cấu hình)
└──────────────────────┘
```

## 2. Thay đổi bảng `users`

```sql
-- Mở rộng so với schema gốc
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'
  CHECK(status IN ('active','inactive','invited','deleted'));
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN last_login_at DATETIME;
-- role: thu hẹp còn 2 giá trị dùng thực tế
-- (giữ CHECK cũ cho tương thích, nhưng app chỉ phát sinh 'admin'|'user')
```

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `status` | TEXT | `active` đang dùng · `invited` đã mời, chưa đặt MK · `inactive` bị khóa · `deleted` soft-delete |
| `avatar_url` | TEXT | Ảnh đại diện (tùy chọn) |
| `last_login_at` | DATETIME | Lần đăng nhập gần nhất — hiển thị ở admin |

## 3. Bảng mới: `lead_assignments` (lịch sử gán lead)

Ghi lại **mọi lần** một lead được gán/đổi chủ — phục vụ truy vết và báo cáo.

```sql
CREATE TABLE IF NOT EXISTS lead_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  from_user_id INTEGER,                 -- NULL nếu từ pool / lead mới
  to_user_id INTEGER NOT NULL,
  assigned_by INTEGER NOT NULL,         -- admin thực hiện (NULL nếu hệ thống tự chia)
  method TEXT NOT NULL DEFAULT 'manual' -- manual | rule | claim | round_robin
    CHECK(method IN ('manual','rule','claim','round_robin')),
  rule_id INTEGER,                      -- luật nào đã chia (nếu method='rule')
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_assign_lead ON lead_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_assign_to ON lead_assignments(to_user_id);
```

## 4. Bảng mới: `lead_distribution_rules` (luật chia tự động)

```sql
CREATE TABLE IF NOT EXISTS lead_distribution_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100,  -- số nhỏ = ưu tiên cao, chạy trước
  is_active INTEGER NOT NULL DEFAULT 1,
  conditions TEXT NOT NULL,               -- JSON: mảng điều kiện (AND)
  action TEXT NOT NULL,                   -- JSON: { type, targets, strategy }
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_rules_active ON lead_distribution_rules(is_active, priority);
```

**Cấu trúc JSON `conditions`** (tất cả phải đúng — AND):
```json
[
  { "field": "source",  "op": "in",       "value": ["Website", "LinkedIn"] },
  { "field": "score",   "op": "gte",      "value": 70 },
  { "field": "company", "op": "contains", "value": "Corp" }
]
```
- `field`: `source | score | status | company | tag | email_domain`
- `op`: `eq | ne | in | not_in | gte | lte | contains`

**Cấu trúc JSON `action`**:
```json
{
  "type": "assign",
  "targets": [3, 5, 8],          // user_id đủ điều kiện nhận
  "strategy": "round_robin"       // round_robin | least_load | first_available | pool
}
```
- `round_robin`: luân phiên đều giữa targets.
- `least_load`: gán cho user đang giữ ít lead "đang mở" nhất.
- `first_available`: user đầu tiên trong danh sách đang active.
- `pool`: đưa vào pool (owner_id = NULL) cho user tự nhận.

## 5. Bảng mới: `invitations` (mời tạo tài khoản)

```sql
CREATE TABLE IF NOT EXISTS invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin','user')),
  token TEXT UNIQUE NOT NULL,            -- token ngẫu nhiên cho link mời
  invited_by INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' -- pending | accepted | expired | revoked
    CHECK(status IN ('pending','accepted','expired','revoked')),
  expires_at DATETIME NOT NULL,
  accepted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invited_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_invite_token ON invitations(token);
```

## 6. Bảng mới: `audit_logs`

```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,              -- ai thực hiện
  action TEXT NOT NULL,                  -- vd: user.create, lead.assign, user.role_change
  entity_type TEXT NOT NULL,             -- user | lead | deal | rule | setting | ...
  entity_id INTEGER,
  details TEXT,                          -- JSON: { before, after, meta }
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
```

**Danh mục action chuẩn (enum logic):**
```
user.create, user.update, user.delete, user.role_change,
user.activate, user.deactivate, user.password_reset, user.invite,
lead.assign, lead.bulk_assign, lead.reassign, lead.claim,
rule.create, rule.update, rule.delete, rule.toggle,
setting.update, auth.login, auth.login_failed, auth.logout
```

## 7. Bảng mới: `system_settings` (key-value)

```sql
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,                   -- JSON
  updated_by INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
Ví dụ rows:
```
('lead_sources', '["Website","Referral","LinkedIn",...]')
('pool_enabled', 'true')
('pool_claim_limit', '20')              -- tối đa lead 1 user tự nhận
('reminder_sla_hours', '24')
('default_new_user_role', 'user')
('invitation_ttl_hours', '72')
```

## 8. Cập nhật bảng có sẵn — thêm ownership thật

`leads.owner_id` cho phép `NULL` (= nằm trong pool). `deals/contacts/activities.owner_id` NOT NULL.

```sql
-- leads: cho phép owner_id NULL để dùng pool
-- (schema gốc đang NOT NULL → đổi thành nullable khi migrate)
```

## 9. TypeScript types (frontend) — bổ sung vào `types/index.ts`

```ts
export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'invited' | 'deleted';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  // số liệu hiển thị ở admin (tính từ join)
  leadCount?: number;
  openDealCount?: number;
}

export interface Invitation {
  id: number;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  invitedBy: number;
  expiresAt: string;
  createdAt: string;
}

export type AssignMethod = 'manual' | 'rule' | 'claim' | 'round_robin';

export interface LeadAssignment {
  id: number;
  leadId: number;
  fromUserId?: number;
  toUserId: number;
  assignedBy?: number;
  method: AssignMethod;
  ruleId?: number;
  note?: string;
  createdAt: string;
}

export type RuleField = 'source' | 'score' | 'status' | 'company' | 'tag' | 'email_domain';
export type RuleOp = 'eq' | 'ne' | 'in' | 'not_in' | 'gte' | 'lte' | 'contains';
export type RuleStrategy = 'round_robin' | 'least_load' | 'first_available' | 'pool';

export interface RuleCondition { field: RuleField; op: RuleOp; value: string | number | string[]; }
export interface RuleAction { type: 'assign'; targets: number[]; strategy: RuleStrategy; }

export interface DistributionRule {
  id: number;
  name: string;
  priority: number;
  isActive: boolean;
  conditions: RuleCondition[];
  action: RuleAction;
  createdBy: number;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: number;
  details?: { before?: unknown; after?: unknown; meta?: unknown };
  ipAddress?: string;
  createdAt: string;
}
```

## 10. Migration & seed

- Viết migration tăng dần trong `server/src/db/` (không dùng lib). Mỗi bảng mới = một file `.sql` idempotent (`IF NOT EXISTS`).
- Seed: tạo 1 admin mặc định + vài user mẫu + vài luật chia ví dụ để demo.
- `leads.assignee` (text cũ trong mock) → map sang `owner_id` thật khi migrate dữ liệu.
