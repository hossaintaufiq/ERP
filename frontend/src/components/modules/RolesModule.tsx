'use client';

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { MOCK_USER_ROLES } from '@/data/mockData';

interface RolesModuleProps {
  activeRole: string;
  setActiveRole: (r: string) => void;
}

export default function RolesModule({ activeRole, setActiveRole }: RolesModuleProps) {
  const permissions = [
    { name: 'View Executive Dashboard KPIs', roles: ['owner', 'gm', 'prod_mgr', 'finance', 'sales'] },
    { name: 'Approve Buyer Orders & Pricing', roles: ['owner', 'gm', 'sales'] },
    { name: 'Launch & Calculate BOM Requirements', roles: ['owner', 'gm', 'prod_mgr', 'store_mgr', 'sales'] },
    { name: 'Approve Material Purchase Requests (PR/PO)', roles: ['owner', 'gm', 'store_mgr', 'accounts'] },
    { name: 'Manage Production Line Schedules', roles: ['owner', 'gm', 'prod_mgr'] },
    { name: 'Run Monthly Salary & Payslip Disbursement', roles: ['owner', 'gm', 'hr', 'accounts'] },
    { name: 'Log QC Inspection Defect Gate Failures', roles: ['owner', 'qc'] },
    { name: 'Operator Shop Floor Output Logging', roles: ['owner', 'prod_mgr', 'operator'] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 19: Role-Based Access Control (RBAC)
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">User Roles & Permission Matrix</h2>
          <p className="text-xs text-slate-500">Each factory role has tailored view & action permissions. Switch active role to test system authorization rules.</p>
        </div>
      </div>

      {/* Role Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {MOCK_USER_ROLES.map((r) => {
          const isSelected = activeRole === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`glass-panel p-4 rounded-xl cursor-pointer border-2 transition-all space-y-2 ${
                isSelected ? 'border-brand-700 bg-stone-100/50 dark:bg-stone-900/40 shadow-lg' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${r.color}`}>{r.badge}</span>
              </div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{r.name}</div>
              <div className="text-[11px] text-slate-400">
                {isSelected ? '✓ Currently Active Role' : 'Click to simulate this role'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Security Permission Matrix by Role</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                <th className="py-2.5 px-3">System Permission Capability</th>
                {MOCK_USER_ROLES.map((r) => (
                  <th key={r.id} className="py-2.5 px-2 text-center">{r.id.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {permissions.map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{perm.name}</td>
                  {MOCK_USER_ROLES.map((r) => {
                    const isAllowed = perm.roles.includes(r.id);
                    return (
                      <td key={r.id} className="py-3 px-2 text-center">
                        {isAllowed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
