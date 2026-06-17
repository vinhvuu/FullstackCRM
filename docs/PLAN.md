# Development Plan

## Phase 1: Project Setup
- [x] Initialize Next.js frontend project
- [x] Configure Tailwind CSS, TypeScript
- [ ] Initialize backend server project with vanilla Node.js
- [ ] Setup SQLite database + schema
- [ ] Create folder structure (router, middleware, services, repositories)
- [ ] Setup environment variables (.env)
- [ ] Create basic HTTP server entry point
- [ ] Setup CORS, body parser, logger middleware
- [ ] Setup linting and formatting

## Phase 2: Authentication
- [ ] Register API endpoint
- [ ] Login API endpoint (JWT)
- [ ] Auth middleware (protect routes)
- [ ] Current user API
- [ ] Login page (frontend)
- [ ] Register page (frontend)
- [ ] Auth context / state management
- [ ] Protected routes (frontend)

## Phase 3: Core CRUD – Leads
- [ ] Lead database table
- [ ] Lead repository (CRUD operations)
- [ ] Lead service (business logic)
- [ ] Lead API routes
- [ ] Lead list page (frontend)
- [ ] Lead create/edit form (frontend)
- [ ] Lead detail page (frontend)
- [ ] Validation (backend + frontend)

## Phase 4: Core CRUD – Deals & Contacts
- [ ] Deal database table + repository + service + API
- [ ] Contact database table + repository + service + API
- [ ] Activity database table + repository + service + API
- [ ] Deal pages (frontend)
- [ ] Contact pages (frontend)
- [ ] Activity log component (frontend)

## Phase 5: Dashboard & Search
- [ ] Dashboard API (summary stats)
- [ ] Dashboard page with charts (frontend)
- [ ] Global search API
- [ ] Search UI component
- [ ] Pagination component
- [ ] Filter components (status, date range, assignee)

## Phase 6: Admin & Access Control
- [ ] User management API (admin only)
- [ ] Role-based access control (middleware)
- [ ] Admin pages (frontend)
- [ ] User profile page
- [ ] Audit log

## Phase 7: Testing & Polish
- [ ] Unit tests (services)
- [ ] API integration tests
- [ ] Error boundary components
- [ ] Loading states, empty states
- [ ] Responsive design pass
- [ ] Accessibility audit

## Phase 8: Deployment
- [ ] Dockerfile (backend)
- [ ] Dockerfile (frontend)
- [ ] Docker Compose
- [ ] Production build scripts
- [ ] Deployment guide
- [ ] CI/CD pipeline
