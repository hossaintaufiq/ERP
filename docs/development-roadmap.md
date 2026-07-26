# Development Roadmap

## Completed in this phase

- [x] NestJS API with JWT, Swagger, Helmet, throttling  
- [x] JSON repository layer (Postgres-ready interface)  
- [x] Seeded enterprise datasets (500+ employees, 180 orders, etc.)  
- [x] 26+ CRUD domain modules  
- [x] Workflow orchestrator (PO / production / invoice)  
- [x] Dashboard, finance, reports, search, AI, settings APIs  
- [x] Frontend login + TanStack Query + Axios layer  
- [x] New UI: Leave, Warehouse, Leads, AI, Settings  
- [x] Live dashboard charts + finance/reports wired to API  
- [x] Documentation set  

## Next milestones

1. **Postgres adapter** — TypeORM/Prisma implementing `IRepository`  
2. **App Router deep links** — `/sales`, `/inventory/:id`  
3. **shadcn/ui adoption** — migrate DataTable/Dialogs to Radix primitives  
4. **Real PDF generation** — invoices, packing lists, payslips  
5. **Device integrations** — biometric attendance webhooks  
6. **Buyer portal** — external read-only order/shipment status  
7. **E2E tests** — Playwright + Nest e2e for workflow paths  
8. **Permission-enforced UI** — hide modules by JWT permissions  

## Definition of done (production)

- Auth + RBAC enforced end-to-end  
- All workflow transitions transactional  
- Backups for persistence layer  
- Observability (structured logs, metrics)  
- CI/CD with lint, test, migrate, deploy  
