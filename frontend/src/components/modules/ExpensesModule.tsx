'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard, FilterRow } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';
import { ChartCard, CategoryBarChart, SharePieChart, CHART_COLORS } from '@/components/ui/Charts';

export default function ExpensesModule() {
  const [category, setCategory] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => resources.list('expenses', { limit: 100, sortBy: 'date', sortDir: 'desc' }),
  });
  const rows = (data as any)?.data || [];
  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((e: any) => e.category).filter(Boolean)))],
    [rows],
  );
  const filtered = category === 'ALL' ? rows : rows.filter((e: any) => e.category === category);
  const total = filtered.reduce((s: number, e: any) => s + (e.amount || 0), 0);
  const pending = rows.filter((e: any) => e.status === 'Pending' || e.status === 'Submitted').length;

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      map.set(r.category || 'Other', (map.get(r.category || 'Other') || 0) + (r.amount || 0));
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [rows]);

  const statusMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) map.set(r.status || 'Other', (map.get(r.status || 'Other') || 0) + 1);
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Finance · Operating Costs"
        title="Expense Ledger"
        description="Factory opex by category — utilities, maintenance, consumables, and approvals."
      />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard label="Entries" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Filtered total" value={`$${Math.round(total).toLocaleString()}`} />
        <StatCard label="Pending approval" value={pending} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard title="By status" description="Approval pipeline">
          <SharePieChart data={statusMix} height={200} />
        </ChartCard>
        <ChartCard className="lg:col-span-2" title="Spend by category" description="Where cash goes">
          <CategoryBarChart
            data={byCategory.slice(0, 8)}
            xKey="name"
            yKey="value"
            height={200}
            color={CHART_COLORS.danger}
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
        <div className="panel p-8 text-center text-sm text-stone-500">Loading expenses…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'date', header: 'Date' },
            { key: 'category', header: 'Category' },
            { key: 'description', header: 'Description', hideOnMobile: true },
            {
              key: 'amount',
              header: 'Amount',
              render: (r: any) => `$${Number(r.amount || 0).toLocaleString()}`,
            },
            { key: 'status', header: 'Status' },
          ]}
        />
      )}
    </div>
  );
}
