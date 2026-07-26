'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard, FilterRow } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';
import { ChartCard, SharePieChart, CategoryBarChart, CHART_COLORS } from '@/components/ui/Charts';

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

  const statusMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      map.set(r.status || 'Other', (map.get(r.status || 'Other') || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const topEff = useMemo(
    () =>
      [...rows]
        .sort((a: any, b: any) => (b.efficiency || 0) - (a.efficiency || 0))
        .slice(0, 8)
        .map((m: any) => ({
          name: m.code || m.name,
          efficiency: m.efficiency || 0,
        })),
    [rows],
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 15 · Assets"
        title="Machine & Maintenance Board"
        description="Sewing / cutting / finishing assets with utilization and PM schedules."
      />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard label="Machines" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Running" value={running} />
        <StatCard label="Avg efficiency" value={`${avgEff}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard title="Machine status" description="Running / idle / down">
          <SharePieChart data={statusMix} height={200} />
        </ChartCard>
        <ChartCard className="lg:col-span-2" title="Top OEE" description="Highest efficiency assets">
          <CategoryBarChart
            data={topEff}
            xKey="name"
            yKey="efficiency"
            height={200}
            valueSuffix="%"
            color={CHART_COLORS.success}
          />
        </ChartCard>
      </div>

      <FilterRow>
        {statuses.map((s: any) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn('filter-chip', status === s ? 'filter-chip-active' : 'filter-chip-idle')}
          >
            {s}
          </button>
        ))}
      </FilterRow>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading machines…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'code', header: 'Code' },
            { key: 'name', header: 'Machine' },
            { key: 'type', header: 'Type', hideOnMobile: true },
            { key: 'floorLocation', header: 'Location', hideOnMobile: true },
            { key: 'status', header: 'Status' },
            {
              key: 'efficiency',
              header: 'Eff %',
              render: (r: any) => `${r.efficiency}%`,
            },
            { key: 'lastMaintenance', header: 'Last PM', hideOnMobile: true },
            { key: 'nextMaintenance', header: 'Next PM', hideOnMobile: true },
          ]}
        />
      )}
    </div>
  );
}
