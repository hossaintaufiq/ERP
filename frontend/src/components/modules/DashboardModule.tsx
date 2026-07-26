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
  Activity,
} from 'lucide-react';
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => erpApi.dashboard(),
    retry: 1,
  });

  const kpis = (data as any)?.kpis;
  const charts = (data as any)?.charts;
  const alerts = (data as any)?.alerts;

  const revenueTrend = charts?.revenueTrend || [];
  const stageData = charts?.productionByStage
    ? Object.entries(charts.productionByStage).map(([stage, count]) => ({ stage, count }))
    : [];

  return (
    <div className="space-y-6 animate-fade-up duration-200">
      <div className="hero-banner p-4 sm:p-6">
        <div className="flex flex-col gap-4 relative z-10">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300 mb-2">
              Operations Center {isLoading ? '· Loading' : isError ? '· API unavailable' : '· Live API'}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Factory Executive Dashboard</h2>
            <p className="text-brand-100/70 text-xs sm:text-sm mt-1.5 max-w-xl">
              Real-time KPIs across production, inventory, finance, attendance, and shipments.
            </p>
          </div>
          <div className="flex flex-col xs:flex-row sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
            <button
              onClick={() => setActiveModule('bom')}
              className="btn-primary text-xs !bg-brand-500 hover:!bg-brand-400 w-full sm:w-auto justify-center"
            >
              <Calculator className="w-4 h-4" />
              BOM Calculator
            </button>
            <button
              onClick={() => setActiveModule('production_planning')}
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors w-full sm:w-auto"
            >
              <CalendarDays className="w-4 h-4" />
              Line Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Kpi label="Today's Production" value={`${Number(kpis?.todaysProduction || 0).toLocaleString()} Pcs`} hint="Across active jobs" icon={<Activity className="w-4 h-4" />} />
        <Kpi label="Active Orders" value={kpis?.activeOrders ?? '—'} hint="Confirmed / in production" icon={<Boxes className="w-4 h-4" />} onClick={() => setActiveModule('sales')} />
        <Kpi label="Delayed Orders" value={kpis?.delayedOrders ?? '—'} hint="Needs attention" tone="danger" icon={<AlertTriangle className="w-4 h-4" />} />
        <Kpi label="Low Stock SKUs" value={kpis?.lowStockItems ?? '—'} hint="Below safety stock" tone="warning" icon={<Boxes className="w-4 h-4" />} onClick={() => setActiveModule('inventory')} />
        <Kpi label="Machine OEE" value={`${kpis?.machineUtilization ?? '—'}%`} hint={`${kpis?.runningMachines ?? 0} running`} tone="success" icon={<Activity className="w-4 h-4" />} />
        <Kpi label="Workforce" value={`${kpis?.employees ?? '—'}`} hint="Active employees" icon={<Users className="w-4 h-4" />} />
        <Kpi label="Revenue (collected)" value={`$${Number(kpis?.revenue || 0).toLocaleString()}`} hint={`AR $${Number(kpis?.receivables || 0).toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} />
        <Kpi label="Shipments in transit" value={kpis?.shipmentsInTransit ?? '—'} hint="Export containers" icon={<Truck className="w-4 h-4" />} />
        <Kpi label="QC Pass Rate" value={`${kpis?.qcPassRate ?? '—'}%`} tone="success" icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="sm:col-span-2 lg:col-span-2 glass-panel p-4 sm:p-5 space-y-4 min-w-0">
          <h3 className="font-semibold text-sm">Revenue trend</h3>
          <div className="h-48 sm:h-56 w-full min-w-0">
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
              {!alerts?.length && (
                <div className="p-3 text-stone-500">
                  {isLoading ? 'Loading alerts…' : 'No open alerts.'}
                </div>
              )}
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
      className="glass-panel p-4 sm:p-5 space-y-2 sm:space-y-3 text-left w-full hover:border-brand-400/40 transition-colors touch-manipulation min-w-0"
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">{label}</span>
        <span className="kpi-icon">{icon}</span>
      </div>
      <div className={`text-xl sm:text-2xl font-bold tabular-nums break-all ${color}`}>{value}</div>
      {hint && <div className="text-xs text-stone-500">{hint}</div>}
    </button>
  );
}
