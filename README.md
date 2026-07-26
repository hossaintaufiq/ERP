# Garments ERP

**Enterprise Garments Manufacturing ERP** — a production-oriented platform for apparel factories covering commercial, merchandising, supply chain, shop-floor production, quality, HR/payroll, logistics, and finance.

Built as a full-stack system with a **Next.js** client and **NestJS** API. Persistence uses a **JSON Repository layer** designed so PostgreSQL (or any SQL store) can replace storage later **without rewriting controllers or business services**.

---

## Table of contents

1. [Product overview](#product-overview)
2. [Architecture](#architecture)
3. [Repository & folder structure](#repository--folder-structure)
4. [Technology stack](#technology-stack)
5. [Domain modules](#domain-modules)
6. [Garments workflow](#garments-workflow)
7. [Getting started](#getting-started)
8. [Authentication & security](#authentication--security)
9. [API surface](#api-surface)
10. [Frontend application shell](#frontend-application-shell)
11. [Data model & seed](#data-model--seed)
12. [Swapping JSON for PostgreSQL](#swapping-json-for-postgresql)
13. [Operations & deployment](#operations--deployment)
14. [Roadmap](#roadmap)

---

## Product overview

Garments ERP digitizes the end-to-end apparel manufacturing value chain:

| Capability | What it delivers |
|------------|------------------|
| Commercial | Leads, quotations, buyers, sales orders, style catalog |
| Engineering | Tech packs, BOM calculation, costing inputs |
| Procurement | PR/PO lifecycle with inventory side effects |
| Warehouse | Multi-warehouse capacity & stock transfers |
| Production | 8-stage planning board + line telemetry |
| Quality | QC gates / AQL inspection records |
| HR | Employees, attendance, leave, payroll |
| Logistics | Shipments, containers, export documentation hooks |
| Finance | Invoices, expenses, receivables/payables, margins |
| Platform | RBAC, audit trail, notifications, settings, AI assistant, reports |

**Design intent:** behave like a serious ERP (Odoo / ERPNext / Dynamics-class modularity), not a CRUD demo. Cross-module workflows mutate related aggregates and emit notifications + audit events.

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  Next.js 14 (App Router) · TypeScript · Tailwind · TanStack │
│  Query · Axios · Recharts · Auth-gated SPA shell            │
└─────────────────────────────┬──────────────────────────────┘
                              │ REST + JWT Bearer
┌─────────────────────────────▼──────────────────────────────┐
│                      Application Layer                      │
│  NestJS Controllers · DTOs · ValidationPipe · Swagger       │
│  Guards (JWT / Roles / Permissions) · Throttling · Helmet   │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                       Domain Layer                          │
│  Services · Workflow orchestrator · Dashboard / AI / Reports│
└─────────────────────────────┬──────────────────────────────┘
                              │ IRepository<T>
┌─────────────────────────────▼──────────────────────────────┐
│                   Infrastructure Layer                      │
│  JsonRepository · JsonFileStore (atomic write)              │
│  backend/src/data/*.json                                    │
│  (future) PostgresRepository / Prisma / TypeORM             │
└────────────────────────────────────────────────────────────┘
```

### Architectural principles

1. **Clean Architecture** — Controllers never touch files; services never know JSON vs SQL.
2. **Repository Pattern** — `IRepository<T>` + `JsonRepository<T>` isolate persistence.
3. **Dependency Injection** — NestJS modules wire services and storage.
4. **Workflow orchestration** — Purchase / Production / Invoice transitions update related domains.
5. **Security by default** — Global JWT guard; `@Public()` for login/health only.
6. **Observable API** — Uniform `{ success, data, meta }` envelope + global exception filter.

### Key documents

| Document | Purpose |
|----------|---------|
| [`docs/architecture.md`](docs/architecture.md) | System design summary |
| [`docs/api.md`](docs/api.md) | Endpoint catalog |
| [`docs/modules.md`](docs/modules.md) | Module map |
| [`docs/workflow.md`](docs/workflow.md) | Manufacturing workflow |
| [`docs/deployment.md`](docs/deployment.md) | Runbook |
| [`docs/development-roadmap.md`](docs/development-roadmap.md) | Next milestones |
| [`docs/checklist.md`](docs/checklist.md) | Delivery checklist |

---

## Repository & folder structure

```
Garment ERP/
├── README.md
├── .gitignore
├── docs/                      # Architecture & runbooks
├── frontend/                  # Next.js ERP client
│   ├── src/
│   │   ├── app/               # layout, page, globals
│   │   ├── components/
│   │   │   ├── auth/          # Login
│   │   │   ├── layout/        # Sidebar, Header
│   │   │   ├── modules/       # Domain screens
│   │   │   └── ui/            # DataTable, PageHeader, StatCard
│   │   ├── data/              # Legacy mock fallbacks
│   │   └── lib/               # api, auth, providers, cn
│   └── package.json
└── backend/                   # NestJS ERP API
    ├── src/
    │   ├── common/            # filters, guards, repository, storage
    │   ├── data/              # JSON collections (seeded)
    │   ├── modules/           # auth, dashboard, workflow, CRUD domains…
    │   ├── scripts/           # seed.ts, generate-modules.ts
    │   ├── app.module.ts
    │   └── main.ts
    └── package.json
```

---

## Technology stack

### Frontend
- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** design system (premium teal/stone ERP theme)
- **TanStack Query** for server state
- **Axios** API client with refresh-token interceptor
- **Recharts** for executive dashboards
- **Lucide** icons

### Backend
- **NestJS 10** + TypeScript
- **Passport JWT** authentication
- **class-validator** / **class-transformer**
- **Swagger** (`/docs`)
- **Helmet**, **CORS**, **Throttler**
- **bcryptjs** password hashing
- **JSON file store** with atomic rename writes

---

## Domain modules

### Backend collections (CRUD + stats)

`employees`, `buyers`, `suppliers`, `styles`, `orders`, `inventory`, `purchase-orders`, `machines`, `production`, `attendance`, `leave`, `payroll`, `shipments`, `invoices`, `qc`, `expenses`, `notifications`, `audit`, `warehouses`, `stock-transfers`, `leads`, `quotations`, `companies`, `branches`, `departments`, `users`

Each supports: list (search/sort/filter/pagination), get, create, patch, delete, `stats/summary`.

### Special services

| Service | Responsibility |
|---------|----------------|
| `auth` | Login, refresh, forgot-password, profile |
| `dashboard` | Executive KPIs, charts, alerts |
| `workflow` | Cross-module PO / production / invoice transitions |
| `finance` | Cash summary + order profitability |
| `reports` | Report preview + authenticated CSV export |
| `ai` | Rule-based operations copilot |
| `search` | Global entity search |
| `settings` | Company configuration |
| `health` | Public liveness probe |

### Frontend screens

Dashboard, Leads, Customers, Sales, Styles, BOM, Inventory, Warehouse, Purchase, Suppliers, Production Planning/Tracking, QC, Machines, Employees, Attendance, Leave, Payroll, Shipment, Finance, Reports, Roles, Notifications, AI Assistant, Settings — plus Login.

---

## Garments workflow

```
Lead → Buyer → Quotation → Sales Order → BOM
  → Material PO → Warehouse → Production Planning
  → Cutting → Sewing → Print/Embroidery → Washing
  → Finishing → QC → Packing → Shipment → Invoice → Payment
```

### Implemented side effects

1. **Advance PO** → next lifecycle status → inventory increment on receive/stock → notification → audit  
2. **Advance Production** → next of 8 stages → sync order stage → notification → audit  
3. **Invoice Shipment** → create invoice → mark order invoiced → notification  

---

## Getting started

### Prerequisites

- Node.js **18+** (20/24 recommended)
- npm 9+

### 1) Backend

```bash
cd backend
npm install
npm run seed          # writes backend/src/data/*.json
npm run start:dev     # http://localhost:4000/api
```

- API base: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/docs`
- Health: `http://localhost:4000/api/health`

### 2) Frontend

```bash
cd frontend
npm install
# ensure frontend/.env.local contains:
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev           # http://localhost:3000
```

### Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Owner | `owner@garmentserp.com` | `Password@123` |
| HR | `hr@garmentserp.com` | `Password@123` |
| Factory Manager | `factory@garmentserp.com` | `Password@123` |
| Store Manager | `store@garmentserp.com` | `Password@123` |
| Accountant | `accounts@garmentserp.com` | `Password@123` |
| QC | `qc@garmentserp.com` | `Password@123` |
| Merchandiser | `merch@garmentserp.com` | `Password@123` |

---

## Authentication & security

- Passwords hashed with **bcrypt**
- Access token (default 8h) + refresh token (7d)
- Global `JwtAuthGuard`; mark public routes with `@Public()`
- Optional `@Roles()` / `@Permissions()` metadata
- Login writes an **audit** event
- Frontend stores tokens in `localStorage` and refreshes on `401`

> For production: rotate `JWT_SECRET`, prefer httpOnly cookies or a BFF, and terminate TLS at the reverse proxy.

---

## API surface

Standard list query parameters:

`page`, `limit`, `search`, `sortBy`, `sortDir`, plus equality filters for entity fields.

Envelope:

```json
{
  "success": true,
  "data": [],
  "meta": { "total": 520, "page": 1, "limit": 20, "totalPages": 26 }
}
```

Useful endpoints:

```http
POST /api/auth/login
GET  /api/dashboard/executive
GET  /api/finance/summary
POST /api/workflow/purchase-orders/:id/advance
POST /api/workflow/production/:id/advance
POST /api/ai/ask
GET  /api/search?q=zara
GET  /api/reports/production?timeline=Monthly
```

Full catalog: [`docs/api.md`](docs/api.md).

---

## Frontend application shell

1. User authenticates via Login screen  
2. `AuthProvider` + `QueryClientProvider` wrap the app  
3. Sidebar switches domain modules (SPA)  
4. Header provides global search (API), role simulator, theme toggle, logout  
5. Modules that are API-first: Dashboard, Purchase, Production Planning, Employees, Leave, Warehouse, Leads, Notifications, Finance, Reports, AI, Settings  

Legacy mock screens remain available for offline demo continuity where not yet fully migrated.

---

## Data model & seed

`npm run seed` generates relational demo data under `backend/src/data/`, including approximately:

| Entity | Volume |
|--------|--------|
| Employees | 520 |
| Orders | 180 |
| Inventory SKUs | 220 |
| Machines | 140 |
| Attendance logs | 600 |
| Payroll rows | ~389 |
| QC inspections | 200 |
| Notifications | 100 |
| Audit events | 300 |
| Purchase orders | 120 |
| Shipments / invoices | 60 |

Entities are linked (order → buyer/style, production → order, shipment → order, invoice → shipment, etc.).

---

## Swapping JSON for PostgreSQL

1. Keep `IRepository<T>` unchanged  
2. Implement `PostgresRepository<T>` (Prisma/TypeORM/Knex)  
3. Rebind providers in Nest modules  
4. Migrate seed script to SQL migrations / fixtures  
5. Controllers & services stay intact  

This is the intentional seam for enterprise hardening.

---

## Operations & deployment

| Environment | Command |
|-------------|---------|
| API dev | `cd backend && npm run start:dev` |
| UI dev | `cd frontend && npm run dev` |
| API build | `cd backend && npm run build && npm run start:prod` |
| UI build | `cd frontend && npm run build && npm run start` |
| Reseed | `cd backend && npm run seed` |

Environment variables:

**`backend/.env`**
```
PORT=4000
JWT_SECRET=change-me-in-production
JWT_EXPIRES=8h
CORS_ORIGIN=http://localhost:3000
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Roadmap

Near-term enterprise upgrades (tracked in `docs/development-roadmap.md`):

- [ ] PostgreSQL repository adapter + migrations  
- [ ] Deep-linkable App Router paths (`/sales`, `/inventory/:id`)  
- [ ] shadcn/ui component system migration  
- [ ] Real PDF generation (invoice, packing list, payslip)  
- [ ] Permission-gated UI by JWT claims  
- [ ] Playwright + Nest e2e for workflow paths  
- [ ] Buyer portal & biometric device webhooks  

---

## License

Portfolio / demonstration software for Softlligence. Contact for commercial licensing.

---

**Garments ERP** — modular, workflow-driven, architecture-ready for real factory operations.
