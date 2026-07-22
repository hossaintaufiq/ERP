'use client';

import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Warehouse,
  RotateCcw,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { MOCK_INVENTORY, InventoryItem } from '@/data/mockData';

export default function InventoryModule() {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [activeTab, setActiveTab] = useState<'raw' | 'finished' | 'returns' | 'alerts'>('raw');
  const [search, setSearch] = useState('');

  const filteredItems = inventory.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 6: Inventory Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Raw Materials & Warehouse Control</h2>
          <p className="text-xs text-slate-500">Tracks fabric rolls, trims, buttons, poly bags, master export cartons, finished goods, returns, and safety alerts.</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Stock Entry / GRN
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'raw' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Raw Materials (Fabric, Buttons, Thread, Labels, Cartons, Poly Bags)
        </button>
        <button
          onClick={() => setActiveTab('finished')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'finished' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Finished Goods Warehouse
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'returns' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Returns & Damaged Items
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'alerts' ? 'bg-rose-600 text-white shadow' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Stock Safety Alerts ({inventory.filter((i) => i.status !== 'In Stock').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter inventory item name, code (FAB-CTN), category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
        />
      </div>

      {/* Main Inventory Table */}
      {activeTab === 'raw' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-3 px-3">Item Code</th>
                  <th className="py-3 px-3">Material Name & Description</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Warehouse Bay Location</th>
                  <th className="py-3 px-3 text-right">Current Stock</th>
                  <th className="py-3 px-3 text-right">Min Alert Level</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Last Restocked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{item.code}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="py-3 px-3">
                      <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{item.warehouse}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                      {item.currentStock.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {item.minAlertLevel.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`badge ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">{item.lastRestocked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'finished' && (
        <div className="glass-panel rounded-2xl p-6 text-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Finished Goods Export Dispatch Store</h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
            <div className="flex justify-between font-bold">
              <span>Order # / Buyer</span>
              <span>Packed Cartons</span>
              <span>Storage Bay</span>
              <span>Customs Ready</span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-mono text-blue-600 font-bold">#SO-1023 (Zara Polo)</span>
              <span>250 Export Cartons (5,000 Pcs)</span>
              <span>Warehouse C - Bay 01</span>
              <span className="badge bg-emerald-100 text-emerald-800 font-bold">Cleared</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'returns' && (
        <div className="glass-panel rounded-2xl p-6 text-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 text-rose-600">Damaged & Return Goods Ledger</h3>
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl space-y-2 border border-rose-200 dark:border-rose-900/60">
            <div className="flex justify-between font-bold text-rose-900 dark:text-rose-200">
              <span>Item Description</span>
              <span>Defect Cause</span>
              <span>Quarantined Qty</span>
              <span>Disposition</span>
            </div>
            <div className="flex justify-between py-2 border-t border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300">
              <span>Single Jersey White Fabric Roll</span>
              <span>Oil Stains from Machine #02</span>
              <span>45 Meters</span>
              <span className="font-bold">Scrap / Supplier Claim</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="glass-panel rounded-2xl p-6 text-xs space-y-4">
          <h3 className="font-extrabold text-sm text-rose-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Material Re-Order Trigger Alert List
          </h3>
          <div className="space-y-3">
            {inventory
              .filter((i) => i.status !== 'In Stock')
              .map((item) => (
                <div key={item.id} className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-rose-900 dark:text-rose-100">{item.name} ({item.code})</div>
                    <div className="text-[11px] text-rose-700 dark:text-rose-400">
                      Current Stock: <strong>{item.currentStock} {item.unit}</strong> (Below safety threshold {item.minAlertLevel} {item.unit})
                    </div>
                  </div>
                  <button className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg">
                    Generate PR →
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
