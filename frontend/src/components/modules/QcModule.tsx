'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scissors,
  Shirt,
  Sparkles,
  Search
} from 'lucide-react';

export default function QcModule() {
  const [activeStage, setActiveStage] = useState<'cutting' | 'sewing' | 'finishing' | 'final'>('sewing');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 14: Quality Control (QC)
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Four-Stage Factory Inspection Gates</h2>
          <p className="text-xs text-slate-500">Every garment passes rigorous inspection gates: Cutting QC → Sewing QC → Finishing QC → Final AQL 2.5 Audit.</p>
        </div>
      </div>

      {/* QC Stage Gate Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveStage('cutting')}
          className={`glass-panel p-4 rounded-xl text-left border-2 transition-all ${
            activeStage === 'cutting' ? 'border-pink-500 bg-pink-50/40 dark:bg-pink-950/40' : 'border-transparent'
          }`}
        >
          <div className="text-[10px] font-extrabold uppercase text-pink-500">Gate 1</div>
          <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Cutting QC</div>
          <div className="text-xs text-emerald-600 font-bold mt-1">99.2% Pass Rate</div>
        </button>

        <button
          onClick={() => setActiveStage('sewing')}
          className={`glass-panel p-4 rounded-xl text-left border-2 transition-all ${
            activeStage === 'sewing' ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/40' : 'border-transparent'
          }`}
        >
          <div className="text-[10px] font-extrabold uppercase text-blue-500">Gate 2</div>
          <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Sewing Inline QC</div>
          <div className="text-xs text-amber-600 font-bold mt-1">94.8% Pass Rate</div>
        </button>

        <button
          onClick={() => setActiveStage('finishing')}
          className={`glass-panel p-4 rounded-xl text-left border-2 transition-all ${
            activeStage === 'finishing' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40' : 'border-transparent'
          }`}
        >
          <div className="text-[10px] font-extrabold uppercase text-emerald-500">Gate 3</div>
          <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Finishing QC</div>
          <div className="text-xs text-emerald-600 font-bold mt-1">97.5% Pass Rate</div>
        </button>

        <button
          onClick={() => setActiveStage('final')}
          className={`glass-panel p-4 rounded-xl text-left border-2 transition-all ${
            activeStage === 'final' ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/40' : 'border-transparent'
          }`}
        >
          <div className="text-[10px] font-extrabold uppercase text-purple-500">Gate 4</div>
          <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Final AQL 2.5 Audit</div>
          <div className="text-xs text-purple-600 font-bold mt-1">98.9% Pass Rate</div>
        </button>
      </div>

      {/* Defects Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Recent Defect Logs & Action Required</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Defect Category</th>
                  <th className="py-2.5 px-3 text-right">Defective Pcs</th>
                  <th className="py-2.5 px-3">Disposition</th>
                  <th className="py-2.5 px-3">Inspector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">#SO-1023</td>
                  <td className="py-3 px-3 font-bold text-rose-600">Skipped Stitch (Line 01)</td>
                  <td className="py-3 px-3 text-right font-bold">18 Pcs</td>
                  <td className="py-3 px-3"><span className="badge bg-amber-100 text-amber-800 font-bold">Send to Rework</span></td>
                  <td className="py-3 px-3 text-slate-500">Nusrat Jahan</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">#SO-1024</td>
                  <td className="py-3 px-3 font-bold text-rose-600">Shade Difference (Lot B)</td>
                  <td className="py-3 px-3 text-right font-bold">45 Pcs</td>
                  <td className="py-3 px-3"><span className="badge bg-rose-100 text-rose-800 font-bold">Rejected / Scrap</span></td>
                  <td className="py-3 px-3 text-slate-500">Nusrat Jahan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Defect Frequency Breakdown</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold"><span>Skipped Stitches</span><span>42%</span></div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-1 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold"><span>Thread Tension Faults</span><span>28%</span></div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-1 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold"><span>Shade Difference</span><span>18%</span></div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-1 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
