'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function InventoryModule() {
  const [category, setCategory] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => resources.list('inventory', { limit: 100, sortBy: 'name' }),
  });
  const rows = (data as any)?.data || [];
  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((i: any) => i.category).filter(Boolean)))],
    [rows],
  );
  const filtered = category === 'ALL' ? rows : rows.filter((i: any) => i.category === category);
  const lowStock = rows.filter(
    (i: any) => i.status === 'Low Stock' || i.status === 'Critical' || i.currentStock <= i.minAlertLevel,
  ).length;

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 6 · Inventory"
        title="Raw Material & Accessories Stock"
        description="Warehouse stock levels, reorder alerts, and unit valuation."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="SKUs" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Low / critical" value={lowStock} />
        <StatCard label="Showing" value={filtered.length} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((c: any) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              category === c ? 'bg-brand-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading inventory…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'code', header: 'SKU' },
            { key: 'name', header: 'Item' },
            { key: 'category', header: 'Category' },
            { key: 'warehouse', header: 'Warehouse' },
            {
              key: 'currentStock',
              header: 'Stock',
              render: (r: any) => `${Number(r.currentStock || 0).toLocaleString()} ${r.unit || ''}`,
            },
            {
              key: 'minAlertLevel',
              header: 'Min',
              render: (r: any) => Number(r.minAlertLevel || 0).toLocaleString(),
            },
            { key: 'status', header: 'Status' },
            {
              key: 'unitCost',
              header: 'Unit cost',
              render: (r: any) => `$${Number(r.unitCost || 0).toFixed(2)}`,
            },
          ]}
        />
      )}
    </div>
  );
}
