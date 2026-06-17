# Development Roadmap — Jun 07, 2026

## Project Status

| Layer | Status |
|-------|--------|
| Frontend | 100% — All pages, components, features built |
| Backend  | 0%   — Only documented in docs/, no code |
| Integration | 0% — Mock data only, no API calls |

---

## Phase 1: Backend Foundation

### 1.1 Init server project
- Create `server/` directory with `package.json`
- Install `better-sqlite3`, `nodemon`
- Setup folder structure: `src/{middleware,routes,services,repositories,utils,db}`

### 1.2 Build HTTP router + middleware
- Custom router with regex path matching (`:param` support)
- CORS headers, JSON body parser, request logger
- Error handler middleware

### 1.3 Create SQLite schema
- Tables: `users`, `leads`, `contacts`, `deals`, `activities`, `tags`, `lead_tags`, `reminders`
- WAL mode, foreign keys enabled

### 1.4 Implement JWT auth
- Register endpoint (`POST /api/auth/register`)
- Login endpoint (`POST /api/auth/login`) with JWT token
- Auth middleware to protect routes
- Current user endpoint (`GET /api/auth/me`)

---

## Phase 2: REST API — Core Entities

### 2.1 Leads API
- `GET /api/leads` — list with filter, sort, paginate, search
- `GET /api/leads/:id` — detail with interactions
- `POST /api/leads` — create
- `PUT /api/leads/:id` — update
- `DELETE /api/leads/:id` — delete
- `POST /api/leads/:id/convert` — convert to deal

### 2.2 Deals API
- `GET /api/deals` — list with stage filter
- `GET /api/deals/:id` — detail
- `POST /api/deals` — create
- `PUT /api/deals/:id` — update (including stage change)
- `DELETE /api/deals/:id` — delete

### 2.3 Contacts API
- `GET /api/contacts` — list
- `GET /api/contacts/:id` — detail
- `POST /api/contacts` — create
- `PUT /api/contacts/:id` — update
- `DELETE /api/contacts/:id` — delete

### 2.4 Activities API
- `GET /api/activities` — list with status filter
- `POST /api/activities` — create
- `PUT /api/activities/:id` — update status
- `DELETE /api/activities/:id` — delete

### 2.5 Tags & Reminders API
- `GET /api/tags` — list predefined tags
- `POST /api/leads/:id/tags` — assign tags to lead
- `GET /api/leads/:id/reminders` — list reminders
- `POST /api/leads/:id/reminders` — create reminder
- `PUT /api/reminders/:id` — update (complete, snooze)

---

## Phase 3: Dashboard & Search API

### 3.1 Dashboard stats
- `GET /api/dashboard/stats` — counts, growth %, AI transformation score
- `GET /api/dashboard/trends` — chart data (revenue, leads over time)
- `GET /api/dashboard/insights` — AI suggestions

### 3.2 Search
- `GET /api/search?q=...` — global search across leads, contacts, deals

### 3.3 Reports
- `GET /api/reports/revenue` — revenue by period
- `GET /api/reports/sources` — lead source distribution
- `GET /api/reports/pipeline` — deal stage distribution

---

## Phase 4: Frontend-Backend Integration

### 4.1 API client layer
- Create `lib/api-client.ts` — fetch wrapper with base URL, auth headers, error handling
- Type-safe request/response functions for every endpoint

### 4.2 Replace mock data
- Update all pages to call real API instead of `mock-data.ts`
- Remove or minimize mock-data dependency

### 4.3 UX improvements
- Loading skeletons/spinners for all data-fetching states
- Error boundaries per route group
- Toast notifications for create/update/delete actions
- Empty states for all lists

### 4.4 Form validation
- Install `zod` for schema validation
- Add validation to all forms (lead, deal, contact, activity)
- Server-side validation mirror

---

## Phase 5: Admin & Access Control

### 5.1 User management
- Admin CRUD for users
- Role assignment (admin, manager, agent)

### 5.2 Role-based middleware
- Protect admin-only routes
- Scope data access by user role

### 5.3 Admin pages
- User management page
- Audit log viewer

---

## Phase 6: Testing

### 6.1 Backend tests
- Unit tests for services
- API integration tests with supertest

### 6.2 Frontend tests
- Component tests with Vitest + React Testing Library
- Page smoke tests

---

## Phase 7: Deployment

### 7.1 Docker
- Dockerfile for backend (Node.js + SQLite)
- Dockerfile for frontend (Next.js standalone)
- docker-compose.yml with both services

### 7.2 CI/CD
- GitHub Actions: lint, test, build
- Deploy to VPS / Railway / Fly.io

### 7.3 Documentation
- Deployment guide
- Environment variable reference
- API documentation (OpenAPI)

---

## Execution Order

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
   │          │          │          │
   └──────────┴──────────┴──────────┘
                  ↓
          Core Backend Done
                  ↓
          Integration Start
```

**Immediate next step:** Start Phase 1.1 — Initialize backend server project.
