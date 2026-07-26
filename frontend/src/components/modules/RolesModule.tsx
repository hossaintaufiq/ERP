'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { resources } from '@/lib/api';
import { PageHeader, StatCard } from '@/components/ui/DataTable';

interface RolesModuleProps {
  activeRole: string;
  setActiveRole: (r: string) => void;
}

export default function RolesModule({ activeRole, setActiveRole }: RolesModuleProps) {
  const rolesQ = useQuery({
    queryKey: ['roles'],
    queryFn: () => resources.list('roles', { limit: 50 }),
  });
  const usersQ = useQuery({
    queryKey: ['users'],
    queryFn: () => resources.list('users', { limit: 50 }),
  });

  const roles = (rolesQ.data as any)?.data || [];
  const users = (usersQ.data as any)?.data || [];

  const permissionCatalog = useMemo(() => {
    const set = new Set<string>();
    for (const r of roles) {
      for (const p of r.permissions || []) {
        if (p !== '*') set.add(p);
      }
    }
    if (!set.size) {
      [
        'hr.*',
        'employees.*',
        'production.*',
        'qc.*',
        'inventory.*',
        'finance.*',
        'buyers.*',
        'orders.*',
      ].forEach((p) => set.add(p));
    }
    return Array.from(set).sort();
  }, [roles]);

  const hasPerm = (role: any, perm: string) => {
    const perms: string[] = role.permissions || [];
    if (perms.includes('*')) return true;
    if (perms.includes(perm)) return true;
    const [domain] = perm.split('.');
    return perms.includes(`${domain}.*`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 19 · Security"
        title="Roles & Permission Matrix"
        description="Live RBAC definitions from the API. Switch role to simulate authorization context."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Roles" value={roles.length} />
        <StatCard label="Users" value={users.length} />
        <StatCard label="Active context" value={activeRole} />
      </div>

      {rolesQ.isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading roles…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r: any) => {
            const selected = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRole(r.id)}
                className={`panel p-4 text-left border-2 space-y-2 ${
                  selected ? 'border-brand-600 shadow-md' : 'border-transparent hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <ShieldCheck className="w-5 h-5 text-brand-600" />
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 dark:bg-stone-800">
                    {r.id}
                  </span>
                </div>
                <div className="font-bold text-sm">{r.name}</div>
                <div className="text-[11px] text-stone-400">
                  {(r.permissions || []).includes('*')
                    ? 'Full access (*)'
                    : `${(r.permissions || []).length} permission grants`}
                </div>
                <div className="text-[11px] font-semibold text-brand-700">
                  {selected ? '✓ Active simulation role' : 'Click to simulate'}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="panel p-5 space-y-4 overflow-x-auto">
        <h3 className="font-bold text-sm">Permission matrix</h3>
        <table className="w-full text-left text-xs border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase text-[10px]">
              <th className="py-2.5 px-3">Permission</th>
              {roles.map((r: any) => (
                <th key={r.id} className="py-2.5 px-2 text-center">
                  {r.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {permissionCatalog.map((perm) => (
              <tr key={perm}>
                <td className="py-2.5 px-3 font-semibold">{perm}</td>
                {roles.map((r: any) => (
                  <td key={r.id} className="py-2.5 px-2 text-center">
                    {hasPerm(r, perm) ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-stone-300 dark:text-stone-700 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
