'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { erpApi, resources } from '@/lib/api';
import { PageHeader } from '@/components/ui/DataTable';

const STAGES = ['cutting', 'printing', 'embroidery', 'sewing', 'washing', 'ironing', 'packing', 'shipment'];

export default function ProductionPlanningModule() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['production'],
    queryFn: () => resources.list('production', { limit: 100 }),
  });

  const advance = useMutation({
    mutationFn: (id: string) => erpApi.advanceProduction(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['production'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const rows = (data as any)?.data || [];

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 9 · Production Planning"
        title="8-Stage Factory Pipeline"
        description="Advance jobs through cutting → sewing → finish → pack → shipment. Each advance updates orders, notifications, and audit."
      />

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading production board…</div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-[1200px]">
            {STAGES.map((stage) => {
              const cards = rows.filter((r: any) => r.stage === stage);
              return (
                <div key={stage} className="w-56 flex-shrink-0 panel p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">{stage}</h3>
                    <span className="badge bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-300">{cards.length}</span>
                  </div>
                  <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                    {cards.map((job: any) => (
                      <div key={job.id} className="rounded-lg border border-stone-200 dark:border-stone-700 p-3 bg-stone-50 dark:bg-stone-900 space-y-1.5">
                        <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">{job.orderNumber}</div>
                        <div className="text-[11px] text-stone-500">{job.buyer}</div>
                        <div className="text-[11px] font-mono text-brand-700 dark:text-brand-400">{job.styleNumber}</div>
                        <div className="text-[11px] text-stone-500">
                          {job.completedQty?.toLocaleString()} / {job.targetQty?.toLocaleString()} pcs
                        </div>
                        {stage !== 'shipment' && (
                          <button
                            type="button"
                            className="text-[11px] font-semibold text-accent"
                            onClick={() => advance.mutate(job.id)}
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    ))}
                    {!cards.length && <div className="text-[11px] text-stone-400 p-2">No jobs</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
