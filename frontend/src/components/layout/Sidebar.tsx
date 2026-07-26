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
  Factory,
  Sparkles,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
  | 'notifications'
  | 'leave'
  | 'warehouse'
  | 'leads'
  | 'ai'
  | 'settings';

interface SidebarProps {
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void;
  unreadNotificationsCount: number;
  onNavigate?: () => void;
  className?: string;
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
      { id: 'roles', label: 'User Roles & Access', icon: ShieldAlert, badge: 'RBAC', number: 19 },
      { id: 'notifications', label: 'Notifications Hub', icon: Bell, number: 20 },
      { id: 'ai', label: 'AI Assistant', icon: Sparkles, badge: 'Copilot', number: 21 },
      { id: 'settings', label: 'Settings', icon: Cog, number: 22 },
    ],
  },
  {
    title: 'Commercial & Sales',
    items: [
      { id: 'leads', label: 'Leads & Quotations', icon: Building2, number: 23 },
      { id: 'customers', label: 'Customer Management', icon: Users, badge: 'Buyers', number: 2 },
      { id: 'sales', label: 'Sales & Orders', icon: ShoppingBag, badge: 'SOs', number: 3 },
      { id: 'finance', label: 'Finance & Cash Flow', icon: DollarSign, number: 17 },
    ],
  },
  {
    title: 'Product Engineering',
    items: [
      { id: 'styles', label: 'Product & Styles', icon: Shirt, number: 4 },
      { id: 'bom', label: 'BOM Calculator', icon: Calculator, badge: 'Auto', number: 5 },
    ],
  },
  {
    title: 'Supply Chain & Procurement',
    items: [
      { id: 'inventory', label: 'Inventory & Stock', icon: Boxes, number: 6 },
      { id: 'warehouse', label: 'Warehouses & Transfers', icon: Boxes, number: 24 },
      { id: 'purchase', label: 'Purchase Management', icon: ShoppingCart, number: 7 },
      { id: 'suppliers', label: 'Supplier Directory', icon: Building2, number: 8 },
    ],
  },
  {
    title: 'Shop Floor & Production',
    items: [
      { id: 'production_planning', label: 'Production Schedule', icon: CalendarDays, badge: '8 Stages', number: 9 },
      { id: 'production_tracking', label: 'Floor Tracking', icon: LineChartIcon, number: 10 },
      { id: 'qc', label: 'Quality Control (QC)', icon: ShieldCheck, number: 14 },
      { id: 'machines', label: 'Machine OEE', icon: Cog, number: 15 },
    ],
  },
  {
    title: 'Human Capital & Logistics',
    items: [
      { id: 'employee', label: 'Employee Management', icon: UserCheck, number: 11 },
      { id: 'attendance', label: 'Biometric Attendance', icon: Fingerprint, number: 12 },
      { id: 'leave', label: 'Leave Management', icon: CalendarDays, number: 25 },
      { id: 'payroll', label: 'Payroll & Payslips', icon: Receipt, number: 13 },
      { id: 'shipment', label: 'Shipment & Export', icon: Truck, number: 16 },
      { id: 'reports', label: 'Executive Reports', icon: FileSpreadsheet, number: 18 },
    ],
  },
];

export default function Sidebar({
  activeModule,
  setActiveModule,
  unreadNotificationsCount,
  onNavigate,
  className,
}: SidebarProps) {
  const select = (id: ModuleId) => {
    setActiveModule(id);
    onNavigate?.();
  };

  return (
    <aside
      className={cn(
        'h-full bg-card text-card-foreground flex flex-col flex-shrink-0 border-r border-border select-none',
        className,
      )}
    >
      <div className="p-4 sm:p-5 flex items-center gap-3 min-h-[4rem]">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-glow ring-1 ring-primary/30 shrink-0">
          <Factory className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold tracking-tight text-[15px] truncate">GARMENTS ERP</h1>
          <p className="text-[11px] text-primary font-medium tracking-wide truncate">Enterprise Manufacturing</p>
        </div>
      </div>
      <Separator />

      <ScrollArea className="flex-1 px-2 sm:px-3 py-3 sm:py-4">
        <nav className="space-y-5 sm:space-y-6 pr-2 pb-4" aria-label="Main">
          {NAV_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {cat.title}
              </div>
              <div className="space-y-0.5 mt-1.5">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  const isNotifications = item.id === 'notifications';

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => select(item.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-lg text-xs font-medium transition-all group relative z-10 cursor-pointer touch-manipulation',
                        isActive ? 'nav-active' : 'nav-inactive',
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={cn(
                            'w-4 h-4 flex-shrink-0',
                            isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary',
                          )}
                        />
                        <span className="truncate text-left">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isNotifications && unreadNotificationsCount > 0 && (
                          <Badge variant="destructive" className="h-5 min-w-5 justify-center px-1.5">
                            {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                          </Badge>
                        )}
                        {item.badge && !isNotifications && (
                          <Badge
                            variant={isActive ? 'secondary' : 'outline'}
                            className="text-[9px] px-1.5 py-0 hidden sm:inline-flex"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <Separator />
      <div className="p-3 sm:p-4 text-[10px] text-muted-foreground">Softlligence · Garments ERP v1.0</div>
    </aside>
  );
}
