# Architecture

## Folder structure

```
project-root/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Login/Register pages
│   ├── (dashboard)/         # Dashboard layout & pages
│   ├── layout.tsx
│   └── globals.css
├── components/              # Shared React components
├── lib/                     # Utility functions, API client
├── types/                   # TypeScript type definitions
│
├── server/                  # Backend (vanilla Node.js)
│   └── src/
│       ├── main.js          # Entry point
│       ├── router.js        # Routing system
│       ├── middleware/       # Auth, CORS, logger, validator
│       ├── routes/          # Route handlers (auth, users, leads, ...)
│       ├── services/        # Business logic layer
│       ├── repositories/    # Database operations (SQL)
│       ├── utils/           # Helpers (JWT, hashing, response)
│       └── db/              # Schema SQL, seed data
│
├── docs/                    # Project documentation
├── .agent/rules/            # AI coding rules
├── public/                  # Static assets
└── docker-compose.yml
```

## Backend architecture

- **Router** receives HTTP request, matches URL + method
- **Middleware** chain: CORS → Logger → Body Parser → Auth (if required) → Validator
- **Route handler** extracts params, calls service
- **Service** contains business logic, validation rules
- **Repository** handles SQLite queries (raw SQL, no ORM)
- **Response** returned in standard JSON format

```
Request → Middleware → Router → Handler → Service → Repository → DB
                                                                    ↓
Response ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← JSON
```

## Frontend architecture

- **Page** (App Router) handles layout + data fetching
- **Component** handles UI rendering (reusable)
- **API service** (in `lib/`) handles HTTP requests to backend
- **Types** (in `types/`) define data structures shared across frontend
- **State** managed via React context for auth; local state for forms

```
Page → Component (UI)
  ↓
API Service (lib/) → HTTP → Backend
  ↓
Types (interfaces)
```

## Design principles

- **Separation of concerns**: routes thin, services fat, repositories simple
- **No ORM**: raw SQL for learning and control
- **No Express**: custom framework to understand HTTP internals
- **Minimal dependencies**: only what's necessary
