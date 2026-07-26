'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { erpApi, resources } from '@/lib/api';
import { PageHeader } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 9 · Production Planning"
        title="8-Stage Factory Pipeline"
        description="Advance jobs through cutting → sewing → finish → pack → shipment. Swipe horizontally on mobile."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-thin">
          <div className="flex gap-3 w-max min-w-full">
            {STAGES.map((stage) => {
              const cards = rows.filter((r: any) => r.stage === stage);
              return (
                <Card
                  key={stage}
                  className="w-[min(16rem,80vw)] sm:w-56 flex-shrink-0 snap-start"
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                        {stage}
                      </h3>
                      <Badge variant="secondary">{cards.length}</Badge>
                    </div>
                    <div className="space-y-2 max-h-[55vh] sm:max-h-[70vh] overflow-y-auto overscroll-contain">
                      {cards.map((job: any) => (
                        <div
                          key={job.id}
                          className="rounded-lg border border-border p-3 bg-muted/40 space-y-1.5"
                        >
                          <div className="text-xs font-semibold">{job.orderNumber}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{job.buyer}</div>
                          <div className="text-[11px] font-mono text-primary">{job.styleNumber}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {job.completedQty?.toLocaleString()} / {job.targetQty?.toLocaleString()} pcs
                          </div>
                          {stage !== 'shipment' && (
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-[11px]"
                              disabled={advance.isPending}
                              onClick={() => advance.mutate(job.id)}
                            >
                              Advance →
                            </Button>
                          )}
                        </div>
                      ))}
                      {!cards.length && (
                        <div className="text-[11px] text-muted-foreground p-2">No jobs</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
