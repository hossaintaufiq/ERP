'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Shirt,
  Calculator,
  Boxes,
  ShoppingCart,
  Building2,
  CalendarDays,
  LineChart as LineChartIcon,
  UserCheck,
  Fingerprint,
  Receipt,
  ShieldCheck,
  Cog,
  Truck,
  DollarSign,
  FileSpreadsheet,
  ShieldAlert,
  Bell,
  Factory
} from 'lucide-react';

export type ModuleId =
  | 'dashboard'
  | 'customers'
  | 'sales'
  | 'styles'
  | 'bom'
  | 'inventory'
  | 'purchase'
  | 'suppliers'
  | 'production_planning'
  | 'production_tracking'
  | 'employee'
  | 'attendance'
  | 'payroll'
  | 'qc'
  | 'machines'
  | 'shipment'
  | 'finance'
  | 'reports'
  | 'roles'
  | 'notifications';

interface SidebarProps {
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void;
  unreadNotificationsCount: number;
}

interface NavCategory {
  title: string;
  items: {
    id: ModuleId;
    label: string;
    icon: React.ElementType;
    badge?: string;
    number: number;
  }[];
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    title: 'Overview & Security',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, number: 1 },
      { id: 'roles', label: 'User Roles & Access', icon: ShieldAlert, badge: 'Role Matrix', number: 19 },
      { id: 'notifications', label: 'Notifications Hub', icon: Bell, badge: '5 Alerts', number: 20 },
    ],
  },
  {
    title: 'Commercial & Sales',
    items: [
      { id: 'customers', label: 'Customer Management', icon: Users, badge: 'Zara/H&M', number: 2 },
      { id: 'sales', label: 'Sales & Orders', icon: ShoppingBag, badge: 'Active SOs', number: 3 },
      { id: 'finance', label: 'Finance & Cash Flow', icon: DollarSign, number: 17 },
    ],
  },
  {
    title: 'Product Engineering',
    items: [
      { id: 'styles', label: 'Product & Styles', icon: Shirt, number: 4 },
      { id: 'bom', label: 'BOM Calculator', icon: Calculator, badge: 'Auto ERP', number: 5 },
    ],
  },
  {
    title: 'Supply Chain & Procurement',
    items: [
      { id: 'inventory', label: 'Inventory & Stock', icon: Boxes, badge: 'Warehouses', number: 6 },
      { id: 'purchase', label: 'Purchase Management', icon: ShoppingCart, number: 7 },
      { id: 'suppliers', label: 'Supplier Directory', icon: Building2, number: 8 },
    ],
  },
  {
    title: 'Shop Floor & Production',
    items: [
      { id: 'production_planning', label: 'Production Schedule', icon: CalendarDays, badge: '8 Stages', number: 9 },
      { id: 'production_tracking', label: 'Floor Tracking', icon: LineChartIcon, badge: 'Realtime', number: 10 },
      { id: 'qc', label: 'Quality Control (QC)', icon: ShieldCheck, number: 14 },
      { id: 'machines', label: 'Machine OEE', icon: Cog, number: 15 },
    ],
  },
  {
    title: 'Human Capital & Logistics',
    items: [
      { id: 'employee', label: 'Employee Management', icon: UserCheck, number: 11 },
      { id: 'attendance', label: 'Biometric Attendance', icon: Fingerprint, badge: 'RFID/Face', number: 12 },
      { id: 'payroll', label: 'Payroll & Payslips', icon: Receipt, number: 13 },
      { id: 'shipment', label: 'Shipment & Export', icon: Truck, number: 16 },
      { id: 'reports', label: 'Executive Reports', icon: FileSpreadsheet, number: 18 },
    ],
  },
];

export default function Sidebar({ activeModule, setActiveModule, unreadNotificationsCount }: SidebarProps) {
  return (
    <aside className="w-72 h-screen bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 flex flex-col flex-shrink-0 border-r border-stone-200 dark:border-stone-800 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-800 dark:bg-brand-700 flex items-center justify-center text-white shadow-sm ring-1 ring-stone-900/10">
          <Factory className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-stone-900 dark:text-stone-100 tracking-tight text-[15px]">GARMENTS ERP</h1>
          <p className="text-[11px] text-stone-500 dark:text-stone-500 font-medium tracking-wide">Enterprise Manufacturing</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 dark:text-stone-500">
              {cat.title}
            </div>
            <div className="space-y-0.5 mt-1.5">
              {cat.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                const isNotifications = item.id === 'notifications';

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive ? 'nav-active' : 'nav-inactive'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isNotifications && unreadNotificationsCount > 0 && (
                        <span className="bg-status-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadNotificationsCount}
                        </span>
                      )}
                      {!isNotifications && item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isActive
                              ? 'bg-brand-900/50 text-stone-200'
                              : 'bg-stone-100 text-stone-500 border border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[10px] opacity-35 font-mono">#{item.number}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
          <span className="font-mono text-[11px]">System Online · v4.2</span>
        </div>
        <span className="text-[10px] bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-400 font-mono">20 Modules</span>
      </div>
    </aside>
  );
}
