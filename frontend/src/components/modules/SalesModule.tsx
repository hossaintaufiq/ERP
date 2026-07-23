'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Shirt,
  Layers,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { MOCK_ORDERS, SalesOrder } from '@/data/mockData';

export default function SalesModule() {
  const [orders, setOrders] = useState<SalesOrder[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder>(MOCK_ORDERS[0]);
  const [filterBuyer, setFilterBuyer] = useState<string>('ALL');

  const filteredOrders = filterBuyer === 'ALL' ? orders : orders.filter((o) => o.buyer.includes(filterBuyer));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 3: Sales & Orders Desk
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Master Production Order Desk</h2>
          <p className="text-xs text-slate-500">Every garment begins with an order. Track color ways, size breakdowns, unit pricing, and delivery milestones.</p>
        </div>
        <button className="bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-900/30 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Sales Order (#SO)
        </button>
      </div>

      {/* Example Order Highlight Banner (As explicitly requested by user) */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-950 text-white rounded-2xl p-6 shadow-xl border border-stone-800 space-y-4">
        <div className="flex justify-between items-center">
          <span className="bg-brand-600/20 text-stone-400 text-xs font-bold px-2.5 py-1 rounded border border-brand-600/40">
            Featured Active Order (#SO-1023)
          </span>
          <span className="text-xs font-mono text-slate-300">Delivery Target: 25 August 2026</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Order Number</div>
            <div className="text-base font-black text-brand-500 font-mono">#SO-1023</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Buyer Brand</div>
            <div className="text-base font-bold text-white">Zara (Inditex)</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Product Name</div>
            <div className="text-base font-bold text-white">Slim Fit Polo Shirt</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Total Order Qty</div>
            <div className="text-base font-black text-emerald-400">5,000 Pieces</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Color Spec</div>
            <div className="text-base font-bold text-white flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-navy-900 border border-white" /> Navy Blue
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold">Unit Price / Value</div>
            <div className="text-base font-bold text-amber-400">$4.50 ($22,500)</div>
          </div>
        </div>
      </div>

      {/* Orders Table & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-600" /> Active Order Registry
            </h3>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Buyer:</span>
              <select
                value={filterBuyer}
                onChange={(e) => setFilterBuyer(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
              >
                <option value="ALL">All Buyers</option>
                <option value="Zara">Zara</option>
                <option value="H&M">H&M</option>
                <option value="Primark">Primark</option>
                <option value="Walmart">Walmart</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Buyer</th>
                  <th className="py-2.5 px-3">Style / Product</th>
                  <th className="py-2.5 px-3">Qty (Pcs)</th>
                  <th className="py-2.5 px-3">Delivery Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder.orderNumber === ord.orderNumber;
                  return (
                    <tr
                      key={ord.orderNumber}
                      onClick={() => setSelectedOrder(ord)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-stone-100/80 dark:bg-stone-900/40 text-brand-900 dark:text-brand-200' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-brand-700 dark:text-brand-400">{ord.orderNumber}</td>
                      <td className="py-3 px-3 font-semibold">{ord.buyer}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{ord.productName}</div>
                        <div className="text-[10px] text-slate-400">{ord.styleNumber} • {ord.color}</div>
                      </td>
                      <td className="py-3 px-3 font-bold">{ord.totalQuantity.toLocaleString()} Pcs</td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{ord.deliveryDate}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`badge ${
                            ord.status === 'In Production'
                              ? 'bg-stone-100 text-brand-800 dark:bg-stone-900 dark:text-brand-300'
                              : ord.status === 'Cutting'
                              ? 'bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-400'
                              : ord.status === 'Sewing'
                              ? 'bg-stone-100 text-brand-800 dark:bg-stone-900 dark:text-brand-300'
                              : ord.status === 'Delayed'
                              ? 'bg-rose-100 text-rose-800 dark:bg-stone-900 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-stone-900 dark:text-emerald-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Detailed Matrix */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Order Detail Card</div>
              <h3 className="font-black text-lg text-brand-700 dark:text-brand-400 font-mono">{selectedOrder.orderNumber}</h3>
            </div>
            <span className="badge bg-stone-100 text-brand-800 dark:bg-stone-900 dark:text-brand-300 font-bold">
              {selectedOrder.status}
            </span>
          </div>

          {/* Size Breakdown Grid (Requested in details) */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Size Breakdown Matrix (Pcs)</h4>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="font-bold text-slate-400 text-[10px]">S</div>
                <div className="font-black text-slate-900 dark:text-slate-100">{selectedOrder.sizeBreakdown.S}</div>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="font-bold text-slate-400 text-[10px]">M</div>
                <div className="font-black text-slate-900 dark:text-slate-100">{selectedOrder.sizeBreakdown.M}</div>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="font-bold text-slate-400 text-[10px]">L</div>
                <div className="font-black text-slate-900 dark:text-slate-100">{selectedOrder.sizeBreakdown.L}</div>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="font-bold text-slate-400 text-[10px]">XL</div>
                <div className="font-black text-slate-900 dark:text-slate-100">{selectedOrder.sizeBreakdown.XL}</div>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="font-bold text-slate-400 text-[10px]">XXL</div>
                <div className="font-black text-slate-900 dark:text-slate-100">{selectedOrder.sizeBreakdown.XXL}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Unit Price:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">${selectedOrder.unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Order Value:</span>
              <span className="font-black text-status-success dark:text-stone-400 text-sm">${selectedOrder.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Deadline:</span>
              <span className="font-bold text-brand-700 dark:text-brand-400 font-mono">{selectedOrder.deliveryDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
