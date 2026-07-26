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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SalesModule() {
  const [status, setStatus] = useState('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
  const selected = rows.find((o: any) => o.id === selectedId) || filtered[0];

  const statusMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      map.set(r.status || 'Other', (map.get(r.status || 'Other') || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const valueByBuyer = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      const b = r.buyer || 'Unknown';
      map.set(b, (map.get(b) || 0) + (r.totalValue || 0));
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({
        name: name.length > 14 ? `${name.slice(0, 12)}…` : name,
        value: Math.round(value),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [rows]);

  const sizeRows = useMemo(() => {
    const bd = selected?.sizeBreakdown || {};
    return Object.entries(bd).map(([size, qty]) => ({
      id: size,
      size,
      qty: Number(qty) || 0,
    }));
  }, [selected]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 3 · Sales"
        title="Sales Orders & Buyer POs"
        description="Order book with size ratio (assortment), delivery dates, and commercial value."
      />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard label="Orders" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Showing" value={filtered.length} />
        <StatCard label="Book value" value={`$${Math.round(revenue / 1000).toLocaleString()}k`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard title="Order pipeline" description="Status mix">
          <SharePieChart data={statusMix} height={200} />
        </ChartCard>
        <ChartCard
          className="lg:col-span-2"
          title="Book value by buyer"
          description="Top buyers by order value"
        >
          <CategoryBarChart
            data={valueByBuyer}
            xKey="name"
            yKey="value"
            height={200}
            color={CHART_COLORS.primary}
          />
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4">
        <div className="xl:col-span-2 min-w-0">
          {isLoading ? (
            <div className="panel p-8 text-center text-sm text-stone-500">Loading orders…</div>
          ) : (
            <DataTable
              rows={filtered}
              onRowClick={(r: any) => setSelectedId(r.id)}
              columns={[
                { key: 'orderNumber', header: 'SO #' },
                { key: 'buyer', header: 'Buyer' },
                { key: 'styleNumber', header: 'Style', hideOnMobile: true },
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
                { key: 'stage', header: 'Stage', hideOnMobile: true },
                { key: 'status', header: 'Status' },
                { key: 'deliveryDate', header: 'Delivery', hideOnMobile: true },
              ]}
            />
          )}
        </div>

        <Card className="shadow-none min-w-0">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Size ratio (assortment)</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {selected
                ? `${selected.orderNumber} · ${selected.styleNumber || selected.styleName || ''}`
                : 'Select an order'}
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            {sizeRows.length ? (
              <>
                <CategoryBarChart
                  data={sizeRows}
                  xKey="size"
                  yKey="qty"
                  height={160}
                  color={CHART_COLORS.primarySoft}
                />
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {sizeRows.map((s) => (
                    <div
                      key={s.size}
                      className="rounded-lg border border-border bg-muted/40 px-2 py-1.5 text-center"
                    >
                      <div className="font-semibold">{s.size}</div>
                      <div className="tabular-nums text-muted-foreground">
                        {s.qty.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground py-8 text-center">
                No size breakdown on this order.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
