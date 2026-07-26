'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function SupplierModule() {
  const { data, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => resources.list('suppliers', { limit: 100, sortBy: 'name' }),
  });
  const rows = (data as any)?.data || [];
  const ap = rows.reduce((s: number, r: any) => s + (r.apBalance || 0), 0);

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 8 · Procurement"
        title="Fabric & Trims Supplier Directory"
        description="Vendor lead times, quality ratings, materials, and AP balances."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Suppliers" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="AP balance" value={`$${ap.toLocaleString()}`} />
        <StatCard
          label="Avg rating"
          value={
            rows.length
              ? (rows.reduce((s: number, r: any) => s + (r.rating || 0), 0) / rows.length).toFixed(1)
              : '—'
          }
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {rows.slice(0, 6).map((sup: any) => (
          <div key={sup.id} className="panel p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-sm">{sup.name}</div>
                <div className="text-xs text-stone-500">
                  {sup.code} · {sup.country}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {Number(sup.rating || 0).toFixed(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(sup.materials || []).map((m: string) => (
                <span key={m} className="badge text-[10px]">
                  {m}
                </span>
              ))}
            </div>
            <div className="text-xs flex justify-between pt-2 border-t border-stone-200/60 dark:border-stone-800">
              <span>Lead {sup.leadTimeDays}d</span>
              <span className="font-semibold text-rose-600">${Number(sup.apBalance || 0).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading suppliers…</div>
      ) : (
        <DataTable
          rows={rows}
          columns={[
            { key: 'code', header: 'Code' },
            { key: 'name', header: 'Supplier' },
            { key: 'country', header: 'Country' },
            {
              key: 'materials',
              header: 'Materials',
              render: (r: any) => (r.materials || []).join(', '),
            },
            { key: 'leadTimeDays', header: 'Lead (days)' },
            {
              key: 'rating',
              header: 'Rating',
              render: (r: any) => Number(r.rating || 0).toFixed(1),
            },
            {
              key: 'apBalance',
              header: 'AP Balance',
              render: (r: any) => `$${Number(r.apBalance || 0).toLocaleString()}`,
            },
            { key: 'status', header: 'Status' },
          ]}
        />
      )}
    </div>
  );
}
