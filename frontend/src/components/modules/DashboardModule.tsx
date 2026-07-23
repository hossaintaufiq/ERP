'use client';

import React from 'react';
import {
  TrendingUp,
  Boxes,
  Clock,
  AlertTriangle,
  Users,
  DollarSign,
  Truck,
  Sparkles,
  Calculator,
  CalendarDays,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_INVENTORY, MOCK_LINE_TRACKING, MOCK_SHIPMENTS } from '@/data/mockData';
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Garments ERP Operations Center
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Factory Executive Dashboard</h2>
            <p className="text-slate-400 text-xs mt-1">Real-time telemetry across 8 production stages, 450 operators, and 4 major export buyers.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModule('bom')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Launch BOM Calculator
            </button>
            <button
              onClick={() => setActiveModule('production_planning')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              View Line Schedule
            </button>
          </div>
        </div>
      </div>

      {/* 9 Core Executive KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* 1. Today's Production */}
        <div className="glass-panel p-4 rounded-xl space-y-2 hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Today's Production</span>
            <span className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">32,450 Pcs</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Target: 34,000 Pcs</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 95.4% Efficiency
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '95.4%' }} />
          </div>
        </div>

        {/* 2. Orders in Progress */}
        <div className="glass-panel p-4 rounded-xl space-y-2 hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Active POs in Progress</span>
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">22 Purchase Orders</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">30,000 Total Pieces</span>
            <button onClick={() => setActiveModule('sales')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              View Sales Desk →
            </button>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '75%' }} />
          </div>
        </div>

        {/* 3. Delayed Orders */}
        <div className="glass-panel p-4 rounded-xl space-y-2 hover:border-rose-500/40 transition-all border-rose-200/40">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">3. Delayed Orders</span>
            <span className="p-2 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{delayedOrders.length} Order Critical</div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>SO-1025 (Primark Hoodie)</span>
            <span className="text-rose-500 font-bold">Needs Rework</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '82%' }} />
          </div>
        </div>

        {/* 4. Inventory Status */}
        <div className="glass-panel p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Inventory Health</span>
            <span className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg">
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">6 Raw Material Bays</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-bold">{lowStockItems.length} Low Stock Items</span>
            <button onClick={() => setActiveModule('inventory')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Inventory →
            </button>
          </div>
        </div>

        {/* 5. Machine Utilization */}
        <div className="glass-panel p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">5. Machine OEE Utilization</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">92.4% OEE</div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>132 Machines Running</span>
            <span>1 Maintenance</span>
          </div>
        </div>

        {/* 6. Employee Attendance */}
        <div className="glass-panel p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">6. Shift Attendance</span>
            <span className="p-2 bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">436 / 450 Present</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-bold">96.8% Present Rate</span>
            <span>14 Absent</span>
          </div>
        </div>

        {/* 7. Revenue & Expenses */}
        <div className="glass-panel p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">7. Monthly Financials</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">$584,200 Revenue</div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Expenses: $412,000</span>
            <span className="text-emerald-600 font-bold">Margin +29.5%</span>
          </div>
        </div>

        {/* 8. Shipment Schedule */}
        <div className="glass-panel p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">8. Shipment Schedule</span>
            <span className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">2 Export Containers</div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Next: Zara (25 August)</span>
            <span className="text-blue-600 font-bold">Port BDCGP</span>
          </div>
        </div>

        {/* 9. Profit Overview */}
        <div className="glass-panel p-4 rounded-xl space-y-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">9. Net Profit Overview</span>
            <span className="p-2 bg-emerald-500 text-white rounded-lg shadow">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">$172,200 Net</div>
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            <span>YTD Profit: $1.42M</span>
            <span>+14.2% vs Last Quarter</span>
          </div>
        </div>
      </div>

      {/* Main Floor Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Production Lines Tracker */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Active Sewing Line Output (Target vs Actual)
              </h3>
              <p className="text-xs text-slate-400">Live piece count per line shift</p>
            </div>
            <button
              onClick={() => setActiveModule('production_tracking')}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              Floor Tracking →
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_LINE_TRACKING.map((line) => (
              <div key={line.lineId} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">{line.lineName}</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {line.buyer} ({line.styleNumber})
                    </span>
                  </div>
                  <span className={`badge ${
                    line.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    line.status === 'Behind Schedule' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {line.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Completed: <strong className="text-slate-900 dark:text-slate-100">{line.actualDaily} Pcs</strong> / {line.targetDaily} Target</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{line.efficiency}% Eff</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      line.efficiency >= 90 ? 'bg-emerald-500' : line.efficiency >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(line.efficiency, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stock & Delayed Order Side Card */}
        <div className="space-y-4">
          <div className="glass-panel rounded-xl p-5 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Action Required (Critical Stock & Orders)
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-200">Zara Main Neck Labels Low</div>
                <div className="text-amber-700 dark:text-amber-400">Current: 3,200 Pcs (Safety min: 10,000)</div>
                <button onClick={() => setActiveModule('purchase')} className="mt-1 font-bold text-amber-800 dark:text-amber-300 underline">
                  Create PR Now →
                </button>
              </div>

              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1">
                <div className="font-bold text-rose-900 dark:text-rose-200">Order #SO-1025 Delayed</div>
                <div className="text-rose-700 dark:text-rose-400">Primark Fleece Hoodie - Sewing Line 04 bottleneck.</div>
                <button onClick={() => setActiveModule('production_planning')} className="mt-1 font-bold text-rose-800 dark:text-rose-300 underline">
                  Re-assign Sewing Line →
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5 space-y-3 bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase">
              <Sparkles className="w-4 h-4" /> Garments ERP Feature
            </div>
            <h4 className="font-extrabold text-base">Full 20-Module ERP Suite</h4>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Seamlessly manage buyers, orders, style tech packs, automated BOM material scaling, biometric shift logs, quality control gates, export invoices, and executive reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
