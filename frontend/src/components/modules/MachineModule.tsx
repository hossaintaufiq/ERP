'use client';

import React from 'react';
import {
  Cog,
  Wrench,
  Activity,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Plus
} from 'lucide-react';
import { MOCK_MACHINES } from '@/data/mockData';

export default function MachineModule() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 15: Machine Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Equipment OEE & Preventive Maintenance</h2>
          <p className="text-xs text-slate-500">Track 132 sewing machines, embroidery heads, auto-cutters, assigned operators, breakdown logs, and service schedules.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Register New Machine
        </button>
      </div>

      {/* Machine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_MACHINES.map((mc) => (
          <div key={mc.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-xs">{mc.code}</span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{mc.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{mc.type}</div>
                </div>
                <span
                  className={`badge ${
                    mc.status === 'Running'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold'
                  }`}
                >
                  {mc.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Floor Location:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{mc.floorLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Operator:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{mc.operatorAssigned}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Machine OEE Efficiency:</span>
                  <span className="text-emerald-600 font-mono">{mc.efficiency}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${mc.efficiency}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
              <div>Last Calibration: <strong className="text-slate-700 dark:text-slate-300">{mc.lastMaintenance}</strong></div>
              <div>Next Due: <strong className="text-blue-600">{mc.nextMaintenance}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
