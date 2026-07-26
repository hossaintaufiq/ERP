'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard, FilterRow } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChartCard, CategoryBarChart, SharePieChart, CHART_COLORS } from '@/components/ui/Charts';

function daysUntil(due?: string) {
  if (!due) return 0;
  const d = Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);
  return d;
}

function agingBucket(inv: any) {
  const balance = Math.max(0, (inv.amount || 0) - (inv.paidAmount || 0));
  if (balance <= 0) return 'Paid';
  const d = daysUntil(inv.dueDate);
  if (d >= 0) return 'Current';
  if (d >= -30) return '1–30 overdue';
  if (d >= -60) return '31–60 overdue';
  return '60+ overdue';
}

export default function InvoicesModule() {
  const [status, setStatus] = useState('ALL');
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => resources.list('invoices', { limit: 100, sortBy: 'dueDate', sortDir: 'asc' }),
  });
  const rows = (data as any)?.data || [];
  const statuses = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((i: any) => i.status).filter(Boolean)))],
    [rows],
  );
  const filtered = status === 'ALL' ? rows : rows.filter((i: any) => i.status === status);

  const openAr = rows.reduce((s: number, i: any) => s + Math.max(0, (i.amount || 0) - (i.paidAmount || 0)), 0);
  const collected = rows.reduce((s: number, i: any) => s + (i.paidAmount || 0), 0);
  const overdue = rows.filter((i: any) => {
    const bal = (i.amount || 0) - (i.paidAmount || 0);
    return bal > 0 && daysUntil(i.dueDate) < 0;
  }).length;

  const statusMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) map.set(r.status || 'Other', (map.get(r.status || 'Other') || 0) + 1);
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const aging = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      const b = agingBucket(r);
      const bal = Math.max(0, (r.amount || 0) - (r.paidAmount || 0));
      map.set(b, (map.get(b) || 0) + bal);
    }
    const order = ['Current', '1–30 overdue', '31–60 overdue', '60+ overdue', 'Paid'];
    return order
      .filter((k) => map.has(k))
      .map((name) => ({ name, value: Math.round(map.get(name) || 0) }));
  }, [rows]);

  const recordPayment = useMutation({
    mutationFn: async (inv: any) => {
      const balance = Math.max(0, (inv.amount || 0) - (inv.paidAmount || 0));
      if (balance <= 0) return inv;
      const pay = Math.min(balance, Math.round(balance * 0.5) || balance);
      const paidAmount = (inv.paidAmount || 0) + pay;
      const nextStatus =
        paidAmount >= inv.amount ? 'Paid' : paidAmount > 0 ? 'Partially Paid' : inv.status;
      return resources.update('invoices', inv.id, { paidAmount, status: nextStatus });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Finance · Accounts Receivable"
        title="Invoices & Collections"
        description="Buyer invoices, open AR, aging buckets, and payment recording."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard label="Invoices" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Open AR" value={`$${Math.round(openAr).toLocaleString()}`} tone="warning" />
        <StatCard label="Collected" value={`$${Math.round(collected).toLocaleString()}`} tone="success" />
        <StatCard label="Overdue" value={overdue} tone="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard title="Invoice status" description="Pipeline">
          <SharePieChart data={statusMix} height={200} />
        </ChartCard>
        <ChartCard className="lg:col-span-2" title="AR aging" description="Open balance by bucket">
          <CategoryBarChart data={aging} xKey="name" yKey="value" height={200} color={CHART_COLORS.warning} />
        </ChartCard>
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
        <div className="panel p-8 text-center text-sm text-stone-500">Loading invoices…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'invoiceNumber', header: 'Invoice #' },
            { key: 'buyer', header: 'Buyer' },
            {
              key: 'amount',
              header: 'Amount',
              render: (r: any) => `$${Number(r.amount || 0).toLocaleString()}`,
            },
            {
              key: 'paidAmount',
              header: 'Paid',
              hideOnMobile: true,
              render: (r: any) => `$${Number(r.paidAmount || 0).toLocaleString()}`,
            },
            {
              key: 'balance',
              header: 'Balance',
              render: (r: any) => {
                const bal = Math.max(0, (r.amount || 0) - (r.paidAmount || 0));
                return `$${bal.toLocaleString()}`;
              },
            },
            { key: 'dueDate', header: 'Due', hideOnMobile: true },
            {
              key: 'aging',
              header: 'Aging',
              hideOnMobile: true,
              render: (r: any) => agingBucket(r),
            },
            { key: 'status', header: 'Status' },
            {
              key: 'actions',
              header: '',
              render: (r: any) => {
                const bal = Math.max(0, (r.amount || 0) - (r.paidAmount || 0));
                if (bal <= 0) return <span className="text-xs text-muted-foreground">Settled</span>;
                return (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    disabled={recordPayment.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      recordPayment.mutate(r);
                    }}
                  >
                    Record payment
                  </Button>
                );
              },
            },
          ]}
        />
      )}
    </div>
  );
}
