# 3. Database Schema

## 3.1 Giới thiệu SQLite

- **Embedded**: Không cần server riêng
- **Single file**: Toàn bộ database trong 1 file `.db`
- **ACID**: Đảm bảo tính toàn vẹn
- **Zero config**: Không cần cài đặt phức tạp

## 3.2 Entity Relationship

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │    leads     │     │   contacts   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │────<│ owner_id     │     │ id (PK)      │
│ email        │     │ id (PK)      │     │ owner_id (FK)│
│ password     │     │ name         │     │ name         │
│ name         │     │ company      │     │ email        │
│ role         │     │ email        │     │ phone        │
│ created_at   │     │ phone        │     │ company      │
│ updated_at   │     │ status       │     │ created_at  │
└──────────────┘     │ source       │     └──────────────┘
                    │ score        │            │
                    │ created_at   │            │
                    └──────────────┘            │
                           │                    │
                           │                    │
                    ┌──────────────┐     ┌──────────────┐
                    │    deals     │     │  activities  │
                    ├──────────────┤     ├──────────────┤
                    │ id (PK)      │     │ id (PK)      │
                    │ lead_id (FK)│────<│ lead_id (FK)│
                    │ title        │     │ contact_id(FK│
                    │ value        │     │ type         │
                    │ stage        │     │ description  │
                    │ probability  │     │ due_date     │
                    │ owner_id (FK│     │ status       │
                    │ created_at   │     │ created_at   │
                    └──────────────┘     └──────────────┘
```

## 3.3 Schema SQL

```sql
-- src/db/schema.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user', 'manager')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'qualified', 'lost', 'won')),
  source TEXT,
  score INTEGER DEFAULT 0 CHECK(score >= 0 AND score <= 100),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER,
  contact_id INTEGER,
  owner_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  value REAL DEFAULT 0,
  stage TEXT DEFAULT 'lead' CHECK(stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  probability INTEGER DEFAULT 0 CHECK(probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL,
  lead_id INTEGER,
  contact_id INTEGER,
  deal_id INTEGER,
  type TEXT NOT NULL CHECK(type IN ('call', 'email', 'meeting', 'task', 'note')),
  description TEXT,
  due_date DATETIME,
  completed_at DATETIME,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (deal_id) REFERENCES deals(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_contacts_owner ON contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_deals_owner ON deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_activities_owner ON activities(owner_id);
CREATE INDEX IF NOT EXISTS idx_activities_due_date ON activities(due_date);
```

## 3.4 Migrations

**Không dùng migration library**, tự viết đơn giản:

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

async function initDatabase() {
  const db = getDb();
  const schema = fs.readFileSync(
    path.join(__dirname, '../db/schema.sql'),
    'utf8'
  );

  // Execute each statement separately
  schema.split(';').forEach(statement => {
    if (statement.trim()) {
      db.exec(statement);
    }
  });

  console.log('Database initialized');
}

module.exports = { getDb, initDatabase };
```

## 3.5 Seed Data

```sql
-- src/db/seed.sql

-- Admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES
('admin@crm.com', '$2b$10$...', 'Admin User', 'admin');

-- Regular user (password: user123)
INSERT INTO users (email, password, name, role) VALUES
('user@crm.com', '$2b$10$...', 'Sales User', 'user');

-- Sample leads
INSERT INTO leads (owner_id, name, company, email, status, score) VALUES
(2, 'John Smith', 'Acme Corp', 'john@acme.com', 'qualified', 85),
(2, 'Jane Doe', 'Tech Inc', 'jane@tech.com', 'new', 60);

-- Sample contacts
INSERT INTO contacts (owner_id, name, email, company, position) VALUES
(2, 'Bob Wilson', 'bob@company.com', 'Company LLC', 'CEO');

-- Sample deals
INSERT INTO deals (lead_id, owner_id, title, value, stage, probability) VALUES
(1, 2, 'Acme Enterprise Deal', 50000, 'proposal', 70);
```

## 3.6 Queries mẫu

**Join leads với owner:**
```sql
SELECT
  leads.*,
  users.name as owner_name,
  users.email as owner_email
FROM leads
JOIN users ON leads.owner_id = users.id
WHERE leads.id = ?
```

**Aggregate deals by stage:**
```sql
SELECT
  stage,
  COUNT(*) as count,
  SUM(value) as total_value,
  AVG(probability) as avg_probability
FROM deals
WHERE owner_id = ?
GROUP BY stage
```

**Activities với relations:**
```sql
SELECT
  activities.*,
  leads.name as lead_name,
  contacts.name as contact_name,
  deals.title as deal_title
FROM activities
LEFT JOIN leads ON activities.lead_id = leads.id
LEFT JOIN contacts ON activities.contact_id = contacts.id
LEFT JOIN deals ON activities.deal_id = deals.id
WHERE activities.owner_id = ?
ORDER BY activities.due_date ASC
```
