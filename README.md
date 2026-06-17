# VanhCorp CRM

A modern CRM system for AI transformation sales teams built with Next.js 14, Tailwind CSS, and Shadcn/ui.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Charts:** Recharts
- **TypeScript:** Full type safety
- **Drag & Drop:** @dnd-kit

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | AI Transformation Score, stats cards, charts, insights panel |
| **Leads** | Table with search, filtering, scoring, CRUD operations |
| **Deals** | Kanban-style pipeline with drag-and-drop |
| **Contacts** | Contact cards with quick actions |
| **Activities** | Task timeline with status tracking |
| **Reports** | Analytics and data visualization |
| **Settings** | User profile and team management |

## Project Structure

```
crm_project/
├── app/                      # Next.js App Router
│   ├── (auth)/               # login, register pages
│   └── (dashboard)/          # dashboard, leads, contacts, deals, activities, reports, settings
├── components/
│   ├── ui/                   # Shadcn/ui primitives
│   ├── layout/               # sidebar, header, shell
│   ├── leads/                # Leads components
│   ├── deals/                 # Deals components
│   └── activities/           # Activities components
├── lib/
│   ├── mock-data.ts          # Mock data (temporary)
│   ├── constants.ts          # Deal stages, lead sources, nav items
│   └── utils.ts              # Utilities (cn(), formatCurrency, formatDate)
├── types/
│   └── index.ts              # TypeScript definitions
└── docs/                     # Backend technical design
```

## Design System

- **Primary:** Indigo (#6366F1)
- **CTA:** Emerald (#10B981)
- **Typography:** Poppins (headings) + Open Sans (body)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | Run Next.js lint |
| `npx tsc --noEmit` | Type-check |

## License

MIT