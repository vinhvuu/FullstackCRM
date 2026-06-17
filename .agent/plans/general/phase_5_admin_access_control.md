# Phase 5: Admin & Access Control — Detailed Implementation Plan

**Date:** Jun 07, 2026  
**Prerequisite:** Phase 4 complete  
**Goal:** Add user management, role-based access control, admin pages

---

## Task 5.1 — User Management API

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/user-repository.js` | NEW |
| `server/src/services/user-service.js` | NEW |
| `server/src/routes/users.js` | NEW |

### Steps

**5.1.1 — Create server/src/repositories/user-repository.js**

```javascript
const { getDb } = require('./db');

function findAll({ search, role, sortBy = 'created_at', sortOrder = 'DESC', page = 1, limit = 50 }) {
  const db = getDb();
  const conditions = ['1=1'];
  const params = [];

  if (search) {
    conditions.push(`(name LIKE ? OR email LIKE ?)`);
    const s = `%${search}%`;
    params.push(s, s);
  }
  if (role) {
    conditions.push(`role = ?`);
    params.push(role);
  }

  const whereClause = conditions.join(' AND ');
  const offset = (page - 1) * limit;
  const sortColumn = { name: 'name', email: 'email', role: 'role', created_at: 'created_at' }[sortBy] || 'created_at';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

  const rows = db.prepare(`
    SELECT id, email, name, role, created_at, updated_at
    FROM users
    WHERE ${whereClause}
    ORDER BY ${sortColumn} ${order}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`SELECT COUNT(*) as count FROM users WHERE ${whereClause}`).get(...params).count;

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

function findById(id) {
  const db = getDb();
  return db.prepare(`
    SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?
  `).get(id);
}

function create({ email, password, name, role = 'agent' }) {
  const db = getDb();
  const { hashPassword } = require('../utils/password');
  const hashedPassword = hashPassword(password);
  const result = db.prepare(`
    INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)
  `).run(email, hashedPassword, name, role);
  return findById(result.lastInsertRowid);
}

function update(id, { name, email, role }) {
  const db = getDb();
  db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      email = COALESCE(?, email),
      role = COALESCE(?, role),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, email, role, id);
  return findById(id);
}

function updatePassword(id, newPassword) {
  const db = getDb();
  const { hashPassword } = require('../utils/password');
  const hashedPassword = hashPassword(newPassword);
  db.prepare(`UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(hashedPassword, id);
  return { updated: true };
}

function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return { deleted: true };
}

module.exports = { findAll, findById, create, update, updatePassword, remove };
```

**5.1.2 — Create server/src/services/user-service.js**

```javascript
const userRepo = require('../repositories/user-repository');
const { hashPassword } = require('../utils/password');

function getUsers(params) {
  return userRepo.findAll(params);
}

function getUserById(id) {
  const user = userRepo.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
}

function createUser(data) {
  if (!data.email || !data.password || !data.name) {
    const error = new Error('email, password, name are required');
    error.status = 400;
    throw error;
  }
  if (!['admin', 'manager', 'agent'].includes(data.role || 'agent')) {
    const error = new Error('role must be admin, manager, or agent');
    error.status = 400;
    throw error;
  }
  return userRepo.create(data);
}

function updateUser(id, data, currentUser) {
  // Only admin can change roles
  if (data.role && currentUser.role !== 'admin') {
    const error = new Error('Only admins can change roles');
    error.status = 403;
    throw error;
  }
  // Users can only update themselves (unless admin)
  if (currentUser.id !== id && currentUser.role !== 'admin') {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }
  return userRepo.update(id, data);
}

function deleteUser(id, currentUser) {
  if (currentUser.role !== 'admin') {
    const error = new Error('Only admins can delete users');
    error.status = 403;
    throw error;
  }
  if (currentUser.id === id) {
    const error = new Error('Cannot delete your own account');
    error.status = 400;
    throw error;
  }
  getUserById(id); // validate exists
  return userRepo.remove(id);
}

function changePassword(id, currentPassword, newPassword, currentUser) {
  if (currentUser.id !== id && currentUser.role !== 'admin') {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }

  const user = userRepo.findById(id);
  const { verifyPassword } = require('../utils/password');

  if (currentUser.id === id && !verifyPassword(currentPassword, user.password)) {
    const error = new Error('Current password is incorrect');
    error.status = 400;
    throw error;
  }

  return userRepo.updatePassword(id, newPassword);
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, changePassword };
```

**5.1.3 — Create server/src/routes/users.js**

```javascript
const { get, post, put, del } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');
const userService = require('../services/user-service');
const { hashPassword, verifyPassword } = require('../utils/password');

// Admin-only middleware check
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return sendJson(res, 403, { error: 'Admin access required' });
  }
  next();
}

// GET /api/users
get('/api/users', (req, res) => {
  authMiddleware(req, res, () => {
    const params = {
      search: req.query.search,
      role: req.query.role,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
    };
    const result = userService.getUsers(params);
    sendJson(res, 200, result);
  });
});

// GET /api/users/:id
get('/api/users/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const user = userService.getUserById(parseInt(req.params.id));
      sendJson(res, 200, { data: user });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

// POST /api/users
post('/api/users', (req, res) => {
  authMiddleware(req, res, () => {
    adminOnly(req, res, () => {
      try {
        const user = userService.createUser(req.body);
        sendJson(res, 201, { data: user });
      } catch (error) {
        sendJson(res, error.status || 500, { error: error.message });
      }
    });
  });
});

// PUT /api/users/:id
put('/api/users/:id', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const user = userService.updateUser(parseInt(req.params.id), req.body, req.user);
      sendJson(res, 200, { data: user });
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});

// DELETE /api/users/:id
del('/api/users/:id', (req, res) => {
  authMiddleware(req, res, () => {
    adminOnly(req, res, () => {
      try {
        const result = userService.deleteUser(parseInt(req.params.id), req.user);
        sendJson(res, 200, result);
      } catch (error) {
        sendJson(res, error.status || 500, { error: error.message });
      }
    });
  });
});

// PUT /api/users/:id/password
put('/api/users/:id/password', (req, res) => {
  authMiddleware(req, res, () => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = userService.changePassword(
        parseInt(req.params.id),
        currentPassword,
        newPassword,
        req.user
      );
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message });
    }
  });
});
```

---

## Task 5.2 — Audit Log

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/src/repositories/audit-repository.js` | NEW |
| `server/src/routes/audit.js` | NEW |

### Steps

**5.2.1 — Add audit_logs table to db.js**

Add to initDatabase():
```javascript
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);
```

**5.2.2 — Create server/src/repositories/audit-repository.js**

```javascript
const { getDb } = require('./db');

function log({ userId, action, entityType, entityId, details, ipAddress }) {
  const db = getDb();
  db.prepare(`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, action, entityType, entityId || null, details ? JSON.stringify(details) : null, ipAddress || null);
}

function findAll({ userId, action, entityType, dateFrom, dateTo, page = 1, limit = 50 }) {
  const db = getDb();
  const conditions = ['1=1'];
  const params = [];

  if (userId) conditions.push('a.user_id = ?') && params.push(userId);
  if (action) conditions.push('a.action = ?') && params.push(action);
  if (entityType) conditions.push('a.entity_type = ?') && params.push(entityType);
  if (dateFrom) conditions.push('a.created_at >= ?') && params.push(dateFrom);
  if (dateTo) conditions.push('a.created_at <= ?') && params.push(dateTo);

  const whereClause = conditions.join(' AND ');
  const offset = (page - 1) * limit;

  const rows = db.prepare(`
    SELECT a.*, u.name as user_name, u.email as user_email
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`SELECT COUNT(*) as count FROM audit_logs a WHERE ${whereClause}`).get(...params).count;

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

module.exports = { log, findAll };
```

**5.2.3 — Create server/src/routes/audit.js**

```javascript
const { get } = require('../router');
const { sendJson } = require('../main');
const { authMiddleware } = require('../middleware/auth');

get('/api/audit', (req, res) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return sendJson(res, 403, { error: 'Admin access required' });
    }

    const auditRepo = require('../repositories/audit-repository');
    const params = {
      userId: req.query.user ? parseInt(req.query.user) : undefined,
      action: req.query.action,
      entityType: req.query.entityType,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
    };

    const result = auditRepo.findAll(params);
    sendJson(res, 200, result);
  });
});
```

---

## Task 5.3 — Admin Frontend Pages

### Files to Create/Modify

| File | Action |
|------|--------|
| `app/(dashboard)/admin/users/page.tsx` | NEW — user management page |
| `app/(dashboard)/admin/audit/page.tsx` | NEW — audit log page |
| `components/admin/user-table.tsx` | NEW |
| `components/admin/user-form.tsx` | NEW |

### Steps

**5.3.1 — Create user management page**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api-client';
import { toast } from '@/lib/toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await usersApi.getAll({ limit: 100 });
        setUsers(res.data);
      } catch (err: any) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-white rounded-2xl p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge-${user.role}`}>{user.role}</span>
                </td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**5.3.2 — Create audit log page similarly**

---

## Verification Steps

```bash
# Test user CRUD as admin
curl http://localhost:3001/api/users -H "Authorization: Bearer ADMIN_TOKEN"
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"email":"agent@vanhcrm.com","password":"test123","name":"Agent User","role":"agent"}'

# Test role-based access (non-admin should be denied)
# Test audit log endpoint
curl "http://localhost:3001/api/audit" -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## File Summary

| File | Action |
|------|--------|
| `server/src/repositories/user-repository.js` | NEW |
| `server/src/repositories/audit-repository.js` | NEW |
| `server/src/services/user-service.js` | NEW |
| `server/src/routes/users.js` | NEW |
| `server/src/routes/audit.js` | NEW |
| `server/src/repositories/db.js` | MODIFY — add audit_logs table |
| `app/(dashboard)/admin/users/page.tsx` | NEW |
| `app/(dashboard)/admin/audit/page.tsx` | NEW |
| `components/admin/user-table.tsx` | NEW |
| `components/admin/user-form.tsx` | NEW |