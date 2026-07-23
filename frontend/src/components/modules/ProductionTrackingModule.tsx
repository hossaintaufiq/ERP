'use client';

import React from 'react';
import {
  LineChart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Users,
  Cog,
  Sparkles
} from 'lucide-react';
import { MOCK_LINE_TRACKING } from '@/data/mockData';

export default function ProductionTrackingModule() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 10: Production Tracking
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Shop Floor Sewing Line Telemetry</h2>
          <p className="text-xs text-slate-500">Live hourly tracking: Daily targets, actual completed output, efficiency %, rejected pieces, rework counts, assigned machines, and line supervisors.</p>
        </div>
      </div>

      {/* Production Lines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_LINE_TRACKING.map((line) => (
          <div key={line.lineId} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-brand-600/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-brand-700 dark:text-brand-400 text-sm">{line.lineId}</span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{line.lineName}</h3>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Supervisor: <strong className="text-slate-700 dark:text-slate-300">{line.supervisor}</strong>
                </div>
              </div>
              <span
                className={`badge ${
                  line.status === 'Optimal'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-stone-900 dark:text-emerald-300 font-bold'
                    : line.status === 'Behind Schedule'
                    ? 'bg-amber-100 text-amber-800 dark:bg-stone-900 dark:text-amber-300 font-bold'
                    : 'bg-rose-100 text-rose-800 dark:bg-stone-900 dark:text-rose-300 font-bold animate-pulse'
                }`}
              >
                {line.status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Buyer Order:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{line.buyer} ({line.styleNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Machines Assigned:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{line.machineCount} Sewing Machines</span>
              </div>
            </div>

            {/* Target vs Actual Progress */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Daily Output Progress:</span>
                <span className="text-brand-700 dark:text-brand-400 font-mono">
                  {line.actualDaily} / {line.targetDaily} Pcs ({line.efficiency}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    line.efficiency >= 90 ? 'bg-stone-1000' : line.efficiency >= 80 ? 'bg-stone-1000' : 'bg-stone-1000'
                  }`}
                  style={{ width: `${Math.min(line.efficiency, 100)}%` }}
                />
              </div>
            </div>

            {/* Rejection & Rework Counters */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-stone-100 dark:bg-stone-900/40 rounded-xl border border-rose-200 dark:border-rose-900/60">
                <div className="text-status-danger text-[10px] font-bold uppercase">Rejected Pieces</div>
                <div className="font-black text-status-danger dark:text-stone-400 text-lg">{line.rejections} Pcs</div>
              </div>
              <div className="p-2.5 bg-stone-100 dark:bg-stone-900/40 rounded-xl border border-amber-200 dark:border-amber-900/60">
                <div className="text-status-warning text-[10px] font-bold uppercase">Rework Pieces</div>
                <div className="font-black text-status-warning dark:text-stone-400 text-lg">{line.rework} Pcs</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
