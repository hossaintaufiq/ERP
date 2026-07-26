'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard, FilterRow } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';
import type { ModuleId } from '@/components/layout/Sidebar';

export default function StyleModule({ setActiveModule }: { setActiveModule?: (m: ModuleId) => void }) {
  const [season, setSeason] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['styles'],
    queryFn: () => resources.list('styles', { limit: 100, sortBy: 'styleNumber', sortDir: 'asc' }),
  });
  const rows = (data as any)?.data || [];
  const seasons = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((s: any) => s.season).filter(Boolean)))],
    [rows],
  );
  const filtered = season === 'ALL' ? rows : rows.filter((s: any) => s.season === season);

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 4 · Merchandising"
        title="Style Catalog & Tech Packs"
        description="Style masters, fabric specs, size runs, colors, and cost/price."
        actions={
          setActiveModule ? (
            <button
              type="button"
              onClick={() => setActiveModule('bom')}
              className="btn-primary text-xs"
            >
              Open BOM Calculator
            </button>
          ) : null
        }
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Styles" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Showing" value={filtered.length} />
        <StatCard
          label="Active"
          value={rows.filter((s: any) => s.status === 'active' || s.status === 'approved').length}
        />
      </div>

      <FilterRow>
        {seasons.map((s: any) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeason(s)}
            className={cn('filter-chip', season === s ? 'filter-chip-active' : 'filter-chip-idle')}
          >
            {s}
          </button>
        ))}
      </FilterRow>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading styles…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'styleNumber', header: 'Style #' },
            { key: 'name', header: 'Name' },
            { key: 'buyer', header: 'Buyer' },
            { key: 'season', header: 'Season' },
            { key: 'fabricSpec', header: 'Fabric' },
            {
              key: 'colors',
              header: 'Colors',
              render: (r: any) => (r.colors || []).join(', '),
            },
            {
              key: 'unitCost',
              header: 'Cost',
              render: (r: any) => `$${r.unitCost}`,
            },
            {
              key: 'sellingPrice',
              header: 'FOB',
              render: (r: any) => `$${r.sellingPrice}`,
            },
            { key: 'status', header: 'Status' },
          ]}
        />
      )}
    </div>
  );
}
