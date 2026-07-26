'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

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

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 14 · Quality"
        title="QC Inspection Gates"
        description="Cutting → Sewing → Finishing → Final AQL audits with defect logging."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Inspections" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Pass rate" value={`${passRate}%`} />
        <StatCard label="Defect pcs" value={defects.toLocaleString()} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {GATES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGate(g)}
            className={`panel p-3 text-left border-2 ${
              gate === g ? 'border-brand-600' : 'border-transparent'
            }`}
          >
            <div className="text-[10px] font-bold uppercase text-stone-400">{g === 'ALL' ? 'All gates' : `Gate`}</div>
            <div className="font-bold text-sm">{g}</div>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading QC…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'orderNumber', header: 'Order' },
            { key: 'gate', header: 'Gate' },
            { key: 'inspector', header: 'Inspector' },
            {
              key: 'inspectedQty',
              header: 'Inspected',
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
              render: (r: any) => (r.defectTypes || []).join(', '),
            },
            { key: 'aql', header: 'AQL' },
            { key: 'result', header: 'Result' },
            { key: 'date', header: 'Date' },
          ]}
        />
      )}
    </div>
  );
}
