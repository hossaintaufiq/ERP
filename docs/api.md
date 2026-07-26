# API Reference

Base URL: `http://localhost:4000/api`

Swagger UI: `http://localhost:4000/docs`

## Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | Public | Login → JWT |
| POST | `/auth/refresh` | Public | Refresh tokens |
| POST | `/auth/forgot-password` | Public | Mock reset |
| POST | `/auth/logout` | JWT | Logout |
| GET | `/auth/me` | JWT | Profile |

**Demo login:** `owner@garmentserp.com` / `Password@123`

## Core resources (CRUD + stats)

Each resource supports: `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`, `GET /stats/summary`

Query params: `page`, `limit`, `search`, `sortBy`, `sortDir`, plus field filters.

Collections: `employees`, `buyers`, `suppliers`, `styles`, `orders`, `inventory`, `purchase-orders`, `machines`, `production`, `attendance`, `leave`, `payroll`, `shipments`, `invoices`, `qc`, `expenses`, `notifications`, `audit`, `warehouses`, `stock-transfers`, `leads`, `quotations`, `companies`, `branches`, `departments`, `users`

## Special endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard/executive` | KPI + charts + alerts |
| GET | `/finance/summary` | P&L style summary |
| GET | `/reports/:type` | Report preview |
| GET | `/reports/:type/export` | CSV export |
| POST | `/ai/ask` | Mock NLP assistant |
| GET | `/search?q=` | Global search |
| GET/PATCH | `/settings` | Company settings |
| POST | `/workflow/purchase-orders/:id/advance` | Advance PO + side effects |
| POST | `/workflow/production/:id/advance` | Advance production stage |
| POST | `/workflow/shipments/:id/invoice` | Auto-create invoice |

## Response shape

```json
{ "success": true, "data": {}, "meta": { "total": 0, "page": 1, "limit": 20, "totalPages": 1 } }
```
