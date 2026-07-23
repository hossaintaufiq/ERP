'use client';

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function FinanceModule() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 17: Financial Control & Cash Flow
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Enterprise Accounting & Profit Margins</h2>
          <p className="text-xs text-slate-500">Track order income, yarn/fabric expenses, Accounts Receivable (AR), Accounts Payable (AP), and net cash flow.</p>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Monthly Income (Sales)</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">$584,200</div>
          <div className="text-xs text-status-success font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% vs Last Month
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Operational Expenses</div>
          <div className="text-2xl font-black text-status-danger dark:text-stone-400">$412,000</div>
          <div className="text-xs text-slate-500">Raw materials, payroll & power</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Accounts Receivable (AR)</div>
          <div className="text-2xl font-black text-brand-700 dark:text-brand-400">$320,000</div>
          <div className="text-xs text-slate-500">Pending buyer LCs (Zara, H&M)</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Accounts Payable (AP)</div>
          <div className="text-2xl font-black text-status-warning dark:text-stone-400">$145,000</div>
          <div className="text-xs text-slate-500">Mill suppliers & thread vendors</div>
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Order-wise Profitability Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Buyer Brand</th>
                <th className="py-2.5 px-3 text-right">FOB Sales Revenue</th>
                <th className="py-2.5 px-3 text-right">Direct Material Cost</th>
                <th className="py-2.5 px-3 text-right">Factory Overhead</th>
                <th className="py-2.5 px-3 text-right font-black text-status-success">Net Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-mono font-bold text-brand-700">#SO-1023</td>
                <td className="py-3 px-3">Zara (Inditex)</td>
                <td className="py-3 px-3 text-right font-mono font-bold">$22,500</td>
                <td className="py-3 px-3 text-right font-mono text-slate-500">$11,600</td>
                <td className="py-3 px-3 text-right font-mono text-slate-500">$4,200</td>
                <td className="py-3 px-3 text-right font-mono font-black text-status-success text-sm">+$6,700 (29.7%)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-mono font-bold text-brand-700">#SO-1024</td>
                <td className="py-3 px-3">H&M Hennes & Mauritz</td>
                <td className="py-3 px-3 text-right font-mono font-bold">$32,000</td>
                <td className="py-3 px-3 text-right font-mono text-slate-500">$18,200</td>
                <td className="py-3 px-3 text-right font-mono text-slate-500">$5,800</td>
                <td className="py-3 px-3 text-right font-mono font-black text-status-success text-sm">+$8,000 (25.0%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
