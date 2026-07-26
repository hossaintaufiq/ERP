'use client';

import React, { useMemo } from 'react';
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
  ChartCard,
  TrendAreaChart,
  CategoryBarChart,
  SharePieChart,
  CHART_COLORS,
} from '@/components/ui/Charts';

interface DashboardModuleProps {
  setActiveModule: (id: ModuleId) => void;
  allowedModules?: ModuleId[];
}

export default function DashboardModule({ setActiveModule, allowedModules }: DashboardModuleProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => erpApi.dashboard(),
    retry: 1,
  });

  const can = (id: ModuleId) => Array.isArray(allowedModules) && allowedModules.includes(id);

  const kpis = (data as any)?.kpis;
  const charts = (data as any)?.charts;
  const alerts = (data as any)?.alerts;

  const revenueTrend = charts?.revenueTrend || [];

  const stageData = useMemo(
    () =>
      charts?.productionByStage
        ? Object.entries(charts.productionByStage).map(([stage, count]) => ({
            stage,
            count: count as number,
          }))
        : [],
    [charts?.productionByStage],
  );

  const orderStatus = useMemo(
    () =>
      charts?.orderStatus
        ? Object.entries(charts.orderStatus).map(([name, value]) => ({
            name,
            value: value as number,
          }))
        : [],
    [charts?.orderStatus],
  );

  const stockStatus = useMemo(
    () =>
      charts?.stockStatus
        ? Object.entries(charts.stockStatus).map(([name, value]) => ({
            name,
            value: value as number,
          }))
        : [],
    [charts?.stockStatus],
  );

  const lineEfficiency = charts?.lineEfficiency || [];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up duration-200">
      <div className="hero-banner p-4 sm:p-6">
        <div className="flex flex-col gap-4 relative z-10">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200/90 mb-2">
              Operations Center {isLoading ? '· Loading' : isError ? '· API unavailable' : '· Live API'}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Factory Executive Dashboard</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl">
              Live KPIs and the charts ops managers use daily — cash, orders, lines, and stock risk.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
            {can('bom') && (
              <button
                onClick={() => setActiveModule('bom')}
                className="btn-primary text-xs !bg-sky-500 hover:!bg-sky-400 w-full sm:w-auto justify-center"
              >
                <Calculator className="w-4 h-4" />
                BOM Calculator
              </button>
            )}
            {can('production_planning') && (
              <button
                onClick={() => setActiveModule('production_planning')}
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors w-full sm:w-auto"
              >
                <CalendarDays className="w-4 h-4" />
                Line Schedule
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        <Kpi label="Today's Production" value={`${Number(kpis?.todaysProduction || 0).toLocaleString()} Pcs`} hint="Across active jobs" icon={<Activity className="w-4 h-4" />} />
        <Kpi label="Active Orders" value={kpis?.activeOrders ?? '—'} hint="Confirmed / in production" icon={<Boxes className="w-4 h-4" />} onClick={can('sales') ? () => setActiveModule('sales') : undefined} />
        <Kpi label="Delayed Orders" value={kpis?.delayedOrders ?? '—'} hint="Needs attention" tone="danger" icon={<AlertTriangle className="w-4 h-4" />} />
        <Kpi label="Low Stock SKUs" value={kpis?.lowStockItems ?? '—'} hint="Below safety stock" tone="warning" icon={<Boxes className="w-4 h-4" />} onClick={can('inventory') ? () => setActiveModule('inventory') : undefined} />
        <Kpi label="Machine OEE" value={`${kpis?.machineUtilization ?? '—'}%`} hint={`${kpis?.runningMachines ?? 0} running`} tone="success" icon={<Activity className="w-4 h-4" />} />
        <Kpi label="Workforce" value={`${kpis?.employees ?? '—'}`} hint="Active employees" icon={<Users className="w-4 h-4" />} />
        <Kpi label="Revenue (collected)" value={`$${Number(kpis?.revenue || 0).toLocaleString()}`} hint={`AR $${Number(kpis?.receivables || 0).toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} onClick={can('invoices') ? () => setActiveModule('invoices') : can('finance') ? () => setActiveModule('finance') : undefined} />
        <Kpi label="Shipments in transit" value={kpis?.shipmentsInTransit ?? '—'} hint="Export containers" icon={<Truck className="w-4 h-4" />} onClick={can('shipment') ? () => setActiveModule('shipment') : undefined} />
        <Kpi label="QC Pass Rate" value={`${kpis?.qcPassRate ?? '—'}%`} tone="success" icon={<TrendingUp className="w-4 h-4" />} className="col-span-2 lg:col-span-1" onClick={can('qc') ? () => setActiveModule('qc') : undefined} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard
          className="lg:col-span-2"
          title="Revenue trend"
          description="Collected revenue by month — cash planning"
        >
          <TrendAreaChart data={revenueTrend} xKey="month" yKey="revenue" height={220} />
        </ChartCard>

        <ChartCard title="Order status" description="Pipeline mix">
          <SharePieChart data={orderStatus} height={220} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard title="Jobs by stage" description="WIP across cutting → packing">
          <CategoryBarChart data={stageData} xKey="stage" yKey="count" height={200} />
        </ChartCard>

        <ChartCard title="Line efficiency" description="Avg % by sewing line">
          <CategoryBarChart
            data={lineEfficiency}
            xKey="line"
            yKey="efficiency"
            height={200}
            valueSuffix="%"
            color={CHART_COLORS.success}
          />
        </ChartCard>

        <ChartCard title="Stock health" description="SKU risk mix" className="md:col-span-2 xl:col-span-1">
          <SharePieChart data={stockStatus} height={200} />
        </ChartCard>
      </div>

      <div className="glass-panel p-4 sm:p-5 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning" /> Action required
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {(alerts || []).slice(0, 6).map((a: any, i: number) => (
            <div
              key={i}
              className="p-3 bg-stone-100 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700"
            >
              <div className="font-semibold text-stone-800 dark:text-stone-200">{a.message}</div>
              <div className="text-stone-500 mt-0.5 capitalize">
                {a.type} · {a.severity}
              </div>
            </div>
          ))}
          {!alerts?.length && (
            <div className="p-3 text-stone-500 sm:col-span-2 lg:col-span-3">
              {isLoading ? 'Loading alerts…' : 'No open alerts.'}
            </div>
          )}
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
  className = '',
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
  className?: string;
}) {
  const color =
    tone === 'success'
      ? 'text-status-success'
      : tone === 'warning'
        ? 'text-status-warning'
        : tone === 'danger'
          ? 'text-status-danger'
          : 'text-stone-900 dark:text-stone-100';

  const body = (
    <>
      <div className="flex justify-between items-start gap-2">
        <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
          {label}
        </span>
        <span className="kpi-icon shrink-0">{icon}</span>
      </div>
      <div className={`text-lg sm:text-2xl font-bold tabular-nums break-words ${color}`}>{value}</div>
      {hint && <div className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">{hint}</div>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`glass-panel p-3 sm:p-5 space-y-1.5 sm:space-y-3 text-left w-full min-w-0 hover:border-brand-400/40 transition-colors touch-manipulation cursor-pointer ${className}`}
      >
        {body}
      </button>
    );
  }

  return (
    <div className={`glass-panel p-3 sm:p-5 space-y-1.5 sm:space-y-3 text-left w-full min-w-0 ${className}`}>
      {body}
    </div>
  );
}
