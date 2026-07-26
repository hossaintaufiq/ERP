'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function WarehouseModule() {
  const warehouses = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => resources.list('warehouses', { limit: 50 }),
  });
  const transfers = useQuery({
    queryKey: ['stock-transfers'],
    queryFn: () => resources.list('stock-transfers', { limit: 50 }),
  });

  const wh = (warehouses.data as any)?.data || [];
  const st = (transfers.data as any)?.data || [];

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Supply Chain · WMS"
        title="Warehouses & Stock Transfers"
        description="Multi-warehouse capacity, utilization, and internal stock movements."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        {wh.map((w: any) => (
          <StatCard
            key={w.id}
            label={w.name}
            value={`${Math.round((w.utilized / w.capacity) * 100)}%`}
            hint={`${w.utilized.toLocaleString()} / ${w.capacity.toLocaleString()} capacity · ${w.code}`}
          />
        ))}
      </div>

      <DataTable
        rows={st}
        columns={[
          { key: 'transferNumber', header: 'Transfer #' },
          { key: 'fromWarehouseId', header: 'From' },
          { key: 'toWarehouseId', header: 'To' },
          { key: 'qty', header: 'Qty' },
          {
            key: 'status',
            header: 'Status',
            render: (r: any) => <span className="badge status-success">{r.status}</span>,
          },
        ]}
      />
    </div>
  );
}
