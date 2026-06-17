# Detailed UI Implementation Guide — Admin Site

> This document provides a complete implementation guide for the VanhCorp CRM Admin Site.
> Based on admindocs (`00-overview.md` to `09-implementation-roadmap.md`).

---

## Table of Contents

1. [Overview & Scope](#1-overview--scope)
2. [Tech Stack & Design System](#2-tech-stack--design-system)
3. [Project Structure](#3-project-structure)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [User Management UI](#5-user-management-ui)
6. [Lead Distribution UI](#6-lead-distribution-ui)
7. [Admin Dashboard UI](#7-admin-dashboard-ui)
8. [Audit Log UI](#8-audit-log-ui)
9. [System Settings UI](#9-system-settings-ui)
10. [Backend Implementation](#10-backend-implementation)
11. [Testing & Deployment](#11-testing--deployment)

---

## 1. Overview & Scope

### 1.1 Goals

Transform VanhCorp CRM from a frontend mock-data app into a fully operational CRM with:
- Real authentication (JWT)
- User management (Admin creates/manage accounts)
- Role-based access control (2 levels: Admin / User)
- Lead ownership and distribution (manual + rule-based)
- Audit logging
- System settings

### 1.2 Scope

**In Scope:**
- User CRUD, invite, lock, reset password
- RBAC 2 levels (Admin/User)
- Lead distribution: manual assign, bulk assign, rule-based engine, pool
- Audit log
- Admin dashboard ( KPIs, performance, alerts)
- System settings (general, lead sources, tags, SLA)

**Out of Scope:**
- Multi-team/department hierarchy
- SSO/OAuth
- Billing
- Real email server (use invite links)

### 1.3 Current State (Gap Analysis)

| Feature | Current | Required |
|---------|---------|----------|
| Login | UI only (mock) | Real JWT auth |
| Users | None | Full CRUD |
| Ownership | `assignee` (text) | `owner_id` (FK) |
| Lead Distribution | None | Manual + Rules + Pool |
| Audit | None | Full logging |
| Admin Dashboard | None | KPIs + alerts |

---

## 2. Tech Stack & Design System

### 2.1 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Vanilla Node.js (no Express), better-sqlite3
- **Auth:** JWT (jsonwebtoken), bcrypt
- **Drag & Drop:** @dnd-kit/core, @dnd-kit/sortable
- **Charts:** recharts (already in use)
- **Icons:** lucide-react

### 2.2 Design Tokens (MUST follow)

From `tailwind.config.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#6366F1` (hover `#4F46E5`) | Primary buttons, links, active nav |
| `cta` | `#10B981` (hover `#059669`) | Positive actions, success states |
| `background` | `#F5F3FF` | Page background |
| `text-dark` | `#1E1B4B` | Headings, primary text |
| `text-muted` | `#64748B` | Labels, secondary text |
| radius | `2xl=16px`, `xl=12px` | Cards, dialogs, inputs |
| font | Poppins (headings), Open Sans (body) | Typography |

### 2.3 Component Hierarchy

```
components/
├── admin/
│   ├── AdminGuard.tsx         # Route protection
│   ├── AdminSubnav.tsx       # Tab navigation in admin
│   ├── Can.tsx               # Permission helper
│   ├── AdminLayout.tsx       # Layout wrapper
├── users/
│   ├── UserTable.tsx
│   ├── UserRow.tsx
│   ├── UserFormDialog.tsx    # Create/edit user
│   ├── InviteUserDialog.tsx
│   ├── UserFilters.tsx
│   ├── UserDetailPage.tsx
├── leads/
│   ├── LeadDistributionTabs.tsx
│   ├── AssignableLeadTable.tsx
│   ├── AssignBulkBar.tsx
│   ├── AssignLeadDialog.tsx
│   ├── RuleList.tsx
│   ├── RuleCard.tsx
│   ├── RuleBuilderDialog.tsx
│   ├── ConditionRow.tsx
│   ├── ActionEditor.tsx
│   ├── PoolConfigPanel.tsx
│   ├── PoolLeadTable.tsx
│   ├── ClaimLeadDialog.tsx
│   ├── ReassignLeadsDialog.tsx
├── dashboard/
│   ├── AdminKpiCard.tsx
│   ├── EmployeePerformanceTable.tsx
│   ├── LeadDistributionChart.tsx
│   ├── AuditFeed.tsx
│   ├── AlertList.tsx
├── audit/
│   ├── AuditTable.tsx
│   ├── AuditRow.tsx
│   ├── AuditFilters.tsx
│   ├── ExportCsvButton.tsx
├── settings/
│   ├── SettingsLayout.tsx
│   ├── SettingItem.tsx
│   ├── SortableList.tsx
│   ├── ColorPicker.tsx
│   ├── TagEditor.tsx
```

---

## 3. Project Structure

### 3.1 Directory Layout

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── accept-invite/page.tsx
├── (dashboard)/
│   ├── page.tsx              # Dashboard (personalized)
│   ├── leads/page.tsx        # Lead list (filtered by owner)
│   ├── leads/[id]/page.tsx
│   ├── contacts/page.tsx
│   ├── deals/page.tsx
│   ├── activities/page.tsx
│   ├── reports/page.tsx
│   ├── settings/page.tsx    # Personal settings
│   └── admin/                # ADMIN ONLY
│       ├── layout.tsx        # AdminGuard + AdminSubnav
│       ├── page.tsx          # /admin overview
│       ├── users/
│       │   ├── page.tsx       # User list
│       │   ├── new/page.tsx   # Create user
│       │   └── [id]/page.tsx  # User detail
│       ├── leads/
│       │   ├── page.tsx      # Distribution hub
│       │   ├── assign/page.tsx
│       │   ├── rules/page.tsx
│       │   └── pool/page.tsx
│       ├── audit/page.tsx
│       └── settings/
│           ├── page.tsx
│           ├── general/page.tsx
│           ├── lead-sources/page.tsx
│           ├── tags/page.tsx
│           └── sla/page.tsx
```

### 3.2 Types (Add to `types/index.ts`)

```typescript
// User & Auth
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
  leadCount?: number;
  openDealCount?: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// Invitations
export interface Invitation {
  id: number;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  invitedBy: number;
  expiresAt: string;
  createdAt: string;
}

// Lead Distribution
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

// Distribution Rules
export type RuleField = 'source' | 'score' | 'status' | 'company' | 'tag' | 'email_domain';
export type RuleOp = 'eq' | 'ne' | 'in' | 'not_in' | 'gte' | 'lte' | 'contains';
export type RuleStrategy = 'round_robin' | 'least_load' | 'first_available' | 'pool';

export interface RuleCondition {
  field: RuleField;
  op: RuleOp;
  value: string | number | string[];
}

export interface RuleAction {
  type: 'assign';
  targets: number[];
  strategy: RuleStrategy;
}

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

// Audit
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

// Settings
export interface SystemSetting {
  key: string;
  value: string; // JSON
  updatedBy?: number;
  updatedAt: string;
}
```

---

## 4. Authentication & Authorization

### 4.1 Auth Flow

```
1. User POST /api/auth/login {email, password}
2. Server validates, returns JWT + user info
3. Client stores JWT (httpOnly cookie recommended)
4. All subsequent requests include JWT in header
```

### 4.2 Implementation Components

#### Auth Context (`lib/auth-context.tsx`)

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setUser(data.data.user);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### Admin Guard (`components/admin/AdminGuard.tsx`)

```typescript
'use client';

import { useAuth } from '@/lib/auth-context';
import { RedirectTo } from '@/components/ui/redirect';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <FullPageSkeleton />;
  if (!user) return <RedirectTo path="/login" />;
  if (user.role !== 'admin') return <ForbiddenPage />;

  return <>{children}</>;
}
```

#### Can Component (`components/admin/Can.tsx`)

```typescript
'use client';

import { useAuth } from '@/lib/auth-context';

interface CanProps {
  role?: 'admin' | 'user';
  children: React.ReactNode;
}

export function Can({ role, children }: CanProps) {
  const { user } = useAuth();

  if (!user) return null;
  if (role && user.role !== role) return null;

  return <>{children}</>;
}
```

### 4.3 Auth Pages

Update existing auth pages to work with real backend:

**`app/(auth)/login/page.tsx`** — Update form handler:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password);
    router.push(user.role === 'admin' ? '/admin' : '/');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

---

## 5. User Management UI

### 5.1 User List Page (`app/(dashboard)/admin/users/page.tsx`)

```typescript
// Wireframe:
// ┌─────────────────────────────────────────────────────────────┐
// │ Admin › Người dùng                                          │
// │                                                             │
// │ Người dùng                              [+ Mời] [+ Thêm mới] │
// │                                                             │
// │ ┌───────────────────────────────────────────────────────┐ │
// │ │ 🔍 Tìm...  [Vai trò ▾] [Trạng thái ▾] [Sắp xếp ▾]       │ │
// │ └───────────────────────────────────────────────────────┘ │
// │                                                             │
// │ ☐  NGƯỜI DÙNG       VAI TRÒ   TRẠNG THÁI   LEAD   ĐĂNG NHẬP │
// │ ─────────────────────────────────────────────────────────── │
// │ ☐  (A) Nguyễn Văn A   ●Admin  ●Active     45    2h trước   │
// │ ☐  (B) Trần Thị B     ○User   ●Active     28    hôm qua    │
// │ ☐  (C) Lê Văn C       ○User   ◐Invited    0     —          │
// │                                                             │
// │ ◀ 1 2 3 ▶                                 Hiển thị 10/12    │
// └─────────────────────────────────────────────────────────────┘
```

**Features:**
- Search by name/email
- Filter by role (Admin/User) and status (Active/Invited/Inactive)
- Sort by name, created date, last login, lead count
- Bulk actions: change role, lock/unlock, delete
- Row actions menu: view, edit, change role, reset password, lock/unlock, delete

### 5.2 Create User Dialog

**Direct Create:**
```
Fields: name*, email*, role*, password*, mustChangePassword?
Validation: name 2-80 chars, email unique, password ≥8 chars
```

**Invite User:**
```
Fields: emails (comma-separated), role*, ttlHours (default 72)
Output: invitation token, invite URL
```

### 5.3 User Detail Page (`app/(dashboard)/admin/users/[id]/page.tsx`)

```
Tabs: Hồ sơ | Lead | Hoạt động

- View/edit user info
- Change role (admin only)
- Lock/unlock account
- Reset password
- Lead count, deal count, win rate
- Audit history for this user
```

### 5.4 Key Components

| Component | File | Description |
|-----------|------|-------------|
| UserTable | `components/admin/users/UserTable.tsx` | Main table with sorting, filtering |
| UserRow | `components/admin/users/UserRow.tsx` | Single row with actions |
| UserForm | `components/admin/users/UserFormDialog.tsx` | Create/edit form |
| InviteDialog | `components/admin/users/InviteUserDialog.tsx` | Invite form |
| RoleBadge | `components/ui/badge.tsx` | Role display (Admin=primary, User=gray) |
| StatusBadge | `components/ui/badge.tsx` | Status display (Active=green, Invited=amber, Inactive=red) |
| ConfirmDialog | `components/ui/confirm-dialog.tsx` | Reusable confirmation modal |

---

## 6. Lead Distribution UI

### 6.1 Distribution Hub (`app/(dashboard)/admin/leads/page.tsx`)

Three tabs:
1. **Gán thủ công** — Manual assignment
2. **Luật tự động** — Rule-based distribution
3. **Pool** — Unassigned lead pool

```
┌─────────────────────────────────────────────────────────────────┐
│ Admin › Chia lead                                               │
│                                                                 │
│ ┌────────────┬────────────┬────────────┐                      │
│ │ Gán thủ công│ Luật tự động│    Pool    │  ← 3 tabs           │
│ └────────────┴────────────┴────────────┘                      │
│                                                                 │
│ ── Thẻ tổng quan ──                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│ │ Chưa gán  │ │ Trong pool│ │Luật active│ │Gán hôm nay│             │
│ │    17     │ │    34    │ │     3    │ │    52    │             │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Manual Assign Tab

- Filter leads: source, status, owner, score
- Quick filters: Unassigned, My leads, High score, New today
- Select leads → bulk assign to user
- Dialog shows user load (lead count, deal count)

### 6.3 Rules Tab

- List rules with drag-and-drop reorder (use @dnd-kit)
- Toggle rule active/inline
- Create/Edit rule dialog with:
  - Condition builder (AND logic)
  - Action editor (assign to users or pool)
  - Preview showing matching lead count

### 6.4 Pool Tab

- Configure pool settings (enabled, claim limit)
- List unassigned leads
- User can claim leads (if pool enabled + under limit)

### 6.5 Key Components

| Component | Description |
|-----------|-------------|
| `LeadDistributionTabs` | Tab container |
| `AssignableLeadTable` | Lead table with selection |
| `AssignBulkBar` | Bulk action bar |
| `AssignLeadDialog` | Assign to user dialog |
| `RuleList` | Draggable rule list |
| `RuleBuilderDialog` | Create/edit rule |
| `ConditionRow` | Single condition input |
| `ActionEditor` | Assign action config |
| `PoolLeadTable` | Unassigned leads |
| `ClaimLeadDialog` | User claims lead |

---

## 7. Admin Dashboard UI

### 7.1 Page (`app/(dashboard)/admin/page.tsx`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Admin › Tổng quan                                    [Tuần ▾]   │
│                                                                 │
│ ── KPI Cards ──                                                │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │Nhân viên │ │ Tổng lead│ │Lead chưa  │ │ Doanh thu│          │
│ │ 12 active│ │  1,240   │ │  gán: 17  │ │  2.85 tỷ │          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│ ┌───────────────────────┐ ┌────────────────────────┐        │
│ │ Performance by user   │ │ Lead distribution       │        │
│ │ (table)               │ │ (donut chart)            │        │
│ └───────────────────────┘ └────────────────────────┘        │
│                                                                 │
│ ┌───────────────────────┐ ┌────────────────────────┐        │
│ │ Recent activity      │ │ Alerts                  │        │
│ │ (audit feed)          │ │ (warnings)              │        │
│ └───────────────────────┘ └────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 KPI Cards

| Card | Data |
|------|------|
| Active Users | Count of users with status='active' |
| Total Leads | Count of all leads |
| Unassigned Leads | Leads with owner_id=NULL |
| Revenue | Sum of won deal values |

### 7.3 Performance Table

Columns: Rank, User, Leads, Deals Won, Win Rate

### 7.4 Charts

- Donut: Lead distribution by user
- Use existing recharts from main dashboard

### 7.5 Alerts

- Lead unassigned > 24h
- User not logged in > X days
- High-score leads in pool

---

## 8. Audit Log UI

### 8.1 Page (`app/(dashboard)/admin/audit/page.tsx`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Admin › Nhật ký hoạt động                         [ ⭳ Xuất CSV ] │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ 🔍 Tìm...  [Người ▾] [Hành động ▾] [Đối tượng ▾] [Từ][Đến]│  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ THỜI GIAN    NGƯỜI      HÀNH ĐỘNG      ĐỐI TƯỢNG    CHI TIẾT    │
│ ───────────────────────────────────────────────────────────    │
│ 07/06 15:42 (A) Nguyễn A  ●Gán lead    Lead #1240  → Trần B   │
│ 07/06 15:30 (A) Nguyễn A  ●Tạo user    User "Lê C"            │
│ 07/06 14:10 (B) Trần B    ○Đăng nhập   —                      │
│                                                             │
│ ◀ 1 2 3 ... 18 ▶                                            │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Features

- Filter by user, action, entity type, date range
- Sort by date, user, action
- Expand row to see JSON details (before/after, IP)
- Export to CSV
- Pagination (server-side)

### 8.3 Action Colors

| Action Type | Icon/Color |
|------------|------------|
| Create/Assign | Primary (blue) |
| Read/Login | Gray |
| Sensitive (role change, delete, lock) | Red/Amber |

---

## 9. System Settings UI

### 9.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Admin › Cấu hình hệ thống                                        │
│ ┌──────────────┐ ┌──────────────────────────────────────────┐  │
│ │ • Chung      │ │                                          │  │
│ │ • Nguồn lead │ │  (content based on selected item)        │  │
│ │ • Tag        │ │                                          │  │
│ │ • SLA        │ │                                          │  │
│ └──────────────┘ └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Settings Pages

**General** (`/admin/settings/general`):
- System name
- Timezone
- Default user role
- Self-registration toggle
- Invitation TTL

**Lead Sources** (`/admin/settings/lead-sources`):
- CRUD on lead sources list
- Replaces hardcoded `LEAD_SOURCES` in constants

**Tags** (`/admin/settings/tags`):
- CRUD on tags with color picker
- Uses existing `TAG_CONFIGS` structure

**SLA** (`/admin/settings/sla`):
- Unassigned lead warning after X hours
- Default reminder before X hours
- Inactive lead after X days (auto-tag)
- Pool enabled/disabled
- Pool claim limit

---

## 10. Backend Implementation

### 10.1 Database Schema Changes

Add to `server/src/db/schema.sql`:

```sql
-- Users extended
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'
  CHECK(status IN ('active','inactive','invited','deleted'));
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN last_login_at DATETIME;

-- Lead ownership (allow NULL for pool)
ALTER TABLE leads ADD COLUMN owner_id INTEGER REFERENCES users(id);

-- Lead assignments history
CREATE TABLE IF NOT EXISTS lead_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  from_user_id INTEGER,
  to_user_id INTEGER NOT NULL,
  assigned_by INTEGER,
  method TEXT DEFAULT 'manual'
    CHECK(method IN ('manual','rule','claim','round_robin')),
  rule_id INTEGER,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Distribution rules
CREATE TABLE IF NOT EXISTS lead_distribution_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  priority INTEGER DEFAULT 100,
  is_active INTEGER DEFAULT 1,
  conditions TEXT NOT NULL,
  action TEXT NOT NULL,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  token TEXT UNIQUE NOT NULL,
  invited_by INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_by INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 10.2 API Routes

Implement these endpoints (see `admindocs/07-api-spec.md` for details):

**Auth:**
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`
- POST `/api/auth/accept-invite`

**Users (admin):**
- GET `/api/users`
- GET `/api/users/:id`
- POST `/api/users`
- PUT `/api/users/:id`
- PUT `/api/users/:id/role`
- PUT `/api/users/:id/status`
- PUT `/api/users/:id/password`
- DELETE `/api/users/:id`

**Invitations:**
- GET `/api/invitations`
- POST `/api/invitations`
- DELETE `/api/invitations/:id`

**Leads:**
- GET `/api/leads`
- PUT `/api/leads/:id/assign`
- POST `/api/leads/assign`
- POST `/api/leads/:id/claim`

**Rules:**
- GET `/api/rules`
- POST `/api/rules`
- PUT `/api/rules/:id`
- DELETE `/api/rules/:id`
- PUT `/api/rules/:id/toggle`
- POST `/api/rules/preview`

**Pool:**
- GET `/api/pool`
- GET `/api/pool/config`
- PUT `/api/pool/config`

**Audit:**
- GET `/api/audit`
- GET `/api/audit/export`

**Settings:**
- GET `/api/settings`
- PUT `/api/settings`

**Admin Dashboard:**
- GET `/api/admin/overview`
- GET `/api/admin/performance`
- GET `/api/admin/alerts`

---

## 11. Testing & Deployment

### 11.1 Testing Checklist

- [ ] User can register/login/logout
- [ ] Admin can create/invite users
- [ ] Admin can change user roles
- [ ] Admin can lock/unlock users
- [ ] User cannot access admin routes
- [ ] Leads show only user's leads (non-admin)
- [ ] Admin sees all leads
- [ ] Manual lead assignment works
- [ ] Rule-based assignment works
- [ ] Pool claim works within limits
- [ ] Audit logs are created
- [ ] Settings persist

### 11.2 Security Checks

- [ ] JWT validation on all protected routes
- [ ] Passwords hashed with bcrypt
- [ ] SQL injection prevented (parameterized queries)
- [ ] Rate limiting on auth endpoints
- [ ] Ownership filtering for non-admin users

### 11.3 Deployment

Build the frontend:
```bash
npm run build
```

Start the backend:
```bash
cd server && npm start
```

---

## Appendix: Quick Reference

### A. Permission Matrix

| Action | Admin | User |
|--------|:-----:|:----:|
| View all leads | ✅ | ❌ |
| View own leads | ✅ | ✅ |
| Create lead | ✅ | ✅ |
| Edit own lead | ✅ | ✅ |
| Edit all leads | ✅ | ❌ |
| Assign lead | ✅ | ❌ |
| View users | ✅ | ❌ |
| Manage users | ✅ | ❌ |
| View audit | ✅ | ❌ |
| System settings | ✅ | ❌ |

### B. Status Values

**User Status:** `active` | `inactive` | `invited` | `deleted`
**Lead Status:** `new` | `contacted` | `qualified` | `lost`
**Deal Stage:** `lead` | `qualified` | `proposal` | `negotiation` | `won` | `lost`
**Invitation Status:** `pending` | `accepted` | `expired` | `revoked`

### C. Common Components to Reuse

- `Button` — Primary, Outline, Ghost, CTA variants
- `Input`, `Textarea` — Form inputs
- `Select`, `DropdownMenu` — Selections
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Badge` — Status badges
- `Avatar`, `AvatarFallback`
- `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`
- `Checkbox`, `RadioGroup`
- `Popover`, `Tooltip`
- `Skeleton`, `Spinner` — Loading states

---

> **Last Updated:** 2026-06-07
> **Version:** 1.0
> **Based on:** admindocs/00 to 09