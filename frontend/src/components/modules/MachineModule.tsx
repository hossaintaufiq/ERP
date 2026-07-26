'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function MachineModule() {
  const [status, setStatus] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['machines'],
    queryFn: () => resources.list('machines', { limit: 100, sortBy: 'code' }),
  });
  const rows = (data as any)?.data || [];
  const statuses = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((m: any) => m.status).filter(Boolean)))],
    [rows],
  );
  const filtered = status === 'ALL' ? rows : rows.filter((m: any) => m.status === status);
  const running = rows.filter((m: any) => m.status === 'Running').length;
  const avgEff = rows.length
    ? Math.round(rows.reduce((s: number, m: any) => s + (m.efficiency || 0), 0) / rows.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 15 · Assets"
        title="Machine & Maintenance Board"
        description="Sewing / cutting / finishing assets with utilization and PM schedules."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Machines" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Running" value={running} />
        <StatCard label="Avg efficiency" value={`${avgEff}%`} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {statuses.map((s: any) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              status === s ? 'bg-brand-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading machines…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'code', header: 'Code' },
            { key: 'name', header: 'Machine' },
            { key: 'type', header: 'Type' },
            { key: 'floorLocation', header: 'Location' },
            { key: 'status', header: 'Status' },
            {
              key: 'efficiency',
              header: 'Eff %',
              render: (r: any) => `${r.efficiency}%`,
            },
            { key: 'lastMaintenance', header: 'Last PM' },
            { key: 'nextMaintenance', header: 'Next PM' },
          ]}
        />
      )}
    </div>
  );
}
