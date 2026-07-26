'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { erpApi } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function FinanceModule() {
  const { data, isLoading } = useQuery({
    queryKey: ['finance'],
    queryFn: () => erpApi.finance(),
  });

  const fin: any = data || {};

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Finance · Module 17"
        title="Enterprise Accounting & Cash Flow"
        description="Revenue, receivables, payables, expenses, and order-level profitability."
      />

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading finance summary…</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Revenue collected" value={`$${(fin.revenue || 0).toLocaleString()}`} tone="success" />
            <StatCard label="Receivables" value={`$${(fin.receivables || 0).toLocaleString()}`} tone="warning" />
            <StatCard label="Payables" value={`$${(fin.payables || 0).toLocaleString()}`} />
            <StatCard label="Expenses" value={`$${(fin.expenseTotal || 0).toLocaleString()}`} tone="danger" />
          </div>

          <h3 className="font-semibold text-sm">Order profitability</h3>
          <DataTable
            rows={fin.profitability || []}
            columns={[
              { key: 'orderNumber', header: 'Order' },
              { key: 'buyer', header: 'Buyer' },
              {
                key: 'revenue',
                header: 'Revenue',
                render: (r: any) => `$${Number(r.revenue).toLocaleString()}`,
              },
              {
                key: 'estimatedCost',
                header: 'Cost',
                render: (r: any) => `$${Number(r.estimatedCost).toLocaleString()}`,
              },
              {
                key: 'margin',
                header: 'Margin',
                render: (r: any) => (
                  <span className="text-status-success font-semibold">
                    +${Number(r.margin).toLocaleString()} ({r.marginPct}%)
                  </span>
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
