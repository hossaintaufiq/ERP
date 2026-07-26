'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard, FilterRow } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SalesModule() {
  const [status, setStatus] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => resources.list('orders', { limit: 100, sortBy: 'orderDate', sortDir: 'desc' }),
  });
  const rows = (data as any)?.data || [];
  const statuses = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((o: any) => o.status).filter(Boolean)))],
    [rows],
  );
  const filtered = status === 'ALL' ? rows : rows.filter((o: any) => o.status === status);
  const revenue = filtered.reduce((s: number, o: any) => s + (o.totalValue || 0), 0);

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 3 · Sales"
        title="Sales Orders & Buyer POs"
        description="Order book, delivery dates, stage progress, and commercial value."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Orders" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Showing" value={filtered.length} />
        <StatCard label="Book value" value={`$${Math.round(revenue / 1000).toLocaleString()}k`} />
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
        <div className="panel p-8 text-center text-sm text-stone-500">Loading orders…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'orderNumber', header: 'SO #' },
            { key: 'buyer', header: 'Buyer' },
            { key: 'styleNumber', header: 'Style' },
            {
              key: 'quantity',
              header: 'Qty',
              render: (r: any) => Number(r.quantity || 0).toLocaleString(),
            },
            {
              key: 'totalValue',
              header: 'Value (USD)',
              render: (r: any) => `$${Number(r.totalValue || 0).toLocaleString()}`,
            },
            { key: 'stage', header: 'Stage' },
            { key: 'status', header: 'Status' },
            { key: 'deliveryDate', header: 'Delivery' },
          ]}
        />
      )}
    </div>
  );
}
