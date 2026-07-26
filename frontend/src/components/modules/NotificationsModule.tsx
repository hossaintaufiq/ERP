'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { resources } from '@/lib/api';
import { DataTable, PageHeader } from '@/components/ui/DataTable';

export default function NotificationsModule() {
  const qc = useQueryClient();
  const [filterType, setFilterType] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => resources.list('notifications', { limit: 80, sortBy: 'createdAt' }),
  });

  const markRead = useMutation({
    mutationFn: async () => {
      const rows = ((data as any)?.data || []).filter((n: any) => !n.read);
      await Promise.all(rows.slice(0, 30).map((n: any) => resources.update('notifications', n.id, { read: true })));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const rows = ((data as any)?.data || []).filter((n: any) =>
    filterType === 'ALL' ? true : n.type === filterType,
  );

  const types = ['ALL', 'stock', 'production', 'shipment', 'payroll', 'qc', 'hr', 'procurement', 'finance'];

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 20 · Alerts"
        title="Notifications Hub"
        description="Factory telemetry: stock, production, shipments, payroll, QC, and workflow events."
        actions={
          <button type="button" className="btn-secondary text-xs" onClick={() => markRead.mutate()}>
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            Mark unread as read
          </button>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === t ? 'bg-brand-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading alerts…</div>
      ) : (
        <DataTable
          rows={rows}
          columns={[
            {
              key: 'title',
              header: 'Alert',
              render: (r: any) => (
                <div>
                  <div className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    {!r.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                    {r.title}
                  </div>
                  <div className="text-stone-500 text-xs mt-0.5">{r.message}</div>
                </div>
              ),
            },
            { key: 'type', header: 'Type' },
            {
              key: 'severity',
              header: 'Severity',
              render: (r: any) => (
                <span
                  className={`badge ${
                    r.severity === 'high' ? 'status-danger' : r.severity === 'medium' ? 'status-warning' : 'status-success'
                  }`}
                >
                  {r.severity}
                </span>
              ),
            },
            {
              key: 'createdAt',
              header: 'When',
              render: (r: any) => new Date(r.createdAt).toLocaleString(),
            },
          ]}
        />
      )}
    </div>
  );
}
