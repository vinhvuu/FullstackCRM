# 10. Hướng dẫn triển khai Backend từ đầu

## Bước 1: Tạo cấu trúc folder

```bash
mkdir -p server/src/{middleware,routes,services,repositories,utils,db}
mkdir -p server/{data,logs}
touch server/src/main.js
```

## Bước 2: Khởi tạo package.json

```bash
cd server
npm init -y
npm install better-sqlite3
npm install -D nodemon
```

```json
{
  "name": "crm-backend",
  "version": "1.0.0",
  "main": "src/main.js",
  "scripts": {
    "start": "node src/main.js",
    "dev": "nodemon src/main.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

## Bước 3: Tạo HTTP Server cơ bản

```javascript
// src/main.js
const http = require('http');
const { parse } = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url, true);

  res.setHeader('Content-Type', 'application/json');

  if (parsedUrl.pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Bước 4: Chạy thử

```bash
npm run dev
# Hoặc
npm start
```

Test:
```bash
curl http://localhost:3000/api/health
```

## Bước 5: Implement Router

```javascript
// src/router.js

const routes = [];

function get(path, handler) {
  routes.push({ method: 'GET', path, handler });
}

function post(path, handler) {
  routes.push({ method: 'POST', path, handler });
}

function put(path, handler) {
  routes.push({ method: 'PUT', path, handler });
}

function del(path, handler) {
  routes.push({ method: 'DELETE', path, handler });
}

function matchRoute(method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue;

    // Convert route pattern to regex
    const pattern = route.path
      .replace(/:[^/]+/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);
    const match = pathname.match(regex);

    if (match) {
      // Extract params
      const paramNames = (route.path.match(/:[^/]+/g) || []).map(p => p.slice(1));
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler: route.handler, params };
    }
  }
  return null;
}

module.exports = { get, post, put, del, matchRoute };
```

## Bước 6: Tạo Database

```javascript
// src/repositories/db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../data/crm.db');
let db = null;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
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
      role TEXT DEFAULT 'user',
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
      status TEXT DEFAULT 'new',
      source TEXT,
      score INTEGER DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
  `);

  console.log('Database initialized');
}

module.exports = { getDb, initDatabase };
```

## Bước 7: Thêm Routes và Middleware

Cập nhật `main.js`:

```javascript
// src/main.js
const http = require('http');
const { parse } = require('url');
const { getDb, initDatabase } = require('./repositories/db');
const { get, post, put, del, matchRoute } = require('./router');

// Middleware
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

// Import routes
require('./routes/auth');
require('./routes/leads');

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  req.pathname = parsedUrl.pathname;
  req.query = parsedUrl.query;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  try {
    await parseBody(req);

    const matched = matchRoute(req.method, req.pathname);

    if (matched) {
      matched.handler(req, res, matched.params);
    } else {
      sendJson(res, 404, { error: 'Route not found' });
    }
  } catch (error) {
    sendJson(res, 400, { error: 'Invalid JSON' });
  }
});

// Initialize and start
initDatabase();
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Bước 8: Tạo Auth Routes

```javascript
// src/routes/auth.js
const { get, post } = require('../router');
const { getDb } = require('../repositories/db');
const { sendJson } = require('../main');

// Simple password hash (use bcrypt in production!)
function hashPassword(password) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

// POST /api/auth/register
post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return sendJson(res, 400, { error: 'Missing required fields' });
  }

  const db = getDb();
  const hashedPassword = hashPassword(password);

  try {
    const result = db.prepare(`
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `).run(email, hashedPassword, name);

    sendJson(res, 201, {
      id: result.lastInsertRowid,
      email,
      name
    });
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

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || user.password !== hashPassword(password)) {
    return sendJson(res, 401, { error: 'Invalid credentials' });
  }

  sendJson(res, 200, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});
```

## Bước 9: Tạo Leads Routes

```javascript
// src/routes/leads.js
const { get, post, put, del } = require('../router');
const { getDb } = require('../repositories/db');
const { sendJson } = require('../main');

// GET /api/leads
get('/api/leads', (req, res) => {
  const db = getDb();
  const leads = db.prepare(`
    SELECT leads.*, users.name as owner_name
    FROM leads
    JOIN users ON leads.owner_id = users.id
    ORDER BY leads.created_at DESC
  `).all();

  sendJson(res, 200, { data: leads });
});

// GET /api/leads/:id
get('/api/leads/:id', (req, res) => {
  const db = getDb();
  const lead = db.prepare(`
    SELECT leads.*, users.name as owner_name
    FROM leads
    JOIN users ON leads.owner_id = users.id
    WHERE leads.id = ?
  `).get(req.params.id);

  if (!lead) {
    return sendJson(res, 404, { error: 'Lead not found' });
  }

  sendJson(res, 200, { data: lead });
});

// POST /api/leads
post('/api/leads', (req, res) => {
  const { name, company, email, phone, source } = req.body;

  if (!name) {
    return sendJson(res, 400, { error: 'Name is required' });
  }

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO leads (owner_id, name, company, email, phone, source)
    VALUES (1, ?, ?, ?, ?, ?)
  `).run(name, company, email, phone, source);

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);

  sendJson(res, 201, { data: lead });
});

// PUT /api/leads/:id
put('/api/leads/:id', (req, res) => {
  const { name, company, email, phone, source, status, score } = req.body;

  const db = getDb();

  db.prepare(`
    UPDATE leads
    SET name = COALESCE(?, name),
        company = COALESCE(?, company),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        source = COALESCE(?, source),
        status = COALESCE(?, status),
        score = COALESCE(?, score),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, company, email, phone, source, status, score, req.params.id);

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);

  sendJson(res, 200, { data: lead });
});

// DELETE /api/leads/:id
del('/api/leads/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  sendJson(res, 204, {});
});
```

## Bước 10: Test API

```bash
# Start server
npm run dev

# Test health
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@crm.com","password":"test123","name":"Test User"}'

# Create lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","company":"Acme","email":"john@acme.com"}'

# Get all leads
curl http://localhost:3000/api/leads
```

## File mẫu để copy-paste

### server/src/main.js (hoàn chỉnh)

```javascript
const http = require('http');
const { parse } = require('url');
const { getDb, initDatabase } = require('./repositories/db');
const { get, post, put, del, matchRoute } = require('./router');

const PORT = process.env.PORT || 3000;

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

// Import routes
require('./routes/auth');
require('./routes/leads');
require('./routes/deals');
require('./routes/contacts');

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  req.pathname = parsedUrl.pathname;
  req.query = parsedUrl.query;
  req.params = {};

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

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
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { sendJson, errorHandler };
```

## Tiếp theo

1. Thêm authentication middleware
2. Implement JWT tokens
3. Add validation
4. Create remaining routes
5. Write tests
6. Deploy

Xem các file docs chi tiết khác trong thư mục `/docs`.
