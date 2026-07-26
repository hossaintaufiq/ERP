'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { erpApi } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartCard,
  CategoryBarChart,
  SharePieChart,
  CHART_COLORS,
} from '@/components/ui/Charts';

export default function FinanceModule() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['finance'],
    queryFn: () => erpApi.finance(),
  });

  const fin: any = data || {};
  const cashPosition = fin.cashPosition || [];
  const expenseByCategory = fin.expenseByCategory || [];
  const topMargins = fin.topMargins || [];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Finance · Module 17"
        title="Enterprise Accounting & Cash Flow"
        description="Cash position, expense mix, and order-level profitability."
      />

      {isError ? (
        <div className="panel p-8 text-center text-sm text-status-danger">Failed to load finance summary.</div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <StatCard label="Revenue collected" value={`$${(fin.revenue || 0).toLocaleString()}`} tone="success" />
            <StatCard label="Receivables" value={`$${(fin.receivables || 0).toLocaleString()}`} tone="warning" />
            <StatCard label="Payables" value={`$${(fin.payables || 0).toLocaleString()}`} />
            <StatCard label="Expenses" value={`$${(fin.expenseTotal || 0).toLocaleString()}`} tone="danger" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <ChartCard
              className="lg:col-span-2"
              title="Cash position"
              description="Collected vs AR / AP / opex — working capital view"
            >
              <CategoryBarChart
                data={cashPosition}
                xKey="name"
                yKey="value"
                height={220}
                color={CHART_COLORS.primary}
              />
            </ChartCard>

            <ChartCard title="Expense mix" description="By category">
              <SharePieChart data={expenseByCategory} height={220} />
            </ChartCard>
          </div>

          <ChartCard title="Top order margins" description="Contribution by order (est.)">
            <CategoryBarChart
              data={topMargins}
              xKey="order"
              yKey="margin"
              height={200}
              horizontal
              color={CHART_COLORS.success}
            />
          </ChartCard>

          <h3 className="font-semibold text-sm">Order profitability</h3>
          <DataTable
            rows={fin.profitability || []}
            columns={[
              { key: 'orderNumber', header: 'Order' },
              { key: 'buyer', header: 'Buyer', hideOnMobile: true },
              {
                key: 'revenue',
                header: 'Revenue',
                render: (r: any) => `$${Number(r.revenue).toLocaleString()}`,
              },
              {
                key: 'estimatedCost',
                header: 'Cost',
                hideOnMobile: true,
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
