'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Globe, Plus } from 'lucide-react';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function CustomerModule() {
  const { data, isLoading } = useQuery({
    queryKey: ['buyers'],
    queryFn: () => resources.list('buyers', { limit: 100, sortBy: 'name', sortDir: 'asc' }),
  });
  const rows = (data as any)?.data || [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => rows.find((b: any) => b.id === selectedId) || rows[0],
    [rows, selectedId],
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 2 · Commercial"
        title="Global Buyers & Brand Directory"
        description="Buyer accounts, payment terms, credit limits, and compliance certifications."
        actions={
          <button type="button" className="btn-primary flex items-center gap-2 text-xs">
            <Plus className="w-4 h-4" /> Add Buyer
          </button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Buyers" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard
          label="Active"
          value={rows.filter((b: any) => b.status === 'active').length}
        />
        <StatCard
          label="Credit exposure"
          value={`$${Math.round(rows.reduce((s: number, b: any) => s + (b.creditLimit || 0), 0) / 1e6)}M`}
        />
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading buyers…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rows.slice(0, 8).map((b: any) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedId(b.id)}
                className={`panel p-4 text-left transition-all border-2 ${
                  selected?.id === b.id
                    ? 'border-brand-600 shadow-md'
                    : 'border-transparent hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="text-[10px] font-bold text-stone-400 uppercase">{b.code}</div>
                <div className="font-bold text-sm truncate">{b.name}</div>
                <div className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                  <Globe className="w-3 h-3" /> {b.country}
                </div>
                <div className="mt-3 text-xs flex justify-between">
                  <span className="text-stone-400">Credit</span>
                  <span className="font-semibold">${Number(b.creditLimit || 0).toLocaleString()}</span>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="panel p-5 space-y-3">
              <h3 className="font-bold text-sm">{selected.name}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-stone-400">Contact</div>
                  <div className="font-semibold">{selected.contactPerson || '—'}</div>
                </div>
                <div>
                  <div className="text-stone-400">Email</div>
                  <div className="font-semibold">{selected.email || '—'}</div>
                </div>
                <div>
                  <div className="text-stone-400">Payment terms</div>
                  <div className="font-semibold">{selected.paymentTerms || '—'}</div>
                </div>
                <div>
                  <div className="text-stone-400">Compliance</div>
                  <div className="font-semibold">{(selected.compliance || []).join(', ') || '—'}</div>
                </div>
              </div>
            </div>
          )}

          <DataTable
            rows={rows}
            onRowClick={(r: any) => setSelectedId(r.id)}
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'name', header: 'Buyer' },
              { key: 'country', header: 'Country' },
              { key: 'paymentTerms', header: 'Terms' },
              {
                key: 'creditLimit',
                header: 'Credit Limit',
                render: (r: any) => `$${Number(r.creditLimit || 0).toLocaleString()}`,
              },
              { key: 'status', header: 'Status' },
            ]}
          />
        </>
      )}
    </div>
  );
}
