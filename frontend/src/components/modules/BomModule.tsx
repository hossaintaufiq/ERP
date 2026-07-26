'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function BomModule() {
  const { data, isLoading } = useQuery({
    queryKey: ['styles-bom'],
    queryFn: () => resources.list('styles', { limit: 100, sortBy: 'styleNumber' }),
  });
  const styles = (data as any)?.data || [];
  const [styleId, setStyleId] = useState<string>('');
  const [orderQty, setOrderQty] = useState(5000);

  const selected = useMemo(
    () => styles.find((s: any) => s.id === styleId) || styles[0],
    [styles, styleId],
  );

  const bomRows = useMemo(() => {
    if (!selected?.bomRatio) return [];
    const ratio = selected.bomRatio;
    return Object.entries(ratio).map(([component, perPc]) => {
      const qty = Number(perPc) * orderQty;
      const unitCost =
        component.includes('fabric') ? 2.4 : component.includes('button') ? 0.08 : component.includes('thread') ? 1.2 : 0.15;
      return {
        id: component,
        component,
        perPc: Number(perPc),
        required: qty,
        unitCost,
        totalCost: qty * unitCost,
      };
    });
  }, [selected, orderQty]);

  const materialCost = bomRows.reduce((s, r) => s + r.totalCost, 0);

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 5 · Engineering"
        title="BOM Calculator"
        description="Explode style material ratios into order-qty requirements and estimated cost."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Styles with BOM" value={styles.filter((s: any) => s.bomRatio).length} />
        <StatCard label="Order qty" value={orderQty.toLocaleString()} />
        <StatCard label="Material cost" value={`$${materialCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
      </div>

      <div className="panel p-4 grid sm:grid-cols-2 gap-4">
        <label className="text-xs space-y-1">
          <span className="text-stone-500 font-semibold">Style</span>
          <select
            className="w-full rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm"
            value={selected?.id || ''}
            onChange={(e) => setStyleId(e.target.value)}
          >
            {styles.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.styleNumber} — {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs space-y-1">
          <span className="text-stone-500 font-semibold">Order quantity (pcs)</span>
          <input
            type="number"
            min={100}
            step={100}
            value={orderQty}
            onChange={(e) => setOrderQty(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading BOM…</div>
      ) : (
        <DataTable
          rows={bomRows}
          columns={[
            { key: 'component', header: 'Component' },
            { key: 'perPc', header: 'Per pc' },
            {
              key: 'required',
              header: 'Required',
              render: (r: any) => Number(r.required).toLocaleString(undefined, { maximumFractionDigits: 1 }),
            },
            {
              key: 'unitCost',
              header: 'Unit cost',
              render: (r: any) => `$${r.unitCost.toFixed(2)}`,
            },
            {
              key: 'totalCost',
              header: 'Total',
              render: (r: any) => `$${r.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            },
          ]}
        />
      )}
    </div>
  );
}
