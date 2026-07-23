'use client';

import React, { useState } from 'react';
import {
  Users,
  Building,
  Mail,
  Phone,
  FileText,
  DollarSign,
  ShoppingBag,
  ExternalLink,
  Download,
  Plus,
  CheckCircle,
  Globe
} from 'lucide-react';
import { MOCK_BUYERS, Buyer } from '@/data/mockData';

export default function CustomerModule() {
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer>(MOCK_BUYERS[0]);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'payments' | 'docs'>('info');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 2: Customer Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Global Buyers & Brand Directory</h2>
          <p className="text-xs text-slate-500">Manage buyer accounts, contact leads, purchase order history, payment ledgers, and compliance files.</p>
        </div>
        <button className="bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-900/30 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Brand / Buyer
        </button>
      </div>

      {/* Buyer Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_BUYERS.map((b) => {
          const isSelected = selectedBuyer.id === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBuyer(b)}
              className={`glass-panel p-4 rounded-xl cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-brand-700 bg-stone-100/50 dark:bg-stone-900/40 shadow-lg'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">{b.code}</div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">{b.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" /> {b.country}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex justify-between text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Active Orders</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{b.activeOrders} POs</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Total Revenue</div>
                  <div className="font-bold text-status-success dark:text-stone-400">${(b.totalRevenue / 1000).toFixed(0)}k</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Buyer Detailed Hub */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <img src={selectedBuyer.logo} alt={selectedBuyer.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-600/30" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{selectedBuyer.name}</h3>
                <span className="badge bg-stone-100 text-brand-800 dark:bg-stone-900 dark:text-brand-300 font-bold">
                  {selectedBuyer.code}
                </span>
              </div>
              <p className="text-xs text-slate-500">Master Brand Account & Enterprise Garment Purchaser</p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'info' ? 'bg-white dark:bg-slate-900 text-brand-700 shadow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Buyer Information
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'orders' ? 'bg-white dark:bg-slate-900 text-brand-700 shadow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Purchase Orders ({selectedBuyer.activeOrders})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'payments' ? 'bg-white dark:bg-slate-900 text-brand-700 shadow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Payment History
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'docs' ? 'bg-white dark:bg-slate-900 text-brand-700 shadow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Documents ({selectedBuyer.documents.length})
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Contact Person</h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3">
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedBuyer.contactPerson}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-600" /> {selectedBuyer.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-600" /> {selectedBuyer.phone}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Financial Terms</h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Terms:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedBuyer.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Lifetime Volume:</span>
                  <span className="font-bold text-status-success">${selectedBuyer.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Outstanding Balance:</span>
                  <span className="font-bold text-status-danger">${selectedBuyer.outstandingBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Compliance & Audit Status</h4>
              <div className="p-4 bg-stone-100 dark:bg-stone-900/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Approved Tier-1 Manufacturer
                </div>
                <p className="text-status-success dark:text-stone-400 text-[11px]">
                  Fully compliant with BSCI, HIGG Index, OEKO-TEX Standard 100, and WRAP factory safety regulations.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Active & Historical Orders</h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
                <span>Order #</span>
                <span>Product / Style</span>
                <span>Quantity</span>
                <span>Status</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-mono font-bold text-brand-700">#SO-1023</span>
                <span>Premium Slim Fit Polo Shirt (STL-9920)</span>
                <span>5,000 Pcs</span>
                <span className="badge bg-stone-100 text-brand-800 dark:bg-stone-900 dark:text-brand-300 font-bold">In Production</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-mono font-bold text-brand-700">#SO-1027</span>
                <span>Washed Denim Oversized Jacket (STL-8801)</span>
                <span>3,000 Pcs</span>
                <span className="badge bg-purple-100 text-purple-800 dark:bg-stone-900 dark:text-purple-300 font-bold">QC Inspection</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-400">Payment Ledger</h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Invoice Date</span>
                <span>Ref #</span>
                <span>Payment Mode</span>
                <span>Amount Paid</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>2026-06-15</span>
                <span className="font-mono">INV-2026-081</span>
                <span>Letter of Credit (LC)</span>
                <span className="font-bold text-status-success">$125,000</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-400">Compliance & Contract Files</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedBuyer.documents.map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-600" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{doc.title}</div>
                      <div className="text-[10px] text-slate-400">{doc.date} • {doc.size}</div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
