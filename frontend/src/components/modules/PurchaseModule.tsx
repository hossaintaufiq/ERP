'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  PackageCheck,
  DollarSign,
  Plus,
  Clock,
  Sparkles
} from 'lucide-react';
import { MOCK_PURCHASE_ORDERS, PurchaseOrder } from '@/data/mockData';

export default function PurchaseModule() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [prMaterial, setPrMaterial] = useState('Zara Main Neck Label');
  const [prQuantity, setPrQuantity] = useState(10000);
  const [prSupplier, setPrSupplier] = useState('Apex Textile Mills Ltd');

  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault();
    const newPo: PurchaseOrder = {
      poNumber: `PO-2026-${Math.floor(880 + Math.random() * 100)}`,
      prNumber: `PR-${Math.floor(900 + Math.random() * 100)}`,
      supplier: prSupplier,
      materials: [{ name: prMaterial, qty: prQuantity, unit: 'Pcs', price: 0.09 }],
      totalCost: prQuantity * 0.09,
      issueDate: new Date().toISOString().split('T')[0],
      expectedDelivery: '2026-08-05',
      status: 'PR Approved',
    };
    setPurchaseOrders([newPo, ...purchaseOrders]);
  };

  const updateStatus = (poNumber: string, nextStatus: PurchaseOrder['status']) => {
    setPurchaseOrders(
      purchaseOrders.map((p) => (p.poNumber === poNumber ? { ...p, status: nextStatus } : p))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 7: Purchase Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Procurement & Material Requisition Workflow</h2>
          <p className="text-xs text-slate-500">Automate raw material sourcing when stock drops below safety thresholds.</p>
        </div>
      </div>

      {/* 5-Step Workflow Pipeline Visualizer (As requested in prompt!) */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/10 border-blue-500/30">
        <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Automated 5-Stage Procurement Lifecycle
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="font-mono font-bold text-blue-600 text-[10px]">STAGE 1</div>
            <div className="font-extrabold text-slate-900 dark:text-slate-100">Create PR</div>
            <div className="text-[10px] text-slate-400">Requisition Request</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="font-mono font-bold text-indigo-600 text-[10px]">STAGE 2</div>
            <div className="font-extrabold text-slate-900 dark:text-slate-100">Issue PO</div>
            <div className="text-[10px] text-slate-400">Sent to Supplier</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="font-mono font-bold text-purple-600 text-[10px]">STAGE 3</div>
            <div className="font-extrabold text-slate-900 dark:text-slate-100">Receive Materials</div>
            <div className="text-[10px] text-slate-400">Goods Receiving (GRN)</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="font-mono font-bold text-emerald-600 text-[10px]">STAGE 4</div>
            <div className="font-extrabold text-slate-900 dark:text-slate-100">Update Stock</div>
            <div className="text-[10px] text-slate-400">Inventory Sync</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="font-mono font-bold text-teal-600 text-[10px]">STAGE 5</div>
            <div className="font-extrabold text-slate-900 dark:text-slate-100">Supplier Payment</div>
            <div className="text-[10px] text-slate-400">Accounts Payable</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create PR Form */}
        <form onSubmit={handleCreatePr} className="glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" /> Create Purchase Request (PR)
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Material Needed</label>
              <input
                type="text"
                value={prMaterial}
                onChange={(e) => setPrMaterial(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Quantity</label>
              <input
                type="number"
                value={prQuantity}
                onChange={(e) => setPrQuantity(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Target Supplier</label>
              <select
                value={prSupplier}
                onChange={(e) => setPrSupplier(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
              >
                <option value="Apex Textile Mills Ltd">Apex Textile Mills Ltd</option>
                <option value="YKK Fastening Accessories">YKK Fastening Accessories</option>
                <option value="Coats Thread Bangladesh">Coats Thread Bangladesh</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl shadow transition-colors">
              Submit Purchase Request →
            </button>
          </div>
        </form>

        {/* PO List & Lifecycle Advancement */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Active Purchase Orders & Lifecycle Controls</h3>

          <div className="space-y-3">
            {purchaseOrders.map((po) => (
              <div key={po.poNumber} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400">{po.poNumber}</span>
                    <span className="text-slate-400 font-mono">({po.prNumber})</span>
                  </div>
                  <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                    {po.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{po.supplier}</div>
                    <div className="text-[11px] text-slate-400">
                      {po.materials.map((m) => `${m.name} (${m.qty} ${m.unit})`).join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600 text-sm">${po.totalCost.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">Exp: {po.expectedDelivery}</div>
                  </div>
                </div>

                {/* Status Advancement Buttons */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end gap-2">
                  {po.status === 'PR Approved' && (
                    <button
                      onClick={() => updateStatus(po.poNumber, 'PO Issued')}
                      className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg"
                    >
                      Issue PO to Supplier →
                    </button>
                  )}
                  {po.status === 'PO Issued' && (
                    <button
                      onClick={() => updateStatus(po.poNumber, 'Materials Received')}
                      className="bg-purple-600 text-white font-bold px-3 py-1.5 rounded-lg"
                    >
                      Receive Materials & Stock GRN →
                    </button>
                  )}
                  {po.status === 'Materials Received' && (
                    <button
                      onClick={() => updateStatus(po.poNumber, 'Paid')}
                      className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg"
                    >
                      Process Supplier Payment →
                    </button>
                  )}
                  {po.status === 'Paid' && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Cycle Completed & Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
