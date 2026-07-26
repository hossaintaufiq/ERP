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

  const statusMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      const s = r.status || 'OK';
      map.set(s, (map.get(s) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const valueByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      const c = r.category || 'Other';
      const val = (r.currentStock || 0) * (r.unitCost || 0);
      map.set(c, (map.get(c) || 0) + val);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [rows]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 6 · Inventory"
        title="Raw Material & Accessories Stock"
        description="Warehouse stock levels, reorder alerts, and unit valuation."
      />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard label="SKUs" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Low / critical" value={lowStock} />
        <StatCard label="Showing" value={filtered.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard title="Stock status" description="OK vs low vs critical">
          <SharePieChart data={statusMix} height={200} />
        </ChartCard>
        <ChartCard
          className="lg:col-span-2"
          title="Inventory value by category"
          description="Stock × unit cost — where capital is tied"
        >
          <CategoryBarChart
            data={valueByCategory}
            xKey="name"
            yKey="value"
            height={200}
            color={CHART_COLORS.warning}
          />
        </ChartCard>
      </div>

      <FilterRow>
        {categories.map((c: any) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn('filter-chip', category === c ? 'filter-chip-active' : 'filter-chip-idle')}
          >
            {c}
          </button>
        ))}
      </FilterRow>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading inventory…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'code', header: 'SKU' },
            { key: 'name', header: 'Item' },
            { key: 'category', header: 'Category', hideOnMobile: true },
            { key: 'warehouse', header: 'Warehouse', hideOnMobile: true },
            {
              key: 'currentStock',
              header: 'Stock',
              render: (r: any) => `${Number(r.currentStock || 0).toLocaleString()} ${r.unit || ''}`,
            },
            {
              key: 'minAlertLevel',
              header: 'Min',
              hideOnMobile: true,
              render: (r: any) => Number(r.minAlertLevel || 0).toLocaleString(),
            },
            { key: 'status', header: 'Status' },
            {
              key: 'unitCost',
              header: 'Unit cost',
              hideOnMobile: true,
              render: (r: any) => `$${Number(r.unitCost || 0).toFixed(2)}`,
            },
          ]}
        />
      )}
    </div>
  );
}
