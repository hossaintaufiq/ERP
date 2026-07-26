'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Sparkles } from 'lucide-react';
import { erpApi, resources } from '@/lib/api';
import { DataTable, PageHeader } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Procurement lifecycle
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
            {['Create PR', 'Issue PO', 'Receive', 'Update Stock', 'Payment'].map((s, i) => (
              <div key={s} className="p-3 rounded-lg bg-muted border border-border">
                <div className="font-mono text-primary text-[10px]">STAGE {i + 1}</div>
                <div className="font-semibold">{s}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPr.mutate();
        }}
        className="panel p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
      >
        <div className="space-y-1.5">
          <Label>Material</Label>
          <Input value={prMaterial} onChange={(e) => setPrMaterial(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Quantity</Label>
          <Input
            type="number"
            value={prQuantity}
            onChange={(e) => setPrQuantity(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Supplier</Label>
          <Input value={prSupplier} onChange={(e) => setPrSupplier(e.target.value)} />
        </div>
        <Button type="submit" disabled={createPr.isPending}>
          <Plus className="w-4 h-4" />
          {createPr.isPending ? 'Creating…' : 'Create PR'}
        </Button>
      </form>

      {msg && <Badge variant="secondary">{msg}</Badge>}

      {isLoading ? (
        <DataTable rows={[]} columns={[]} loading />
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
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => advance.mutate(r.id)}
                  >
                    Advance →
                  </Button>
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
