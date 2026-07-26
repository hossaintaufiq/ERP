'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Sparkles } from 'lucide-react';
import { erpApi, resources } from '@/lib/api';
import { DataTable, PageHeader } from '@/components/ui/DataTable';

export default function PurchaseModule() {
  const qc = useQueryClient();
  const [prMaterial, setPrMaterial] = useState('Combed Cotton Pique');
  const [prQuantity, setPrQuantity] = useState(10000);
  const [prSupplier, setPrSupplier] = useState('Apex Textile Mills Ltd');
  const [msg, setMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: () => resources.list('purchase-orders', { limit: 40, sortBy: 'issueDate' }),
  });

  const createPr = useMutation({
    mutationFn: () =>
      resources.create('purchase-orders', {
        poNumber: `PO-2026-${Math.floor(800 + Math.random() * 200)}`,
        prNumber: `PR-${Math.floor(900 + Math.random() * 100)}`,
        supplier: prSupplier,
        materials: [{ name: prMaterial, qty: prQuantity, unit: 'Pcs', price: 0.09 }],
        totalCost: prQuantity * 0.09,
        issueDate: new Date().toISOString().slice(0, 10),
        expectedDelivery: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        status: 'PR Approved',
        companyId: 'co-1',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
      setMsg('Purchase request created');
    },
    onError: () => setMsg('Create failed — check API connection'),
  });

  const advance = useMutation({
    mutationFn: (id: string) => erpApi.advancePo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      setMsg('PO advanced — inventory/notifications/audit updated');
    },
    onError: (e: any) => setMsg(e?.response?.data?.error?.message || 'Advance failed'),
  });

  const rows = (data as any)?.data || [];

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 7 · Procurement"
        title="Purchase Management"
        description="PR → PO → GRN → stock update → payment. Advancing a PO runs the full ERP workflow."
      />

      <div className="glass-panel p-5 space-y-3">
        <div className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Procurement lifecycle
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
          {['Create PR', 'Issue PO', 'Receive', 'Update Stock', 'Payment'].map((s, i) => (
            <div key={s} className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <div className="font-mono text-brand-600 text-[10px]">STAGE {i + 1}</div>
              <div className="font-semibold text-stone-800 dark:text-stone-100">{s}</div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPr.mutate();
        }}
        className="panel p-5 grid md:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label className="text-xs font-semibold text-stone-500">Material</label>
          <input className="input-field mt-1" value={prMaterial} onChange={(e) => setPrMaterial(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone-500">Quantity</label>
          <input
            type="number"
            className="input-field mt-1"
            value={prQuantity}
            onChange={(e) => setPrQuantity(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone-500">Supplier</label>
          <input className="input-field mt-1" value={prSupplier} onChange={(e) => setPrSupplier(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary" disabled={createPr.isPending}>
          <Plus className="w-4 h-4" />
          {createPr.isPending ? 'Creating…' : 'Create PR'}
        </button>
      </form>

      {msg && <p className="text-xs text-brand-700 dark:text-brand-400">{msg}</p>}

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading purchase orders…</div>
      ) : (
        <DataTable
          rows={rows}
          columns={[
            { key: 'poNumber', header: 'PO #' },
            { key: 'supplier', header: 'Supplier' },
            {
              key: 'totalCost',
              header: 'Total',
              render: (r: any) => `$${Number(r.totalCost || 0).toLocaleString()}`,
            },
            { key: 'status', header: 'Status' },
            { key: 'expectedDelivery', header: 'ETA' },
            {
              key: 'actions',
              header: '',
              render: (r: any) =>
                r.status !== 'Closed' ? (
                  <button
                    type="button"
                    className="text-xs font-semibold text-accent"
                    onClick={() => advance.mutate(r.id)}
                  >
                    Advance →
                  </button>
                ) : (
                  '—'
                ),
            },
          ]}
        />
      )}
    </div>
  );
}
