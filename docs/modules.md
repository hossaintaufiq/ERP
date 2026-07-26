# Modules Map

## Backend modules (`backend/src/modules`)

| Module | Persistence | Notes |
|--------|-------------|-------|
| auth | users, roles, audit | JWT login/refresh/me |
| dashboard | multi | Executive KPIs + charts |
| workflow | PO, production, shipments | Cross-module side effects |
| ai | multi | Mock NLP intents |
| reports | multi | Preview + CSV export |
| search | multi | Global search |
| settings | settings | Company config |
| finance | finance, invoices, expenses | Summary + profitability |
| employees…users | matching JSON | Generated CRUD (26 collections) |

## Frontend modules

Existing UI retained and extended:

- Dashboard (API + charts)
- Customers, Sales, Styles, BOM
- Inventory, Purchase, Suppliers
- Production Planning / Tracking
- Employees, Attendance, Payroll, QC, Machines, Shipment
- Finance (API), Reports (API), Roles, Notifications

**New pages**

- Leave Management
- Warehouses & Stock Transfers
- Leads & Quotations
- AI Assistant
- Settings
- Login gate

## Replacing JSON with PostgreSQL

1. Implement `PostgresRepository<T>` against `IRepository<T>`
2. Bind repositories in each module provider
3. Keep controllers/services unchanged
