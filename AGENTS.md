# AGENTS.md

Onboarding guide for AI agents (Claude Code, Cursor, Copilot, Codex, etc.) working on this repository. Read this first, every session.

---

## Project Overview

**VanhCorp CRM** — a CRM web app for AI-transformation sales teams. Manages leads, deals, contacts, and activities, with a dashboard, reports, and role-based access (Admin / Staff).

### Current Status

| Layer | Status |
|-------|--------|
| **Frontend** | ✅ Built — all pages/components done, runs on Next.js 14 App Router |
| **Backend** | 📝 Planned only — documented in `docs/`, **no code yet** |
| **Data** | 🔶 Mock data — UI reads from `lib/mock-data.ts`, **no real API calls yet** |

> **Note:** The app is a **frontend-only prototype** backed by mock data. The backend (Node.js + SQLite), REST API, and frontend-backend integration are on the roadmap, not implemented. Do not assume `server/`, `services/`, or `repositories/` exist.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript (strict mode)
- **Styling:** Tailwind CSS — no inline styles
- **UI Components:** Shadcn/ui + Radix UI (in `components/ui/`)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Drag & Drop:** @dnd-kit (used in Deals kanban)
- **Planned Backend:** vanilla Node.js (no Express), SQLite via better-sqlite3, JWT auth

---

## Repository Layout

```
crm_project/
├── app/                      # Next.js App Router
│   ├── (auth)/               # login, register pages
│   └── (dashboard)/          # dashboard, leads, contacts, deals, activities, reports, settings
├── components/
│   ├── ui/                   # Shadcn primitives (button, card, dialog, ...)
│   ├── layout/               # sidebar, header, shell
│   ├── leads/ deals/ activities/   # feature components
├── lib/
│   ├── mock-data.ts          # ← all app data comes from here for now
│   ├── constants.ts          # deal stages, lead sources, nav items
│   └── utils.ts              # cn(), formatCurrency (VND), formatDate (vi-VN)
├── types/index.ts            # all shared TypeScript types & tag configs
├── docs/                     # backend technical design (target architecture)
├── admindocs/                # admin module spec (roles, permissions, data model)
├── plans/                    # phased implementation roadmap + per-feature plans
└── .agent/rules/             # coding rules
```

---

## Commands

```bash
npm install         # install deps
npm run dev         # dev server → http://localhost:3000
npm run build       # production build
npm run start       # run production build
npm run lint        # next lint
npx tsc --noEmit    # type-check
```

---

## Coding Rules

### General
- Explain before large changes; prefer small, safe, focused diffs.
- Don't rewrite unrelated files. Keep the existing folder structure unless asked.
- Use TypeScript strictly. Avoid `any` unless truly unavoidable.

### Frontend
- Reusable UI goes in `components/`; don't put business logic inside UI components.
- Keep shared types in `types/`. Keep API calls in `lib/` (e.g., a future `lib/api-client.ts`).
- Tailwind for styling, no inline styles. Follow App Router conventions.
- Currency is VND, dates/locale are `vi-VN` (see `lib/utils.ts`) — keep this consistent.

### Backend (when it exists)
- Thin route handlers → delegate to `services/`; DB queries live in `repositories/`.
- Validate input via middleware. Consistent error shape: `{ error: { code, message, details? } }`.
- Never drop tables without confirmation. Use clear, versioned migrations.

### Testing
- Add/update tests when changing logic; cover error cases, not just happy paths.
- Don't delete existing tests unless obsolete.

---

## Workflow for a Task

1. Read the relevant context first: `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, and the matching file in `plans/`.
2. Implement **only** the phase/scope in the task. If it's too large, ask to split it.
3. Verify with `npx tsc --noEmit` (and `npm run build` for bigger changes).
4. When done, summarize: **files changed · what was implemented · how to test · remaining issues**.

---

## Where to Look for More

| Resource | Description |
|----------|-------------|
| `docs/PROJECT_BRIEF.md` | Product scope & users |
| `docs/01-architecture.md` … `docs/10-implementation.md` | Target backend architecture |
| `admindocs/` | Admin module (roles, permissions, data model) |
| `plans/2026-06-07_development_roadmap.md` | Roadmap & next steps |
| `plans/01_kanban_view.md`, `plans/02_convert_lead_to_deal.md` | Per-feature plans |

---

## Non-Goals

- No payments/billing
- No mobile app (responsive web only)
- No real-time notifications
- No external API integrations (initially)