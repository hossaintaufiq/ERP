'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function ProductionTrackingModule() {
  const { data, isLoading } = useQuery({
    queryKey: ['production-tracking'],
    queryFn: () => resources.list('production', { limit: 100, sortBy: 'efficiency', sortDir: 'desc' }),
  });
  const rows = (data as any)?.data || [];

  const byLine = useMemo(() => {
    const map = new Map<string, { lineId: string; jobs: number; efficiency: number; output: number }>();
    for (const r of rows) {
      const key = r.lineId || 'Unassigned';
      const cur = map.get(key) || { lineId: key, jobs: 0, efficiency: 0, output: 0 };
      cur.jobs += 1;
      cur.efficiency += r.efficiency || 0;
      cur.output += r.completedQty || 0;
      map.set(key, cur);
    }
    return Array.from(map.values()).map((l) => ({
      ...l,
      id: l.lineId,
      avgEfficiency: l.jobs ? Math.round(l.efficiency / l.jobs) : 0,
    }));
  }, [rows]);

  const avgEff = rows.length
    ? Math.round(rows.reduce((s: number, r: any) => s + (r.efficiency || 0), 0) / rows.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 10 · Shop Floor"
        title="Line Output & Efficiency Tracking"
        description="Live production telemetry by sewing line, supervisor, and completion vs target."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Active jobs" value={rows.length} />
        <StatCard label="Avg efficiency" value={`${avgEff}%`} />
        <StatCard label="Lines" value={byLine.length} />
      </div>

      <DataTable
        rows={byLine}
        columns={[
          { key: 'lineId', header: 'Line' },
          { key: 'jobs', header: 'Jobs' },
          {
            key: 'output',
            header: 'Completed pcs',
            render: (r: any) => Number(r.output).toLocaleString(),
          },
          {
            key: 'avgEfficiency',
            header: 'Avg efficiency',
            render: (r: any) => `${r.avgEfficiency}%`,
          },
        ]}
      />

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading line telemetry…</div>
      ) : (
        <DataTable
          rows={rows}
          columns={[
            { key: 'orderNumber', header: 'Order' },
            { key: 'styleNumber', header: 'Style' },
            { key: 'buyer', header: 'Buyer' },
            { key: 'lineId', header: 'Line' },
            { key: 'stage', header: 'Stage' },
            { key: 'supervisor', header: 'Supervisor' },
            {
              key: 'completedQty',
              header: 'Done / Target',
              render: (r: any) =>
                `${Number(r.completedQty || 0).toLocaleString()} / ${Number(r.targetQty || 0).toLocaleString()}`,
            },
            {
              key: 'efficiency',
              header: 'Eff %',
              render: (r: any) => `${r.efficiency}%`,
            },
            { key: 'status', header: 'Status' },
          ]}
        />
      )}
    </div>
  );
}
