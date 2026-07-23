'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  BarChart3
} from 'lucide-react';

export default function ReportsModule() {
  const [reportType, setReportType] = useState('production');
  const [timeline, setTimeline] = useState<'Daily' | 'Monthly' | 'Yearly'>('Monthly');

  const reportTabs = [
    { id: 'production', title: 'Production Report' },
    { id: 'inventory', title: 'Inventory Report' },
    { id: 'profit', title: 'Profit & Loss Report' },
    { id: 'employee', title: 'Employee Performance Report' },
    { id: 'attendance', title: 'Attendance Audit Report' },
    { id: 'qc', title: 'Quality & Defect Report' },
    { id: 'sales', title: 'Sales Order Report' },
    { id: 'purchase', title: 'Purchase Sourcing Report' },
    { id: 'machine', title: 'Machine OEE Report' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 18: Executive Reports Generator
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Enterprise Analytics & CSV Export</h2>
          <p className="text-xs text-slate-500">Generate structured daily, monthly, and yearly compliance reports for executive decision-making.</p>
        </div>

        <button
          onClick={() => alert(`Exporting ${reportType} (${timeline}) as CSV...`)}
          className="bg-status-success hover:bg-stone-1000 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Report (CSV / Excel)
        </button>
      </div>

      {/* Report Category Selectors */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                reportType === tab.id
                  ? 'bg-brand-800 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Timeline Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {(['Daily', 'Monthly', 'Yearly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeline(t)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeline === t ? 'bg-white dark:bg-slate-900 text-brand-700 shadow' : 'text-slate-500'
              }`}
            >
              {t} Filter
            </button>
          ))}
        </div>
      </div>

      {/* Generated Report View Box */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="text-xs font-bold text-brand-700 uppercase font-mono">{timeline} Summary Filter Active</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 capitalize">
              {reportTabs.find((r) => r.id === reportType)?.title} ({timeline} View)
            </h3>
          </div>
          <span className="badge bg-stone-100 text-brand-800 font-bold">Verified Audit Record</span>
        </div>

        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-3">
          <FileSpreadsheet className="w-12 h-12 text-brand-600 mx-auto" />
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            {reportTabs.find((r) => r.id === reportType)?.title} Compiled
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Report dataset synthesized from factory floor sensors, ERP line telemetry, buyer purchase orders, and biometric gate logs for the current {timeline.toLowerCase()} period.
          </p>
        </div>
      </div>
    </div>
  );
}
