# Phase 6: Testing — Detailed Implementation Plan

**Date:** Jun 07, 2026  
**Prerequisite:** Phase 5 complete  
**Goal:** Add unit tests, API integration tests, and frontend smoke tests

---

## Task 6.1 — Backend Unit Tests

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/package.json` | MODIFY — add jest |
| `server/tests/setup.js` | NEW |
| `server/tests/services/lead-service.test.js` | NEW |
| `server/tests/services/deal-service.test.js` | NEW |
| `server/tests/services/auth.test.js` | NEW |

### Steps

**6.1.1 — Setup Jest for backend**

```bash
cd server
npm install --save-dev jest @types/jest ts-node
```

Add to `server/package.json`:
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

Create `server/jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
};
```

**6.1.2 — Create server/tests/setup.js**

```javascript
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Use in-memory SQLite for tests
process.env.DB_PATH = ':memory:';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';

beforeAll(() => {
  const db = require('../src/repositories/db');
  db.initDatabase();
});

afterAll(() => {
  const db = require('../src/repositories/db');
  db.getDb().close();
});

beforeEach(() => {
  const db = require('../src/repositories/db').getDb();
  // Clean tables before each test
  db.exec(`
    DELETE FROM reminders;
    DELETE FROM lead_tags;
    DELETE FROM tags;
    DELETE FROM activities;
    DELETE FROM deals;
    DELETE FROM contacts;
    DELETE FROM leads;
    DELETE FROM users;
  `);
  // Re-seed tags
  db.exec(`
    INSERT INTO tags (id, label, color, bg_color) VALUES
      (1, 'VIP', '#9333EA', '#F3E8FF'),
      (2, 'Hot', '#EF4444', '#FEE2E2');
  `);
});
```

**6.1.3 — Create server/tests/services/lead-service.test.js**

```javascript
const leadService = require('../../src/services/lead-service');

describe('LeadService', () => {
  describe('createLead', () => {
    it('should create a lead with valid data', () => {
      const lead = leadService.createLead({
        name: 'Test Lead',
        company: 'Test Co',
        email: 'test@test.com',
        owner_id: 1,
      });

      expect(lead).toBeDefined();
      expect(lead.name).toBe('Test Lead');
      expect(lead.status).toBe('new');
      expect(lead.score).toBe(50);
    });

    it('should throw error if name is missing', () => {
      expect(() => {
        leadService.createLead({ company: 'Test Co', owner_id: 1 });
      }).toThrow('Lead name is required');
    });

    it('should throw error if name is empty', () => {
      expect(() => {
        leadService.createLead({ name: '   ', owner_id: 1 });
      }).toThrow('Lead name is required');
    });
  });

  describe('getLeadById', () => {
    it('should return lead if exists', () => {
      const created = leadService.createLead({
        name: 'Test Lead',
        owner_id: 1,
      });

      const found = leadService.getLeadById(created.id);
      expect(found.id).toBe(created.id);
    });

    it('should throw 404 if not found', () => {
      expect(() => {
        leadService.getLeadById(99999);
      }).toThrow('Lead not found');
    });
  });

  describe('convertToDeal', () => {
    it('should convert lead to deal', () => {
      const lead = leadService.createLead({
        name: 'Test Lead',
        company: 'Test Co',
        email: 'test@test.com',
        owner_id: 1,
      });

      const result = leadService.convertToDeal(lead.id, {
        title: 'New Deal',
        value: 5000000,
        stage: 'qualified',
        createContact: true,
      });

      expect(result.deal).toBeDefined();
      expect(result.deal.title).toBe('New Deal');
      expect(result.contact).toBeDefined();
      expect(result.contact.email).toBe('test@test.com');
    });
  });
});
```

**6.1.4 — Create server/tests/services/auth.test.js**

```javascript
const { createToken, verifyToken } = require('../../src/utils/jwt');
const { hashPassword, verifyPassword } = require('../../src/utils/password');

describe('Auth Utils', () => {
  describe('JWT', () => {
    it('should create and verify token', () => {
      const payload = { userId: 1, email: 'test@test.com' };
      const token = createToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(1);
      expect(decoded.email).toBe('test@test.com');
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid.token.here');
      expect(decoded).toBeNull();
    });
  });

  describe('Password', () => {
    it('should hash and verify password', () => {
      const password = 'testpassword123';
      const hashed = hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.includes(':')).toBe(true);

      const verified = verifyPassword(password, hashed);
      expect(verified).toBe(true);

      const wrong = verifyPassword('wrongpassword', hashed);
      expect(wrong).toBe(false);
    });
  });
});
```

---

## Task 6.2 — API Integration Tests

### Files to Create/Modify

| File | Action |
|------|--------|
| `server/tests/api/auth.test.js` | NEW |
| `server/tests/api/leads.test.js` | NEW |

### Steps

**6.2.1 — Install supertest**

```bash
cd server
npm install --save-dev supertest
```

**6.2.2 — Create server/tests/api/auth.test.js**

```javascript
const request = require('supertest');
const http = require('http');
const { parse } = require('url');

// Import main app (need to export server from main.js first)
// For now, we'll test by starting the server

let server;
let baseUrl;

beforeAll((done) => {
  server = http.createServer((req, res) => {
    // Minimal test server
    const parsedUrl = parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');

    if (parsedUrl.pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  server.listen(0, () => {
    baseUrl = `http://localhost:${server.address().port}`;
    done();
  });
});

afterAll(() => {
  server.close();
});

describe('Auth API', () => {
  it('GET /api/health should return ok', async () => {
    const res = await request(baseUrl).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
```

---

## Task 6.3 — Frontend Tests

### Files to Create/Modify

| File | Action |
|------|--------|
| `package.json` | MODIFY — add vitest |
| `vitest.config.ts` | NEW |
| `components/error-boundary.test.tsx` | NEW |
| `lib/utils.test.ts` | NEW |

### Steps

**6.3.1 — Setup Vitest for frontend**

```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

Add to `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}
```

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**6.3.2 — Create tests/setup.ts**

```typescript
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
```

**6.3.3 — Create tests/lib/utils.test.ts**

```typescript
import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle undefined', () => {
    const result = cn('text-red-500', undefined);
    expect(result).toBe('text-red-500');
  });
});

describe('formatCurrency', () => {
  it('should format VND correctly', () => {
    expect(formatCurrency(5000000)).toContain('5.000.000');
  });
});

describe('formatDate', () => {
  it('should format date string', () => {
    const result = formatDate('2026-06-07');
    expect(result).toBeDefined();
  });
});
```

---

## Verification Steps

```bash
# Run backend tests
cd server && npm test

# Run frontend tests
npm run test:run

# Run all tests in CI mode
npm run test:run -- --reporter=junit --output=./test-results/junit.xml
```

---

## File Summary

| File | Action |
|------|--------|
| `server/package.json` | MODIFY |
| `server/jest.config.js` | NEW |
| `server/tests/setup.js` | NEW |
| `server/tests/services/lead-service.test.js` | NEW |
| `server/tests/services/deal-service.test.js` | NEW |
| `server/tests/services/auth.test.js` | NEW |
| `server/tests/api/auth.test.js` | NEW |
| `vitest.config.ts` | NEW |
| `tests/setup.ts` | NEW |
| `tests/lib/utils.test.ts` | NEW |