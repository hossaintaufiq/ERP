'use client';

import React from 'react';
import {
  Building2,
  Star,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Plus
} from 'lucide-react';
import { MOCK_SUPPLIERS } from '@/data/mockData';

export default function SupplierModule() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 8: Supplier Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Fabric & Trims Supplier Directory</h2>
          <p className="text-xs text-slate-500">Track raw material vendors, delivery lead times, quality star ratings, and outstanding accounts payable.</p>
        </div>
        <button className="bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-900/30 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Onboard New Supplier
        </button>
      </div>

      {/* Supplier Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_SUPPLIERS.map((sup) => (
          <div key={sup.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-brand-600/30 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{sup.companyName}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {sup.cityCountry}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900/60 text-status-warning dark:text-stone-400 px-2 py-1 rounded-lg font-bold text-xs border border-amber-200 dark:border-amber-900/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {sup.rating.toFixed(1)}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">Contact: {sup.contactPerson}</div>
                <div className="text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-brand-600" /> {sup.email}</div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-brand-600" /> {sup.phone}</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Materials Supplied</div>
                <div className="flex flex-wrap gap-1">
                  {sup.materialsSupplied.map((mat, idx) => (
                    <span key={idx} className="badge bg-stone-100 text-brand-800 dark:bg-stone-900 dark:text-brand-300 text-[10px]">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">Lead Time</div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{sup.leadTimeDays} Days</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-[10px]">Outstanding Balance</div>
                <div className="font-bold text-status-danger">${sup.outstandingPayment.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
