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
  ChevronRight,
  Sparkles,
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
    <aside className="w-72 h-screen bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
          <Factory className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-white tracking-tight text-base">GARMENTS ERP</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">Garment & Apparel Manufacturing</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isNotifications && unreadNotificationsCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                          {unreadNotificationsCount}
                        </span>
                      )}
                      {!isNotifications && item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isActive
                              ? 'bg-blue-700 text-blue-100'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[10px] opacity-40 font-mono">#{item.number}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-[11px]">System Online (v4.2)</span>
        </div>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">20 Modules</span>
      </div>
    </aside>
  );
}
