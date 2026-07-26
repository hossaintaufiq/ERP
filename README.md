# Garments ERP

### Enterprise Garments Manufacturing ERP — Full-Stack Product Showcase

**A production-style ERP for apparel factories** that connects commercial, merchandising, procurement, warehouse, shop-floor production, quality, HR/payroll, logistics, and finance in one workflow-driven platform.

Built as a **real full-stack system** (not a CRUD demo): **Next.js 14** frontend + **NestJS 10** API + **Clean Architecture** with a swappable JSON → PostgreSQL repository layer.

| | |
|---|---|
| **Live UI** | `http://localhost:3000` |
| **API** | `http://localhost:4000/api` |
| **Swagger** | `http://localhost:4000/docs` |
| **Stack** | Next.js · React · TypeScript · NestJS · JWT · TanStack Query · Tailwind · shadcn/ui · Recharts |
| **Modules** | **30** authenticated business screens + Login |
| **Seed data** | **2,500+** linked enterprise records |
| **UX** | Fully responsive shell · mobile drawer nav · ERP charts on key screens |

---

## Why this project (recruiter summary)

Garment factories still run on spreadsheets and disconnected tools. This project demonstrates how a **modular ERP** can digitize the full apparel value chain — from buyer lead to shipment invoice — with:

- **End-to-end domain coverage** across commercial → cutting → production → finance / AR  
- **Cross-module workflows** (PO advance, production stage advance, shipment invoicing, AR payment) that update inventory, orders, notifications, and audit logs  
- **Enterprise UI shell** — auth gate, categorized sidebar, global search, dark/light theme, live RBAC role simulator, notifications badge, mobile-first layout  
- **Usable ERP analytics** — minimal Recharts (revenue trend, AR aging, line efficiency, stock health, QC mix) wired to live API data  
- **Backend engineering maturity** — NestJS modules, JWT guards, Swagger, throttling, helmet, repository pattern, seed generator  
- **Portfolio-grade documentation** — architecture, API, modules, workflow, deployment, roadmap  

> **Hiring signal:** This is systems thinking + product UX + backend architecture in one repo — closer to Odoo / ERPNext / Dynamics modularity than a todo-app portfolio piece.

---

## Table of contents

1. [Product highlight reel](#product-highlight-reel)  
2. [Website tour — every screen](#website-tour--every-screen)  
3. [Analytics & charts](#analytics--charts)  
4. [User journeys & workflows](#user-journeys--workflows)  
5. [Architecture](#architecture)  
6. [Technology stack](#technology-stack)  
7. [Engineering highlights](#engineering-highlights)  
8. [Data model & seed volume](#data-model--seed-volume)  
9. [Getting started (5 minutes)](#getting-started-5-minutes)  
10. [Demo accounts](#demo-accounts)  
11. [API & security](#api--security)  
12. [Repository structure](#repository-structure)  
13. [PostgreSQL migration path](#postgresql-migration-path)  
14. [Docs index](#docs-index)  
15. [Roadmap](#roadmap)  
16. [Skills demonstrated](#skills-demonstrated)

---

## Product highlight reel

### What you see when you open the app

1. **Login screen** — branded auth gate with JWT session  
2. **Executive dashboard** — live KPIs, multi-chart analytics, action alerts  
3. **Categorized sidebar** — 30 modules grouped like a real ERP navigation (drawer on mobile)  
4. **Header command bar** — global search, role switcher, theme toggle, notifications, logout  
5. **Domain workspaces** — filterable tables, stat cards, charts, workflow action buttons  

### Capabilities at a glance

| Pillar | What the product does |
|--------|------------------------|
| **Commercial** | Leads, quotations, global buyers, sales orders + **size assortment**, finance cash view |
| **Receivables & cost** | **Invoices & AR aging**, record payment, **expense ledger** by category |
| **Engineering** | Style catalog, tech-pack fields, interactive BOM calculator |
| **Supply chain** | Inventory alerts, multi-warehouse, PO lifecycle, supplier ratings |
| **Production** | 8-stage Kanban, **cutting & fabric issue**, line efficiency, machine OEE |
| **Quality** | Cutting → Sewing → Finishing → Final AQL inspection logs + defect charts |
| **People** | 520-employee directory, biometric attendance, leave approvals, payroll |
| **Logistics** | Containers, ports, ETD/ETA, one-click invoice from shipment |
| **Platform** | Org structure, RBAC matrix, **audit trail**, notifications, AI copilot, reports CSV, settings |

### Design language

- Premium **deep teal + stone** enterprise theme (not generic purple AI defaults)  
- Dark / light mode with consistent panels, badges, and data tables  
- **Responsive ERP shell** — `100dvh`, safe-area padding, sheet nav, scrollable filter chips, mobile-aware table columns  
- Motion used for hierarchy (`animate-fade-up`) — not decorative noise  
- Shared primitives: **shadcn/ui** (`Button`, `Card`, `Table`, `Input`, `DropdownMenu`, `Avatar`, `Tabs`, `Tooltip`, `ScrollArea`, `Sheet`…) plus ERP helpers `PageHeader`, `StatCard`, `DataTable`, `ChartCard`

---

## Website tour — every screen

The app is an **authenticated SPA shell**: one Next.js page switches modules via sidebar state (ERP-style workspace, not a marketing multi-page site). Selecting a role **filters the sidebar** and guards modules in real time.

### Overview & platform

| # | Screen | What recruiters should notice |
|---|--------|-------------------------------|
| 1 | **Dashboard** | Live KPIs from `/dashboard/executive` + revenue trend, order status, jobs by stage, line efficiency, stock health, alerts |
| 26 | **Organization** | Branches (factory/office/warehouse), departments, system users |
| 19 | **User Roles & Access** | Live RBAC from `/roles` — permission matrix, role simulation |
| 27 | **Audit Trail** | Compliance log — CREATE / UPDATE / workflow actions with user + IP |
| 20 | **Notifications Hub** | Operational alerts with mark-as-read against API |
| 21 | **AI Assistant** | Operations copilot (`/ai/ask`) for delayed orders, stock, attendance, buyers |
| 22 | **Settings** | Company configuration load/save via `/settings` |

### Commercial & finance

| # | Screen | Showcase value |
|---|--------|----------------|
| 23 | **Leads & Quotations** | Pipeline + quotation list from API |
| 2 | **Customer Management** | Global buyer directory — codes, countries, credit limits, compliance tags |
| 3 | **Sales & Orders** | SO book + **size ratio (assortment)** panel when selecting an order |
| 17 | **Finance & Cash Flow** | Cash position, expense mix, top margins, profitability table |
| 28 | **Invoices & AR** | Open AR, aging buckets, status mix, **Record payment** mutation |
| 29 | **Expense Ledger** | Opex by category with approval status filters |

### Product engineering

| # | Screen | Showcase value |
|---|--------|----------------|
| 4 | **Product & Styles** | Style masters — season, fabric, colors, cost/FOB, buyer link |
| 5 | **BOM Calculator** | Select style + order qty → explode `bomRatio` into material requirements & cost |

### Supply chain & procurement

| # | Screen | Showcase value |
|---|--------|----------------|
| 6 | **Inventory & Stock** | SKU stock, value-by-category chart, low/critical filters |
| 24 | **Warehouses & Transfers** | Capacity + stock transfer records |
| 7 | **Purchase Management** | Create PR/PO + **Advance workflow** (status → inventory side effects) |
| 8 | **Supplier Directory** | Ratings, lead times, materials, AP balances |

### Shop floor & production

| # | Screen | Showcase value |
|---|--------|----------------|
| 9 | **Production Schedule** | 8-stage planning board + **Advance stage** workflow |
| 30 | **Cutting & Fabric Issue** | Job → BOM explode → required vs warehouse stock / shortfall |
| 10 | **Floor Tracking** | Line efficiency & output charts + supervisor telemetry |
| 14 | **Quality Control** | Gate filters + pass/fail mix + defects-by-gate chart |
| 15 | **Machine OEE** | Status mix + top efficiency assets, PM dates |

### Human capital & logistics

| # | Screen | Showcase value |
|---|--------|----------------|
| 11 | **Employees** | Large directory with department filters (520 seeded) |
| 12 | **Biometric Attendance** | Sensor modes + status/method charts + **Simulate scan** |
| 25 | **Leave Management** | Requests + approve mutation |
| 13 | **Payroll** | Period payslips — basic/OT/allowances/deductions/net |
| 16 | **Shipments** | Containers + **Invoice** workflow action |
| 18 | **Reports** | Report types + authenticated CSV download |

### Auth

| Screen | Showcase value |
|--------|----------------|
| **Login** | JWT login, role-aware session, demo multi-persona accounts |

---

## Analytics & charts

Shared chart primitives live in `frontend/src/components/ui/Charts.tsx` (area, bar, donut) — intentionally **minimal and ops-relevant**, not decorative.

| Module | Charts |
|--------|--------|
| **Dashboard** | Revenue trend · order status · jobs by stage · line efficiency · stock health |
| **Finance** | Cash position · expense mix · top order margins |
| **Invoices** | Status mix · AR aging |
| **Expenses** | Status · spend by category |
| **Sales** | Pipeline · book value by buyer · size assortment |
| **Inventory** | Stock status · inventory value by category |
| **Production / Cutting** | Line efficiency · output · fabric required vs available |
| **QC** | Pass/fail · defects by gate |
| **Attendance** | Status mix · check-in method |
| **Machines** | Status · top OEE |
| **Audit** | Actions · touched entities |

---

## User journeys & workflows

### End-to-end garments value chain

```
Lead → Buyer → Quotation → Sales Order (size ratio) → Style / BOM
  → Material Purchase Order → Warehouse / Inventory
  → Cutting & Fabric Issue (stock check)
  → Production Planning (8 stages)
  → Cutting → Sewing → Print/Embroidery → Washing
  → Ironing → Finishing → QC → Packing
  → Shipment → Invoice → AR collection / Payment
```

### Interactive workflows implemented in API + UI

| Action | User path | Side effects |
|--------|-----------|--------------|
| **Advance Purchase Order** | Purchase → Advance | Next PO status → inventory update on receive → notification → audit |
| **Advance Production** | Production Schedule → Advance | Next of 8 stages → sync related sales order stage → notification → audit |
| **Invoice Shipment** | Shipments → Invoice | Create invoice → mark order invoiced → notification |
| **Record AR payment** | Invoices → Record payment | Increments `paidAmount`, updates invoice status |
| **Approve Leave** | Leave → Approve | Status patch on leave record |
| **Biometric Scan** | Attendance → Simulate | Creates live attendance row via API |
| **Fabric issue check** | Cutting → select job | Explodes style BOM vs inventory (shortfall flags) |
| **Global Search** | Header search | Multi-entity search with RBAC-aware navigation |
| **Role Simulation** | Header / Roles module | Filters sidebar + guards modules without re-login |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Presentation Layer                         │
│  Next.js 14 (App Router) · React 18 · TypeScript · Tailwind  │
│  TanStack Query · Axios · Recharts · Auth-gated SPA shell    │
│  shadcn/ui · RBAC-filtered nav · responsive Sheet drawer     │
└──────────────────────────────┬───────────────────────────────┘
                               │ REST + JWT Bearer
┌──────────────────────────────▼───────────────────────────────┐
│                    Application Layer                          │
│  NestJS Controllers · DTOs · ValidationPipe · Swagger         │
│  Guards (JWT / Roles / Permissions) · Helmet · Throttler      │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│                      Domain Layer                             │
│  Services · Workflow orchestrator · Dashboard / AI / Reports  │
│  Finance summary (cash, expenses, margins)                    │
└──────────────────────────────┬───────────────────────────────┘
                               │ IRepository<T>
┌──────────────────────────────▼───────────────────────────────┐
│                   Infrastructure Layer                        │
│  JsonRepository · JsonFileStore (atomic writes)               │
│  backend/src/data/*.json                                      │
│  Ready seam → PostgresRepository / Prisma / TypeORM           │
└──────────────────────────────────────────────────────────────┘
```

### Principles

1. **Clean Architecture** — Controllers never touch files; services never know JSON vs SQL  
2. **Repository Pattern** — `IRepository<T>` + `JsonRepository<T>` isolate persistence  
3. **Dependency Injection** — NestJS modules wire domain services  
4. **Workflow orchestration** — Purchase / Production / Invoice mutate related aggregates  
5. **Security by default** — Global JWT guard; `@Public()` only for login/health  
6. **Uniform API envelope** — `{ success, data, meta }` + global exception filter  
7. **Permission-aware UI** — `frontend/src/lib/rbac.ts` maps modules ↔ permission grants  

---

## Technology stack

### Frontend
| Layer | Choice |
|-------|--------|
| Framework | **Next.js 14** (App Router) |
| UI | **React 18** + **TypeScript** |
| Styling | **Tailwind CSS** + **shadcn/ui** (Radix, CVA, CSS variables — teal primary) |
| Server state | **TanStack Query** |
| HTTP | **Axios** + refresh-token interceptor |
| Charts | **Recharts** (shared `Charts.tsx` helpers) |
| Icons | **Lucide React** |

### Backend
| Layer | Choice |
|-------|--------|
| Framework | **NestJS 10** + TypeScript |
| Auth | **Passport JWT** + **bcryptjs** |
| Validation | **class-validator** / **class-transformer** |
| Docs | **Swagger** (`/docs`) |
| Hardening | **Helmet**, **CORS**, **Throttler** |
| Persistence | JSON file store with **atomic rename** writes |
| Tooling | Seed script + CRUD module generator |

---

## Engineering highlights

- **shadcn/ui design system** — Radix + CVA + CSS variables; shared DataTable / ChartCard / FilterRow  
- **30 API-backed screens** — no dead nav items; modules load live data  
- **27 domain collections** with list/search/sort/filter/pagination/CRUD/stats  
- **Workflow engine** for PO, production stages, and shipment invoicing  
- **Executive dashboard** aggregating KPIs + chart series across production, finance, HR, QC  
- **Live RBAC** — role switcher filters nav and blocks forbidden modules (`AccessDenied`)  
- **Global search** across entities with permission-aware deep links  
- **Reports** with auth-protected CSV export (Bearer token download)  
- **AI operations assistant** for factory Q&A intents  
- **Responsive shell** — mobile Sheet nav, compact KPIs, hide-on-mobile table columns  
- **Code generation** — `generate-modules.ts` scaffolds consistent Nest CRUD modules  
- **Realistic seed** — relational IDs across buyers ↔ orders ↔ production ↔ shipments ↔ invoices  

---

## Data model & seed volume

Run `npm run seed` in `backend/` to regenerate demo data under `backend/src/data/`.

| Entity | Approx. volume |
|--------|----------------|
| Employees | 520 |
| Attendance logs | 600 |
| Orders (with size breakdown) | 180 |
| Inventory SKUs | 220 |
| Machines | 140 |
| Purchase orders | 120 |
| Payroll rows | ~389 |
| QC inspections | 200 |
| Notifications | 100 |
| Audit events | 300 |
| Expenses | ~90 |
| Shipments / invoices | 60 |
| Branches, departments, buyers, suppliers, styles, warehouses, leads, quotations, roles, users… | Included |

Relationships are intentional (order → buyer/style/sizeBreakdown, production → order, shipment → order, invoice → shipment/buyer).

---

## Getting started (5 minutes)

### Prerequisites
- Node.js **18+** (20/24 recommended)  
- npm 9+

### 1) Backend

```bash
cd backend
npm install
npm run seed
npm run start:dev
```

- API: http://localhost:4000/api  
- Swagger: http://localhost:4000/docs  
- Health: http://localhost:4000/api/health  

### 2) Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
npm run dev
```

Open **http://localhost:3000** → login → explore every module from the sidebar.

---

## Demo accounts

| Persona | Email | Password |
|---------|-------|----------|
| Owner / MD | `owner@garmentserp.com` | `Password@123` |
| HR Manager | `hr@garmentserp.com` | `Password@123` |
| Factory Manager | `factory@garmentserp.com` | `Password@123` |
| Store Manager | `store@garmentserp.com` | `Password@123` |
| Accountant | `accounts@garmentserp.com` | `Password@123` |
| QC Inspector | `qc@garmentserp.com` | `Password@123` |
| Merchandiser | `merch@garmentserp.com` | `Password@123` |

Seeded roles also include **Operator**, **CEO**, **Admin**, and **Cutting Master** (selectable via the header role simulator).

Tip: after login, use **Simulate role** in the header — the sidebar and module access update immediately (no re-login required).

---

## API & security

### Auth model
- Passwords hashed with **bcrypt**  
- Access token (default **8h**) + refresh token (**7d**)  
- Global `JwtAuthGuard`; public routes marked `@Public()`  
- Optional `@Roles()` / `@Permissions()` metadata  
- Login writes an **audit** event  
- Frontend stores tokens and auto-refreshes on `401` (expired session clears to login)

### Standard list query
`page`, `limit`, `search`, `sortBy`, `sortDir` + field equality filters

### Response envelope

```json
{
  "success": true,
  "data": [],
  "meta": { "total": 520, "page": 1, "limit": 20, "totalPages": 26 }
}
```

### Signature endpoints

```http
POST /api/auth/login
GET  /api/dashboard/executive
GET  /api/finance/summary
GET  /api/invoices
GET  /api/expenses
GET  /api/audit
GET  /api/branches
GET  /api/departments
GET  /api/roles
POST /api/workflow/purchase-orders/:id/advance
POST /api/workflow/production/:id/advance
POST /api/workflow/shipments/:id/invoice
PATCH /api/invoices/:id
POST /api/ai/ask
GET  /api/search?q=zara
GET  /api/reports/production?timeline=Monthly
GET  /api/reports/production/export
```

Full catalog: [`docs/api.md`](docs/api.md).

> Production note: rotate `JWT_SECRET`, prefer httpOnly cookies or a BFF, terminate TLS at the reverse proxy.

---

## Repository structure

```
Garment ERP/
├── README.md                 ← You are here (product + architecture showcase)
├── .gitignore
├── docs/                     ← Deep-dive architecture & runbooks
│   ├── architecture.md
│   ├── api.md
│   ├── modules.md
│   ├── workflow.md
│   ├── deployment.md
│   ├── development-roadmap.md
│   └── checklist.md
├── frontend/                 ← Next.js ERP client
│   ├── src/app/              ← layout, page shell, globals
│   ├── src/components/
│   │   ├── auth/             ← LoginScreen, AccessDenied
│   │   ├── layout/           ← Sidebar, Header
│   │   ├── modules/          ← 30 domain workspaces
│   │   └── ui/               ← DataTable, Charts, shadcn primitives
│   └── src/lib/              ← api, auth, rbac, providers, utils
└── backend/                  ← NestJS ERP API
    ├── src/common/           ← filters, guards, repository, storage
    ├── src/data/             ← JSON collections (seeded)
    ├── src/modules/          ← auth, dashboard, workflow, CRUD domains…
    ├── src/scripts/          ← seed.ts, generate-modules.ts
    ├── src/app.module.ts
    └── src/main.ts
```

### Backend collections (CRUD + stats)

`employees`, `buyers`, `suppliers`, `styles`, `orders`, `inventory`, `purchase-orders`, `machines`, `production`, `attendance`, `leave`, `payroll`, `shipments`, `invoices`, `qc`, `expenses`, `notifications`, `audit`, `warehouses`, `stock-transfers`, `leads`, `quotations`, `companies`, `branches`, `departments`, `users`, `roles`

### Special services

| Service | Responsibility |
|---------|----------------|
| `auth` | Login, refresh, forgot-password, profile |
| `dashboard` | Executive KPIs, chart series, alerts |
| `workflow` | Cross-module PO / production / invoice transitions |
| `finance` | Cash summary, expense mix, profitability, margins |
| `reports` | Preview + authenticated CSV export |
| `ai` | Rule-based operations copilot |
| `search` | Global entity search |
| `settings` | Company configuration |
| `health` | Public liveness probe |

---

## PostgreSQL migration path

Designed so storage can harden without rewriting business logic:

1. Keep `IRepository<T>` unchanged  
2. Implement `PostgresRepository<T>` (Prisma / TypeORM / Knex)  
3. Rebind providers in Nest modules  
4. Migrate seed → SQL migrations / fixtures  
5. Controllers & services stay intact  

---

## Docs index

| Document | Purpose |
|----------|---------|
| [`docs/architecture.md`](docs/architecture.md) | System design summary |
| [`docs/api.md`](docs/api.md) | Endpoint catalog |
| [`docs/modules.md`](docs/modules.md) | Module map |
| [`docs/workflow.md`](docs/workflow.md) | Manufacturing workflow |
| [`docs/deployment.md`](docs/deployment.md) | Ops runbook |
| [`docs/development-roadmap.md`](docs/development-roadmap.md) | Next milestones |
| [`docs/checklist.md`](docs/checklist.md) | Delivery checklist |

---

## Roadmap

Tracked in [`docs/development-roadmap.md`](docs/development-roadmap.md):

- [x] shadcn/ui system migration  
- [x] Responsive ERP shell (mobile drawer, safe areas, adaptive tables)  
- [x] Operational ERP charts (dashboard, finance, AR, production, QC, …)  
- [x] Missing core screens: invoices/AR, expenses, audit, organization, cutting/fabric issue  
- [x] Live RBAC role simulation with sidebar filtering  
- [ ] PostgreSQL repository adapter + migrations  
- [ ] Deep-linkable App Router paths (`/sales`, `/inventory/:id`)  
- [ ] PDF generation (invoice, packing list, payslip)  
- [ ] Permission-gated UI from JWT claims (server-enforced module claims)  
- [ ] Playwright + Nest e2e for workflow paths  
- [ ] Buyer portal & biometric device webhooks  
- [ ] Sample development / tech-pack attachments  

---

## Skills demonstrated

| Area | Evidence in this repo |
|------|------------------------|
| **Full-stack TypeScript** | Shared language across Next.js + NestJS |
| **Frontend architecture** | Auth provider, Query client, **shadcn/ui** + Radix, modular ERP screens |
| **Backend architecture** | Clean layers, DI modules, repository abstraction |
| **API design** | REST, pagination, Swagger, consistent envelopes, error filter |
| **Security** | JWT, refresh flow, bcrypt, guards, RBAC metadata + UI gating |
| **Domain modeling** | Apparel manufacturing entities + linked seed graph |
| **Workflow / BPM thinking** | Multi-aggregate state transitions with audit + notifications |
| **Analytics UX** | Ops-first charts (AR aging, line OEE, fabric shortfall) |
| **Responsive enterprise UX** | Dense ERP nav that still works on phone |
| **DX & documentation** | Seed + codegen scripts, architecture docs, recruiter-ready README |
| **Product sense** | End-to-end factory story, not isolated widgets |

---

## Operations cheat sheet

| Task | Command |
|------|---------|
| API dev | `cd backend && npm run start:dev` |
| UI dev | `cd frontend && npm run dev` |
| API build | `cd backend && npm run build && npm run start:prod` |
| UI build | `cd frontend && npm run build && npm run start` |
| Reseed data | `cd backend && npm run seed` |
| Regenerate CRUD modules | `cd backend && npm run generate:modules` |

**`backend/.env`**
```env
PORT=4000
JWT_SECRET=change-me-in-production
JWT_EXPIRES=8h
CORS_ORIGIN=http://localhost:3000
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## License

Portfolio / demonstration software for **Softlligence**. Contact for commercial licensing.

---

### Bottom line

**Garments ERP** is a recruiter-ready, architecture-friendly full-stack ERP showcase: **30 live modules**, **workflow side effects**, **JWT + live RBAC**, **executive analytics**, **responsive shell**, and a **clean path to PostgreSQL** — built to look and behave like software a real garments factory could grow into.

**Open the app → login as Owner → walk the sidebar top to bottom** (Organization → Audit → Invoices → Cutting). That is the product.
