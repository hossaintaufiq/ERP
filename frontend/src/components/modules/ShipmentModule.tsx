'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { erpApi, resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function ShipmentModule() {
  const [status, setStatus] = useState('ALL');
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['shipments'],
    queryFn: () => resources.list('shipments', { limit: 100, sortBy: 'etd', sortDir: 'desc' }),
  });
  const rows = (data as any)?.data || [];
  const statuses = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((s: any) => s.status).filter(Boolean)))],
    [rows],
  );
  const filtered = status === 'ALL' ? rows : rows.filter((s: any) => s.status === status);

  const invoice = useMutation({
    mutationFn: (id: string) => erpApi.invoiceShipment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipments'] });
      qc.invalidateQueries({ queryKey: ['finance'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 16 · Logistics"
        title="Shipments & Export Docs"
        description="Containers, ports, ETD/ETA, and invoice generation from delivered shipments."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Shipments" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard
          label="In transit"
          value={rows.filter((s: any) => String(s.status).includes('Transit') || s.status === 'Shipped').length}
        />
        <StatCard label="Showing" value={filtered.length} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {statuses.map((s: any) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              status === s ? 'bg-brand-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading shipments…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'shipmentNumber', header: 'Shipment' },
            { key: 'orderNumber', header: 'Order' },
            { key: 'buyer', header: 'Buyer' },
            { key: 'containerNo', header: 'Container' },
            { key: 'port', header: 'Port' },
            { key: 'etd', header: 'ETD' },
            { key: 'eta', header: 'ETA' },
            { key: 'status', header: 'Status' },
            {
              key: 'actions',
              header: 'Actions',
              render: (r: any) => (
                <button
                  type="button"
                  disabled={invoice.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    invoice.mutate(r.id);
                  }}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  Invoice
                </button>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
