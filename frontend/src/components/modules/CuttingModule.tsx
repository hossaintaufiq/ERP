'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';
import { ChartCard, CategoryBarChart, CHART_COLORS } from '@/components/ui/Charts';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Cutting / fabric issue — core garments ERP screen.
 * Explodes active cutting jobs against style BOM ratios and compares to inventory.
 */
export default function CuttingModule() {
  const [jobId, setJobId] = useState('');

  const prodQ = useQuery({
    queryKey: ['cutting-production'],
    queryFn: () => resources.list('production', { limit: 100 }),
  });
  const stylesQ = useQuery({
    queryKey: ['cutting-styles'],
    queryFn: () => resources.list('styles', { limit: 100 }),
  });
  const invQ = useQuery({
    queryKey: ['cutting-inventory'],
    queryFn: () => resources.list('inventory', { limit: 100 }),
  });

  const jobs = useMemo(() => {
    const all = (prodQ.data as any)?.data || [];
    return all.filter((p: any) => {
      const stage = String(p.stage || '').toLowerCase();
      return stage.includes('cut') || stage === 'cutting' || p.status === 'In Progress';
    });
  }, [prodQ.data]);

  const styles = (stylesQ.data as any)?.data || [];
  const inventory = (invQ.data as any)?.data || [];

  const selected = useMemo(
    () => jobs.find((j: any) => j.id === jobId) || jobs[0],
    [jobs, jobId],
  );

  const style = useMemo(() => {
    if (!selected) return null;
    return (
      styles.find((s: any) => s.styleNumber === selected.styleNumber || s.id === selected.styleId) ||
      styles[0]
    );
  }, [selected, styles]);

  const issueRows = useMemo(() => {
    if (!selected || !style?.bomRatio) return [];
    const target = selected.targetQty || selected.completedQty || 1000;
    return Object.entries(style.bomRatio).map(([component, perPc]) => {
      const required = Number(perPc) * target;
      const stockItem = inventory.find((i: any) =>
        String(i.name || '')
          .toLowerCase()
          .includes(String(component).split('_')[0].toLowerCase()),
      );
      const available = stockItem?.currentStock ?? 0;
      const shortfall = Math.max(0, required - available);
      return {
        id: component,
        component,
        perPc: Number(perPc),
        required: Math.round(required * 100) / 100,
        available: Math.round(available * 100) / 100,
        shortfall: Math.round(shortfall * 100) / 100,
        unit: stockItem?.unit || 'yd',
        sku: stockItem?.code || '—',
        status: shortfall > 0 ? 'Short' : 'OK',
      };
    });
  }, [selected, style, inventory]);

  const shortCount = issueRows.filter((r) => r.status === 'Short').length;
  const chartData = issueRows.map((r) => ({
    name: r.component.length > 12 ? `${r.component.slice(0, 10)}…` : r.component,
    required: r.required,
    available: r.available,
  }));

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Shop Floor · Cutting"
        title="Cutting Plan & Fabric Issue"
        description="Match cutting jobs to BOM fabric requirements and available warehouse stock before lay."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard label="Cutting jobs" value={jobs.length} />
        <StatCard label="Selected target" value={(selected?.targetQty || 0).toLocaleString()} />
        <StatCard label="BOM lines" value={issueRows.length} />
        <StatCard label="Short materials" value={shortCount} tone={shortCount ? 'danger' : 'success'} />
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
          <label className="space-y-1.5 text-xs font-semibold">
            <span className="text-muted-foreground uppercase tracking-wider">Production job</span>
            <select
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-normal"
              value={selected?.id || ''}
              onChange={(e) => setJobId(e.target.value)}
            >
              {jobs.map((j: any) => (
                <option key={j.id} value={j.id}>
                  {j.orderNumber} · {j.styleNumber} · {j.stage} · Line {j.lineId}
                </option>
              ))}
              {!jobs.length && <option value="">No cutting jobs</option>}
            </select>
          </label>
          <div className="space-y-1 text-xs">
            <div className="text-muted-foreground uppercase tracking-wider font-semibold">Style</div>
            <div className="text-sm font-semibold pt-2">
              {style?.styleNumber || '—'} · {style?.name || selected?.styleName || '—'}
            </div>
            <div className="text-muted-foreground">
              Buyer {selected?.buyer || '—'} · Eff {selected?.efficiency ?? '—'}%
            </div>
          </div>
        </CardContent>
      </Card>

      {!!issueRows.length && (
        <ChartCard title="Required vs available" description="Fabric / trim check before issue">
          <CategoryBarChart
            data={chartData}
            xKey="name"
            yKey="required"
            height={200}
            color={CHART_COLORS.primary}
          />
        </ChartCard>
      )}

      <DataTable
        loading={prodQ.isLoading || stylesQ.isLoading || invQ.isLoading}
        rows={issueRows}
        empty="Select a job with a style BOM to build the fabric issue list."
        columns={[
          { key: 'component', header: 'Component' },
          { key: 'sku', header: 'Matched SKU', hideOnMobile: true },
          { key: 'perPc', header: 'Per pc' },
          {
            key: 'required',
            header: 'Required',
            render: (r: any) => `${r.required} ${r.unit}`,
          },
          {
            key: 'available',
            header: 'In stock',
            render: (r: any) => `${r.available} ${r.unit}`,
          },
          {
            key: 'shortfall',
            header: 'Shortfall',
            render: (r: any) =>
              r.shortfall > 0 ? (
                <span className="text-status-danger font-semibold">
                  {r.shortfall} {r.unit}
                </span>
              ) : (
                '—'
              ),
          },
          { key: 'status', header: 'Status' },
        ]}
      />
    </div>
  );
}
