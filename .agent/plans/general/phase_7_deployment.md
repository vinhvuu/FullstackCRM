# Phase 7: Deployment — Detailed Implementation Plan

**Date:** Jun 07, 2026  
**Prerequisite:** Phase 6 complete  
**Goal:** Dockerize app, create CI/CD pipeline, write deployment guide

---

## Task 7.1 — Docker Configuration

### Files to Create/Modify

| File | Action |
|------|--------|
| `Dockerfile` (root) | NEW — frontend Docker |
| `Dockerfile.server` | NEW — backend Docker |
| `docker-compose.yml` | NEW |
| `.dockerignore` | NEW |

### Steps

**7.1.1 — Create Dockerfile (for frontend/Next.js)**

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**7.1.2 — Create Dockerfile.server (for backend)**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ ./server/

# Create data directory for SQLite
RUN mkdir -p /app/data && chmod 755 /app/data

# Create logs directory
RUN mkdir -p /app/logs && chmod 755 /app/logs

EXPOSE 3001

ENV PORT=3001
ENV DB_PATH=/app/data/crm.db

CMD ["node", "server/src/main.js"]
```

**7.1.3 — Create docker-compose.yml**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.server
    container_name: vanhcrm-backend
    ports:
      - "3001:3001"
    volumes:
      - sqlite_data:/app/data
      - ./server/logs:/app/logs
    environment:
      - PORT=3001
      - DB_PATH=/app/data/crm.db
      - JWT_SECRET=${JWT_SECRET:-your-secret-key-change-in-production}
      - JWT_EXPIRES_IN=7d
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: vanhcrm-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
      - NODE_ENV=production
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  sqlite_data:
    driver: local
```

**7.1.4 — Create .dockerignore**

```
node_modules
.next
.git
*.md
.env*
.DS_Store
```

---

## Task 7.2 — CI/CD Pipeline

### Files to Create/Modify

| File | Action |
|------|--------|
| `.github/workflows/ci.yml` | NEW |
| `.github/workflows/deploy.yml` | NEW |

### Steps

**7.2.1 — Create .github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js (Frontend)
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Run typecheck
        run: npm run typecheck

      - name: Run tests
        run: npm run test:run

      - name: Build frontend
        run: npm run build

      - name: Run backend tests
        working-directory: ./server
        run: |
          npm ci
          npm test

  docker-build:
    runs-on: ubuntu-latest
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: .
          dockerfile: Dockerfile.server
          push: true
          tags: vanhcrm/backend:latest

      - name: Build and push frontend
        uses: docker/build-push-action@v5
        with:
          context: .
          dockerfile: Dockerfile
          push: true
          tags: vanhcrm/frontend:latest
```

**7.2.2 — Create .github/workflows/deploy.yml**

```yaml
name: Deploy

on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/vanhcrm
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend npm run db:migrate || true
```

---

## Task 7.3 — Deployment Guide

### Files to Create/Modify

| File | Action |
|------|--------|
| `DEPLOY.md` | NEW — deployment documentation |

### Steps

**7.3.1 — Create DEPLOY.md**

```markdown
# VanhCorp CRM — Deployment Guide

## Prerequisites

- Docker & Docker Compose installed on server
- Node.js 20+ for local development
- SQLite (included in Docker image)

---

## Quick Start (Docker)

### 1. Clone repository

```bash
git clone https://github.com/your-org/vanhcrm.git
cd vanhcrm
```

### 2. Setup environment

```bash
cp .env.example .env
# Edit .env with your JWT_SECRET and other configs
```

### 3. Start with Docker Compose

```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 4. Verify health

```bash
curl http://localhost:3001/api/health
curl http://localhost:3000
```

---

## Manual Deployment (No Docker)

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

---

## Production Checklist

- [ ] Change JWT_SECRET to a secure random value
- [ ] Enable HTTPS (reverse proxy with nginx)
- [ ] Setup automated backups for SQLite database
- [ ] Configure firewall to only allow ports 3000 (frontend) and 3001 (backend, internal only)
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure log rotation

---

## Backup & Restore

### Backup

```bash
docker-compose exec backend cp /app/data/crm.db /app/data/crm.backup.db
docker cp vanhcrm-backend:/app/data/crm.backup.db ./backup-$(date +%Y%m%d).db
```

### Restore

```bash
docker cp ./backup-20260607.db vanhcrm-backend:/app/data/crm.db
docker-compose restart backend
```

---

## Troubleshooting

### Container won't start

```bash
docker-compose logs backend
docker-compose logs frontend
```

### Database locked

```bash
docker-compose exec backend chmod 666 /app/data/crm.db
```

### Reset everything

```bash
docker-compose down -v
docker-compose up -d
```
```

---

## File Summary

| File | Action |
|------|--------|
| `Dockerfile` | NEW |
| `Dockerfile.server` | NEW |
| `docker-compose.yml` | NEW |
| `.dockerignore` | NEW |
| `.github/workflows/ci.yml` | NEW |
| `.github/workflows/deploy.yml` | NEW |
| `DEPLOY.md` | NEW |