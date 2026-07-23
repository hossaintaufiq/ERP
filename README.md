# Garments ERP

**Enterprise-grade garment manufacturing ERP — a full-stack frontend showcase for apparel production, supply chain, and factory operations.**

Built as a modern single-page application with **20 integrated business modules**, realistic mock data, and a premium UI designed for factory owners, production managers, and export operations teams.

---

## Why this project matters

Garment factories run on tight deadlines, multi-buyer compliance, and complex shop-floor workflows. Most small and mid-size manufacturers still rely on spreadsheets and disconnected tools.

**Garments ERP** demonstrates how a unified digital platform can connect:

- Buyer & sales order management  
- Style tech packs and BOM (Bill of Materials) calculation  
- Inventory, procurement, and supplier workflows  
- Production planning across 8 factory stages  
- QC gates, machine OEE, and line telemetry  
- HR, biometric attendance, payroll, and export logistics  
- Role-based access control and executive reporting  

This project is ideal for recruiters and hiring managers evaluating **React/Next.js**, **TypeScript**, **enterprise UI/UX**, and **domain-driven frontend architecture**.

---

## Highlights for recruiters

| Area | What was built |
|------|----------------|
| **Scale** | 20 functional modules in one cohesive SPA |
| **Stack** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Architecture** | Modular component structure, typed navigation, centralized mock data layer |
| **UX** | Dark/light theme, responsive layout, role simulation, executive dashboard KPIs |
| **Domain knowledge** | Real garment ERP concepts: BOM, AQL QC, OEE, export shipment, buyer compliance |
| **Code quality** | Strict TypeScript, production build verified, `.gitignore` configured for GitHub |

---

## Tech stack

**Frontend**
- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 3](https://tailwindcss.com/) + custom design tokens
- [Lucide React](https://lucide.dev/) — icon system
- [Recharts](https://recharts.org/) — charting (Reports module)
- [Framer Motion](https://www.framer.com/motion/) — animations

**Tooling**
- ESLint-ready Next.js setup
- PostCSS + Autoprefixer
- `clsx` + `tailwind-merge` for class composition

---

## Modules (20)

| # | Module | Purpose |
|---|--------|---------|
| 1 | **Dashboard** | Executive KPIs, line telemetry, critical alerts |
| 2 | **Customer Management** | Global buyer directory (Zara, H&M, Primark, Walmart) |
| 3 | **Sales & Orders** | Purchase orders, size matrices, order status |
| 4 | **Product & Styles** | Style catalog and tech pack repository |
| 5 | **BOM Calculator** | Automated material requirement scaling |
| 6 | **Inventory** | Raw materials, finished goods, stock alerts |
| 7 | **Purchase Management** | PR → PO → receive → stock workflow |
| 8 | **Supplier Directory** | Vendor ratings, materials, AP balances |
| 9 | **Production Schedule** | 8-stage Kanban pipeline |
| 10 | **Floor Tracking** | Sewing line output, efficiency, reject/rework |
| 11 | **Employee Management** | Staff directory and performance |
| 12 | **Biometric Attendance** | RFID / fingerprint / face recognition logs |
| 13 | **Payroll & Payslips** | Salary register and payslip generation |
| 14 | **Quality Control** | 4-stage QC gates + defect logging |
| 15 | **Machine OEE** | Equipment status and utilization |
| 16 | **Shipment & Export** | Container tracking and export docs |
| 17 | **Finance** | Revenue, expenses, order profitability |
| 18 | **Executive Reports** | Production, inventory, P&L, QC reports |
| 19 | **Roles & Access** | RBAC permission matrix |
| 20 | **Notifications** | Factory alerts (stock, production, payroll) |

---

## Project structure

```
Garment ERP/
├── README.md
├── .gitignore
└── frontend/
    ├── src/
    │   ├── app/                 # Next.js App Router (layout, page, globals)
    │   ├── components/
    │   │   ├── layout/          # Sidebar, Header (app shell)
    │   │   └── modules/         # 20 feature modules
    │   ├── data/
    │   │   └── mockData.ts      # Typed mock datasets
    │   └── lib/
    │       └── cn.ts            # Tailwind class merge utility
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Getting started

### Prerequisites

- **Node.js** 18+  
- **npm** (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd "Garment ERP/frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Lint (Next.js ESLint)
```

---

## Skills demonstrated

- **React & Next.js** — Client-side SPA with App Router, metadata, and optimized builds  
- **TypeScript** — Typed module IDs, interfaces, and mock data models  
- **Component architecture** — Separation of layout shell vs. feature modules  
- **State management** — Module routing, role simulation, theme toggle via React state  
- **UI/UX design** — Enterprise dashboard patterns, data tables, modals, KPI cards  
- **Tailwind CSS** — Utility-first styling, dark mode, responsive grids  
- **Domain modeling** — Garment industry entities (buyers, styles, BOM, lines, QC)  

---

## Screenshots

> _Add 2–3 screenshots here before sharing with recruiters: Dashboard, Production Schedule, and BOM Calculator work well._

---

## Roadmap (planned enhancements)

- [ ] Backend API (Node.js / PostgreSQL)  
- [ ] Authentication & real RBAC enforcement  
- [ ] Shared UI component library (Button, Table, Modal)  
- [ ] Live charts on Dashboard and Reports  
- [ ] Mobile-responsive sidebar  
- [ ] Unit and E2E tests  

---

## Author

**Softlligence** — Garment ERP project  
Built to showcase full-stack readiness and enterprise software design for the apparel manufacturing industry.

---

## License

This project is for portfolio and demonstration purposes.  
Contact the author for licensing or collaboration inquiries.
