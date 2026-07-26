'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Boxes,
  AlertTriangle,
  Users,
  DollarSign,
  Truck,
  Calculator,
  CalendarDays,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_INVENTORY, MOCK_LINE_TRACKING } from '@/data/mockData';
import { ModuleId } from '../layout/Sidebar';
import { erpApi } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DashboardModuleProps {
  setActiveModule: (id: ModuleId) => void;
}

export default function DashboardModule({ setActiveModule }: DashboardModuleProps) {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => erpApi.dashboard(),
    retry: 1,
  });

  const kpis = (data as any)?.kpis;
  const charts = (data as any)?.charts;
  const alerts = (data as any)?.alerts;

  const delayedOrders = MOCK_ORDERS.filter((o) => o.status === 'Delayed');
  const lowStockItems = MOCK_INVENTORY.filter((i) => i.status === 'Low Stock' || i.status === 'Critical');

  const revenueTrend = charts?.revenueTrend || [];
  const stageData = charts?.productionByStage
    ? Object.entries(charts.productionByStage).map(([stage, count]) => ({ stage, count }))
    : [];

  return (
    <div className="space-y-6 animate-fade-up duration-200">
      <div className="hero-banner">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300 mb-2">
              Operations Center {kpis ? '· Live API' : '· Offline mock'}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">Factory Executive Dashboard</h2>
            <p className="text-brand-100/70 text-sm mt-1.5 max-w-xl">
              Real-time KPIs across production, inventory, finance, attendance, and shipments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveModule('bom')} className="btn-primary text-xs !bg-brand-500 hover:!bg-brand-400">
              <Calculator className="w-4 h-4" />
              BOM Calculator
            </button>
            <button
              onClick={() => setActiveModule('production_planning')}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors"
            >
              <CalendarDays className="w-4 h-4" />
              Line Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Kpi label="Today's Production" value={`${(kpis?.todaysProduction ?? 32450).toLocaleString()} Pcs`} hint="Across active jobs" icon={<Activity className="w-4 h-4" />} />
        <Kpi label="Active Orders" value={kpis?.activeOrders ?? 22} hint="Confirmed / in production" icon={<Boxes className="w-4 h-4" />} onClick={() => setActiveModule('sales')} />
        <Kpi label="Delayed Orders" value={kpis?.delayedOrders ?? delayedOrders.length} hint="Needs attention" tone="danger" icon={<AlertTriangle className="w-4 h-4" />} />
        <Kpi label="Low Stock SKUs" value={kpis?.lowStockItems ?? lowStockItems.length} hint="Below safety stock" tone="warning" icon={<Boxes className="w-4 h-4" />} onClick={() => setActiveModule('inventory')} />
        <Kpi label="Machine OEE" value={`${kpis?.machineUtilization ?? 92.4}%`} hint={`${kpis?.runningMachines ?? 132} running`} tone="success" icon={<Activity className="w-4 h-4" />} />
        <Kpi label="Workforce" value={`${kpis?.employees ?? 450}`} hint="Active employees" icon={<Users className="w-4 h-4" />} />
        <Kpi label="Revenue (collected)" value={`$${(kpis?.revenue ?? 584200).toLocaleString()}`} hint={`AR $${(kpis?.receivables ?? 145000).toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} />
        <Kpi label="Shipments in transit" value={kpis?.shipmentsInTransit ?? 2} hint="Export containers" icon={<Truck className="w-4 h-4" />} />
        <Kpi label="QC Pass Rate" value={`${kpis?.qcPassRate ?? 94}%`} tone="success" icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 space-y-4">
          <h3 className="font-semibold text-sm">Revenue trend</h3>
          <div className="h-56">
            {revenueTrend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#268f99" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-stone-500">Connect API for live charts</div>
            )}
          </div>
          {!!stageData.length && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wider">Jobs by stage</h4>
              <div className="flex flex-wrap gap-2">
                {stageData.map((s: any) => (
                  <span key={s.stage} className="badge bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                    {s.stage}: {s.count as number}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-status-warning" /> Action required
            </h3>
            <div className="space-y-2 text-xs">
              {(alerts || []).slice(0, 5).map((a: any, i: number) => (
                <div key={i} className="p-3 bg-stone-100 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700">
                  <div className="font-semibold text-stone-800 dark:text-stone-200">{a.message}</div>
                  <div className="text-stone-500 mt-0.5 capitalize">{a.type} · {a.severity}</div>
                </div>
              ))}
              {!alerts?.length &&
                MOCK_LINE_TRACKING.slice(0, 2).map((line) => (
                  <div key={line.lineId} className="p-3 bg-stone-100 dark:bg-stone-800/60 rounded-lg">
                    <div className="font-semibold">{line.lineName}</div>
                    <div className="text-stone-500 flex items-center gap-1">
                      {line.efficiency}% eff <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  icon,
  tone = 'default',
  onClick,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}) {
  const color =
    tone === 'success'
      ? 'text-status-success'
      : tone === 'warning'
        ? 'text-status-warning'
        : tone === 'danger'
          ? 'text-status-danger'
          : 'text-stone-900 dark:text-stone-100';
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-panel p-5 space-y-3 text-left w-full hover:border-brand-400/40 transition-colors"
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">{label}</span>
        <span className="kpi-icon">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {hint && <div className="text-xs text-stone-500">{hint}</div>}
    </button>
  );
}
