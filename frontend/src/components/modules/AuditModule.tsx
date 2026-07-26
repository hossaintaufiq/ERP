'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard, FilterRow } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';
import { ChartCard, SharePieChart, CategoryBarChart, CHART_COLORS } from '@/components/ui/Charts';

export default function AuditModule() {
  const [entity, setEntity] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['audit'],
    queryFn: () => resources.list('audit', { limit: 100, sortBy: 'createdAt', sortDir: 'desc' }),
  });
  const rows = (data as any)?.data || [];
  const entities = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((a: any) => a.entity).filter(Boolean)))],
    [rows],
  );
  const filtered = entity === 'ALL' ? rows : rows.filter((a: any) => a.entity === entity);

  const actionMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) map.set(r.action || 'Other', (map.get(r.action || 'Other') || 0) + 1);
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const entityMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) map.set(r.entity || 'Other', (map.get(r.entity || 'Other') || 0) + 1);
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [rows]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Compliance · Security"
        title="Audit Trail"
        description="Immutable activity log for create / update / workflow actions across the ERP."
      />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard label="Events" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Entities" value={Math.max(entities.length - 1, 0)} />
        <StatCard label="Showing" value={filtered.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <ChartCard title="Actions" description="CREATE / UPDATE / workflow">
          <SharePieChart data={actionMix} height={200} />
        </ChartCard>
        <ChartCard title="Touched entities" description="Where change happens">
          <CategoryBarChart
            data={entityMix}
            xKey="name"
            yKey="value"
            height={200}
            color={CHART_COLORS.muted}
          />
        </ChartCard>
      </div>

      <FilterRow>
        {entities.map((e: any) => (
          <button
            key={e}
            type="button"
            onClick={() => setEntity(e)}
            className={cn('filter-chip', entity === e ? 'filter-chip-active' : 'filter-chip-idle')}
          >
            {e}
          </button>
        ))}
      </FilterRow>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading audit log…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            {
              key: 'createdAt',
              header: 'When',
              render: (r: any) =>
                r.createdAt ? new Date(r.createdAt).toLocaleString() : '—',
            },
            { key: 'action', header: 'Action' },
            { key: 'entity', header: 'Entity' },
            { key: 'userName', header: 'User' },
            { key: 'details', header: 'Details', hideOnMobile: true },
            { key: 'ip', header: 'IP', hideOnMobile: true },
          ]}
        />
      )}
    </div>
  );
}
