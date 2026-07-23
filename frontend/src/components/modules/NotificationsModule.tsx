'use client';

import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Boxes,
  Truck,
  DollarSign,
  Cog
} from 'lucide-react';
import { MOCK_NOTIFICATIONS, NotificationItem } from '@/data/mockData';

export default function NotificationsModule() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>('ALL');

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filtered = filterType === 'ALL' ? notifications : notifications.filter((n) => n.type === filterType);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 20: Automated Alert Center
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Factory Telemetry Alerts & Email/SMS Push</h2>
          <p className="text-xs text-slate-500">Real-time alerts for critical events: Low stock, late production lines, shipment delays, salary dues, machine faults, and order deadlines.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'stock', label: 'Low Stock' },
          { id: 'production', label: 'Late Production' },
          { id: 'shipment', label: 'Delayed Shipment' },
          { id: 'payroll', label: 'Salary Due' },
          { id: 'machine', label: 'Machine Maintenance' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterType === f.id
                ? 'bg-brand-800 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="glass-panel rounded-2xl p-5 space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
              item.read
                ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                : 'bg-stone-100/40 dark:bg-stone-900/30 border-stone-300 dark:border-stone-700 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${
                item.severity === 'high' ? 'bg-stone-1000 text-white' : item.severity === 'medium' ? 'bg-stone-1000 text-white' : 'bg-stone-1000 text-white'
              }`}>
                {item.type === 'stock' ? <Boxes className="w-4 h-4" /> : item.type === 'shipment' ? <Truck className="w-4 h-4" /> : item.type === 'payroll' ? <DollarSign className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{item.title}</h4>
                  {!item.read && <span className="w-2 h-2 rounded-full bg-stone-1000 animate-ping" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{item.message}</p>
                <div className="text-[10px] text-slate-400 font-mono">{item.timestamp}</div>
              </div>
            </div>

            {/* Email & SMS Notification Channels */}
            <div className="flex items-center gap-2 text-xs">
              <span className="badge bg-emerald-100 text-emerald-800 dark:bg-stone-900 dark:text-emerald-300 font-mono text-[10px] flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email Sent
              </span>
              <span className="badge bg-stone-100 text-brand-800 dark:bg-stone-900 dark:text-brand-300 font-mono text-[10px] flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> SMS Dispatched
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
