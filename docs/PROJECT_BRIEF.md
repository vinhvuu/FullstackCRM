# Project Brief

## Goal
Build a full-stack CRM (Customer Relationship Management) web application for managing leads, deals, contacts, and customer activities.

## Main users
- **Admin** – Full access: manage users, view all data, system configuration
- **Staff** – Manage assigned leads, deals, contacts, log activities
- **Customer** – View deal progress, update profile (future)

## Core features
- Login / Register with JWT authentication
- CRUD: Leads, Deals, Contacts, Activities
- Dashboard with summary stats and charts
- Search, filter, pagination
- Activity logging per deal/contact
- Role-based access control (Admin / Staff)

## Tech stack
- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS
- **Backend:** Vanilla Node.js (no Express), custom router + middleware
- **Database:** SQLite via better-sqlite3
- **Auth:** JWT (jsonwebtoken)
- **Deploy:** TBD (Docker / VPS)

## Non-goals
- No payment / billing integration
- No mobile app (responsive web only)
- No real-time notifications (future consideration)
- No external API integrations (initially)
