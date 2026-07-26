'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader } from '@/components/ui/DataTable';

export default function LeaveModule() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['leave', status],
    queryFn: () =>
      resources.list('leave', {
        limit: 50,
        ...(status !== 'ALL' ? { status } : {}),
      }),
  });

  const approve = useMutation({
    mutationFn: (id: string) => resources.update('leave', id, { status: 'Approved' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leave'] }),
  });

  const rows = (data as any)?.data || [];

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="HR · Leave Management"
        title="Leave Requests & Approvals"
        description="Manage annual, sick, casual and unpaid leave across the factory workforce."
        actions={
          <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-medium">
            {['ALL', 'Pending', 'Approved', 'Rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-md ${status === s ? 'bg-brand-600 text-white' : 'text-stone-600 dark:text-stone-300'}`}
              >
                {s}
              </button>
            ))}
          </div>
        }
      />

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading leave records…</div>
      ) : (
        <DataTable
          rows={rows}
          columns={[
            { key: 'employeeName', header: 'Employee' },
            { key: 'type', header: 'Type' },
            { key: 'from', header: 'From' },
            { key: 'to', header: 'To' },
            { key: 'days', header: 'Days' },
            {
              key: 'status',
              header: 'Status',
              render: (r: any) => (
                <span className={`badge ${r.status === 'Approved' ? 'status-success' : r.status === 'Pending' ? 'status-warning' : 'status-danger'}`}>
                  {r.status}
                </span>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (r: any) =>
                r.status === 'Pending' ? (
                  <button className="text-xs font-semibold text-accent" onClick={() => approve.mutate(r.id)}>
                    Approve
                  </button>
                ) : null,
            },
          ]}
        />
      )}
    </div>
  );
}
