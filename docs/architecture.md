# Garments ERP — Architecture

## Overview

Production-oriented Garments Manufacturing ERP with a **Next.js frontend** and **NestJS backend**. Persistence uses **JSON files** behind a **Repository pattern** so PostgreSQL can replace storage later without changing services or controllers.

```
┌─────────────────┐     REST/JWT      ┌─────────────────┐
│  Next.js SPA    │ ◄───────────────► │  NestJS API     │
│  TanStack Query │                   │  Modules + RBAC │
└─────────────────┘                   └────────┬────────┘
                                               │
                                      ┌────────▼────────┐
                                      │  Repository     │
                                      │  Interface      │
                                      └────────┬────────┘
                                               │
                                      ┌────────▼────────┐
                                      │  JsonRepository │
                                      │  /src/data/*.json│
                                      └─────────────────┘
                         (swap → PostgresRepository later)
```

## Principles

1. **Clean Architecture** — Controllers → Services → Repositories → Storage
2. **SOLID** — Dependency injection; one module per domain
3. **Workflow-driven** — Cross-module side effects (PO → inventory → finance → audit → notifications)
4. **RBAC** — JWT + guards + permission decorators
5. **No toy demos** — Full CRUD, search, filter, pagination, stats on every domain

## Layers

| Layer | Responsibility |
|-------|----------------|
| Controller | HTTP, DTOs, Swagger |
| Service | Business rules, workflows |
| Repository | Persistence abstraction |
| JsonFileStore | Atomic read/write JSON |
| Guards/Filters | Auth, errors, logging |

## Domain Modules

Auth, Users, Roles, Companies, Branches, Departments, Employees, Attendance, Leave, Payroll, Buyers, Suppliers, Products/Styles, BOM, Procurement, Inventory, Warehouse, Sales/Orders, Production (Cutting→Packing), QC, Shipment, Finance, Reports, Dashboard, Notifications, Audit, Documents, Machines, Analytics, AI, Search, Settings.

## Garments Workflow

Lead → Buyer → Quotation → SO → BOM → Material PO → Warehouse → Planning → Cutting → Sewing → Print/Wash → Finish → QC → Pack → Ship → Invoice → Payment

Each step mutates related aggregates and writes audit + notification events.
