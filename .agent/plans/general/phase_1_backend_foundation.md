# Phase 1: Backend Foundation — Detailed Implementation Plan

**Date:** Jun 07, 2026  
**Goal:** Set up the backend server project with vanilla Node.js, SQLite, JWT auth

---

## Task 1.1 — Initialize Server Project

### Steps

**1.1.1 — Create server directory structure**

```bash
mkdir -p server/src/{middleware,routes,services,repositories,utils,db}
mkdir -p server/data
mkdir -p server/logs
```

**1.1.2 — Create server/package.json**

```json
{
  "name": "vanhcrm-backend",
  "version": "1.0.0",
  "description": "VanhCorp CRM Backend API",
  "main": "src/main.js",
  "scripts": {
    "dev": "nodemon src/main.js",
    "start": "node src/main.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

**1.1.3 — Create .env file for server**

```
PORT=3001
DB_PATH=./data/crm.db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
```

**1.1.4 — Install dependencies**

```bash
cd server
npm install
```

### Verification

```bash
node -e "console.log('Node OK')"
ls -la server/
```

---

## Task 1.2 — Build HTTP Router + Middleware

### Steps

**1.2.1 — Create server/src/router.js**

Pattern-matching router that supports:
- `GET`, `POST`, `PUT`, `DELETE` methods
- Path parameters (`:id`, `:leadId`)
- Regex-based route matching

File: `server/src/router.js`

```javascript
const routes = [];

function get(path, handler) { routes.push({ method: 'GET', path, handler }); }
function post(path, handler) { routes.push({ method: 'POST', path, handler }); }
function put(path, handler) { routes.push({ method: 'PUT', path, handler }); }
function del(path, handler) { routes.push({ method: 'DELETE', path, handler }); }

function matchRoute(method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue;

    const pattern = route.path
      .replace(/:[^/]+/g, '([^/]+)')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${pattern}$`);
    const match = pathname.match(regex);

    if (match) {
      const paramNames = (route.path.match(/:[^/]+/g) || []).map(p => p.slice(1));
      const params = {};
      paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
      return { handler: route.handler, params };
    }
  }
  return null;
}

module.exports = { get, post, put, del, matchRoute };
```

**1.2.2 — Create server/src/middleware/cors.js**

```javascript
function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

module.exports = { cors };
```

**1.2.3 — Create server/src/middleware/logger.js**

```javascript
const fs = require('fs');
const path = require('path');

function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${req.method} ${req.pathname}\n`;

  const logPath = path.join(__dirname, '../../logs/access.log');
  fs.appendFileSync(logPath, logLine);

  console.log(logLine.trim());
  next();
}

module.exports = { logger };
```

**1.2.4 — Create server/src/middleware/auth.js**

JWT verification middleware (implement after JWT utils are created).

---

## Task 1.3 — Create SQLite Database

### Steps

**1.3.1 — Create server/src/repositories/db.js**

```javascript
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/crm.db');
let db = null;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('synchronous = NORMAL');
    db.pragma('temp_store = MEMORY');
  }
  return db;
}

function initDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'agent' CHECK(role IN ('admin', 'manager', 'agent')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT,
      phone TEXT,
      status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'qualified', 'lost')),
      source TEXT,
      score INTEGER DEFAULT 50,
      notes TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT,
      phone TEXT,
      position TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      value REAL DEFAULT 0,
      stage TEXT DEFAULT 'lead' CHECK(stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
      probability INTEGER DEFAULT 10,
      contact_id INTEGER,
      lead_id INTEGER,
      expected_close_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (contact_id) REFERENCES contacts(id),
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('call', 'email', 'meeting', 'task')),
      title TEXT NOT NULL,
      description TEXT,
      deal_id INTEGER,
      contact_id INTEGER,
      due_date DATETIME,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'overdue')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (deal_id) REFERENCES deals(id),
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT UNIQUE NOT NULL,
      color TEXT NOT NULL,
      bg_color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lead_tags (
      lead_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (lead_id, tag_id),
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      date DATE NOT NULL,
      time TEXT,
      note TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'overdue', 'snoozed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_deals_owner ON deals(owner_id);
    CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
    CREATE INDEX IF NOT EXISTS idx_activities_owner ON activities(owner_id);
    CREATE INDEX IF NOT EXISTS idx_reminders_lead ON reminders(lead_id);
    CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders(date);
  `);

  // Seed default tags
  const insertTag = db.prepare(`
    INSERT OR IGNORE INTO tags (id, label, color, bg_color) VALUES (?, ?, ?, ?)
  `);

  const defaultTags = [
    [1, 'VIP', '#9333EA', '#F3E8FF'],
    [2, 'Hot', '#EF4444', '#FEE2E2'],
    [3, 'Long-term', '#3B82F6', '#DBEAFE'],
    [4, 'New', '#22C55E', '#DCFCE7'],
    [5, 'Follow-up', '#F59E0B', '#FEF3C7'],
    [6, 'Inactive', '#6B7280', '#F3F4F6'],
  ];

  for (const tag of defaultTags) {
    insertTag.run(...tag);
  }

  console.log('Database initialized with schema');
}

module.exports = { getDb, initDatabase };
```

**1.3.2 — Ensure data directory exists**

The `initDatabase` function will auto-create the db file. But we need to ensure the `data/` folder exists first.

```javascript
// Add to main.js before initDatabase()
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
```

---

## Task 1.4 — Implement JWT Auth

### Steps

**1.4.1 — Create server/src/utils/jwt.js**

Manual JWT implementation using Node.js `crypto` module (no external library).

```javascript
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function base64urlEncode(data) {
  return Buffer.from(JSON.stringify(data))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString();
}

function createToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(header);
  const encodedPayload = base64urlEncode({ ...payload, exp: Date.now() + ms(JWT_EXPIRES_IN) });
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(base64urlDecode(encodedPayload));
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

function ms(str) {
  const match = str.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  const num = parseInt(match[1]);
  const unit = match[2];
  const units = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  return num * units[unit];
}

module.exports = { createToken, verifyToken };
```

**1.4.2 — Create server/src/utils/password.js**

Password hashing using PBKDF2.

```javascript
const crypto = require('crypto');

const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha256';

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return hash.toString('hex') === hashHex;
}

module.exports = { hashPassword, verifyPassword };
```

**1.4.3 — Create server/src/middleware/auth.js**

```javascript
const { verifyToken } = require('../utils/jwt');
const { getDb } = require('../repositories/db');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized — no token provided' }));
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized — invalid or expired token' }));
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(payload.userId);

  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized — user not found' }));
    return;
  }

  req.user = user;
  next();
}

module.exports = { authMiddleware };
```

**1.4.4 — Create server/src/routes/auth.js**

```javascript
const { get, post } = require('../router');
const { getDb } = require('../repositories/db');
const { sendJson } = require('../main');
const { hashPassword, verifyPassword } = require('../utils/password');
const { createToken } = require('../utils/jwt');

// POST /api/auth/register
post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return sendJson(res, 400, { error: 'Missing required fields: email, password, name' });
  }

  if (password.length < 6) {
    return sendJson(res, 400, { error: 'Password must be at least 6 characters' });
  }

  const db = getDb();
  const hashedPassword = hashPassword(password);

  try {
    const result = db.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, 'agent')
    `).run(email, hashedPassword, name);

    const user = { id: result.lastInsertRowid, email, name, role: 'agent' };
    const token = createToken({ userId: user.id, email: user.email });

    sendJson(res, 201, { user, token });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      sendJson(res, 409, { error: 'Email already exists' });
    } else {
      sendJson(res, 500, { error: 'Database error' });
    }
  }
});

// POST /api/auth/login
post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendJson(res, 400, { error: 'Email and password are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !verifyPassword(password, user.password)) {
    return sendJson(res, 401, { error: 'Invalid email or password' });
  }

  const token = createToken({ userId: user.id, email: user.email });

  sendJson(res, 200, {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  });
});

// GET /api/auth/me
get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendJson(res, 401, { error: 'Unauthorized' });
  }

  const { verifyToken } = require('../utils/jwt');
  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    return sendJson(res, 401, { error: 'Invalid or expired token' });
  }

  const db = getDb();
  const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(payload.userId);

  if (!user) {
    return sendJson(res, 404, { error: 'User not found' });
  }

  sendJson(res, 200, { user });
});
```

---

## Task 1.5 — Create Main Server Entry Point

### Steps

**1.5.1 — Create server/src/main.js**

```javascript
const http = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

// Ensure data and logs directories exist
const dataDir = path.join(__dirname, '../data');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const { getDb, initDatabase } = require('./repositories/db');
const { matchRoute } = require('./router');
const { cors } = require('./middleware/cors');
const { logger } = require('./middleware/logger');

const PORT = process.env.PORT || 3001;

// Import routes
require('./routes/auth');

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        req.body = body ? JSON.parse(body) : {};
        resolve();
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function errorHandler(res, error) {
  console.error(error);
  sendJson(res, error.status || 500, {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred'
    }
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  req.pathname = parsedUrl.pathname;
  req.query = parsedUrl.query;

  res.setHeader('Content-Type', 'application/json');

  if (cors(req, res)) return;
  logger(req, res, () => {});

  try {
    await parseBody(req);

    const matched = matchRoute(req.method, req.pathname);

    if (matched) {
      req.params = matched.params;
      matched.handler(req, res);
    } else {
      sendJson(res, 404, { success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
    }
  } catch (error) {
    errorHandler(res, error);
  }
});

initDatabase();
server.listen(PORT, () => {
  console.log(`🚀 VanhCorp API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = { sendJson, errorHandler };
```

**1.5.2 — Add health check route to main.js (before requiring routes)**

```javascript
// Health check — add before route imports
get('/api/health', (req, res) => {
  sendJson(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

---

## Verification Steps

After completing all tasks, run these commands:

```bash
# 1. Start the server
cd server && npm run dev

# 2. In another terminal, test health
curl http://localhost:3001/api/health

# 3. Test register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vanhcrm.com","password":"test123","name":"Test User"}'

# 4. Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vanhcrm.com","password":"test123"}'

# 5. Test me endpoint (use token from login response)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: All endpoints return valid JSON responses with 200/201 status codes.

---

## File Summary

| File | Status |
|------|--------|
| `server/package.json` | NEW |
| `server/.env` | NEW |
| `server/src/main.js` | NEW |
| `server/src/router.js` | NEW |
| `server/src/middleware/cors.js` | NEW |
| `server/src/middleware/logger.js` | NEW |
| `server/src/middleware/auth.js` | NEW |
| `server/src/utils/jwt.js` | NEW |
| `server/src/utils/password.js` | NEW |
| `server/src/repositories/db.js` | NEW |
| `server/src/routes/auth.js` | NEW |