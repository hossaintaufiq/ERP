'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard, FilterRow } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';
import {
  ChartCard,
  CategoryBarChart,
  SharePieChart,
  CHART_COLORS,
} from '@/components/ui/Charts';

const GATES = ['ALL', 'Cutting', 'Sewing', 'Finishing', 'Final'] as const;

export default function QcModule() {
  const [gate, setGate] = useState<(typeof GATES)[number]>('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['qc'],
    queryFn: () => resources.list('qc', { limit: 100, sortBy: 'date', sortDir: 'desc' }),
  });
  const rows = (data as any)?.data || [];
  const filtered =
    gate === 'ALL'
      ? rows
      : rows.filter((r: any) => String(r.gate || '').toLowerCase().includes(gate.toLowerCase()));

  const passRate = useMemo(() => {
    if (!filtered.length) return 0;
    const passed = filtered.filter((r: any) => r.result === 'Pass' || r.result === 'Accepted').length;
    return Math.round((passed / filtered.length) * 100);
  }, [filtered]);

  const defects = filtered.reduce((s: number, r: any) => s + (r.defectQty || 0), 0);

  const resultMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      const key = r.result || 'Unknown';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const defectsByGate = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      const g = r.gate || 'Other';
      map.set(g, (map.get(g) || 0) + (r.defectQty || 0));
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 14 · Quality"
        title="QC Inspection Gates"
        description="Cutting → Sewing → Finishing → Final AQL audits with defect logging."
      />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard label="Inspections" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Pass rate" value={`${passRate}%`} />
        <StatCard label="Defect pcs" value={defects.toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard title="Pass / fail mix" description="Current filter">
          <SharePieChart data={resultMix} height={200} />
        </ChartCard>
        <ChartCard
          className="lg:col-span-2"
          title="Defects by gate"
          description="Where quality leaks — pcs failing AQL"
        >
          <CategoryBarChart
            data={defectsByGate}
            xKey="name"
            yKey="value"
            height={200}
            color={CHART_COLORS.danger}
          />
        </ChartCard>
      </div>

      <FilterRow>
        {GATES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGate(g)}
            className={cn('filter-chip', gate === g ? 'filter-chip-active' : 'filter-chip-idle')}
          >
            {g === 'ALL' ? 'All gates' : g}
          </button>
        ))}
      </FilterRow>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading QC…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'orderNumber', header: 'Order' },
            { key: 'gate', header: 'Gate' },
            { key: 'inspector', header: 'Inspector', hideOnMobile: true },
            {
              key: 'inspectedQty',
              header: 'Inspected',
              hideOnMobile: true,
              render: (r: any) => Number(r.inspectedQty || 0).toLocaleString(),
            },
            {
              key: 'defectQty',
              header: 'Defects',
              render: (r: any) => Number(r.defectQty || 0).toLocaleString(),
            },
            {
              key: 'defectTypes',
              header: 'Types',
              hideOnMobile: true,
              render: (r: any) => (r.defectTypes || []).join(', '),
            },
            { key: 'aql', header: 'AQL', hideOnMobile: true },
            { key: 'result', header: 'Result' },
            { key: 'date', header: 'Date', hideOnMobile: true },
          ]}
        />
      )}
    </div>
  );
}
