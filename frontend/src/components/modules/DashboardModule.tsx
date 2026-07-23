'use client';

import React from 'react';
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

interface DashboardModuleProps {
  setActiveModule: (id: ModuleId) => void;
}

export default function DashboardModule({ setActiveModule }: DashboardModuleProps) {
  const delayedOrders = MOCK_ORDERS.filter((o) => o.status === 'Delayed');
  const lowStockItems = MOCK_INVENTORY.filter((i) => i.status === 'Low Stock' || i.status === 'Critical');

  return (
    <div className="space-y-6 animate-fade-up duration-200">
      {/* Top Banner */}
      <div className="hero-banner">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300 mb-2">Operations Center</p>
            <h2 className="text-2xl font-bold tracking-tight text-white">Factory Executive Dashboard</h2>
            <p className="text-brand-100/70 text-sm mt-1.5 max-w-xl">
              Real-time telemetry across 8 production stages, 450 operators, and 4 major export buyers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveModule('bom')} className="btn-primary text-xs !bg-brand-500 hover:!bg-brand-400">
              <Calculator className="w-4 h-4" />
              BOM Calculator
            </button>
            <button onClick={() => setActiveModule('production_planning')} className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors">
              <CalendarDays className="w-4 h-4" />
              Line Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Executive KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-panel p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Today&apos;s Production</span>
            <span className="kpi-icon"><Activity className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">32,450 Pcs</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500">Target: 34,000 Pcs</span>
            <span className="text-status-success font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 95.4%
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '95.4%' }} />
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Active POs</span>
            <span className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-status-info"><Boxes className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">22 Orders</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500">30,000 total pieces</span>
            <button onClick={() => setActiveModule('sales')} className="text-accent font-semibold hover:underline">
              Sales desk →
            </button>
          </div>
          <div className="progress-track">
            <div className="h-full rounded-full bg-status-info" style={{ width: '75%' }} />
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3 ring-1 ring-rose-200/60 dark:ring-rose-900/40">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-status-danger uppercase tracking-wider">Delayed Orders</span>
            <span className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-status-danger"><AlertTriangle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-status-danger">{delayedOrders.length} Critical</div>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>SO-1025 (Primark Hoodie)</span>
            <span className="text-status-danger font-semibold">Needs rework</span>
          </div>
          <div className="progress-track">
            <div className="h-full rounded-full bg-status-danger" style={{ width: '82%' }} />
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Inventory Health</span>
            <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-status-warning"><Boxes className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">6 Material Bays</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-status-warning font-semibold">{lowStockItems.length} low stock</span>
            <button onClick={() => setActiveModule('inventory')} className="text-accent font-semibold hover:underline">
              Inventory →
            </button>
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Machine OEE</span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-status-success"><Activity className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-status-success">92.4%</div>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>132 machines running</span>
            <span>1 in maintenance</span>
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Shift Attendance</span>
            <span className="kpi-icon"><Users className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">436 / 450</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-status-success font-semibold">96.8% present</span>
            <span className="text-stone-500">14 absent</span>
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Monthly Revenue</span>
            <span className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">$584,200</div>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Expenses: $412,000</span>
            <span className="text-status-success font-semibold">+29.5% margin</span>
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Shipments</span>
            <span className="kpi-icon"><Truck className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">2 Containers</div>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Next: Zara (25 Aug)</span>
            <span className="text-accent font-semibold">Port BDCGP</span>
          </div>
        </div>

        <div className="glass-panel p-5 space-y-3 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/50 dark:to-stone-900 border-brand-200/60 dark:border-brand-900">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-400 uppercase tracking-wider">Net Profit</span>
            <span className="p-2 rounded-lg bg-brand-600 text-white shadow-glow">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-status-success">$172,200</div>
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>YTD: $1.42M</span>
            <span className="text-status-success">+14.2% vs last quarter</span>
          </div>
        </div>
      </div>

      {/* Floor Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-600" /> Sewing Line Output
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Target vs actual per shift</p>
            </div>
            <button
              onClick={() => setActiveModule('production_tracking')}
              className="text-xs text-accent font-semibold hover:underline"
            >
              Floor tracking →
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_LINE_TRACKING.map((line) => (
              <div key={line.lineId} className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-lg border border-stone-200/80 dark:border-stone-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{line.lineName}</span>
                    <span className="bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded text-[10px] font-medium">
                      {line.buyer} · {line.styleNumber}
                    </span>
                  </div>
                  <span className={`badge ${
                    line.status === 'Optimal' ? 'status-success' :
                    line.status === 'Behind Schedule' ? 'status-warning' :
                    'status-danger'
                  }`}>
                    {line.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>
                    <strong className="text-stone-800 dark:text-stone-200">{line.actualDaily}</strong> / {line.targetDaily} pcs
                  </span>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">{line.efficiency}% eff</span>
                </div>

                <div className="progress-track h-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      line.efficiency >= 90 ? 'bg-status-success' : line.efficiency >= 80 ? 'bg-status-warning' : 'bg-status-danger'
                    }`}
                    style={{ width: `${Math.min(line.efficiency, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-3">
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-status-warning" /> Action Required
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-lg space-y-1">
                <div className="font-semibold text-stone-800 dark:text-stone-200">Zara neck labels low</div>
                <div className="text-stone-500">3,200 pcs · safety min 10,000</div>
                <button onClick={() => setActiveModule('purchase')} className="mt-1 font-semibold text-accent hover:underline">
                  Create PR →
                </button>
              </div>

              <div className="p-3 bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-lg space-y-1">
                <div className="font-semibold text-stone-800 dark:text-stone-200">Order SO-1025 delayed</div>
                <div className="text-stone-500">Primark hoodie · Line 04 bottleneck</div>
                <button onClick={() => setActiveModule('production_planning')} className="mt-1 font-semibold text-accent hover:underline">
                  Re-assign line →
                </button>
              </div>
            </div>
          </div>

          <div className="hero-banner !p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300 mb-2">Platform</p>
            <h4 className="font-semibold text-base text-white">20-Module ERP Suite</h4>
            <p className="text-xs text-brand-100/70 leading-relaxed mt-2">
              Buyers, orders, BOM, shop floor, QC, payroll, export logistics, and executive reporting — unified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
