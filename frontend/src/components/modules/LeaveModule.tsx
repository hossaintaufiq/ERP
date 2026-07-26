'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, FilterRow } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { cn, listPayload } from '@/lib/utils';

export default function LeaveModule() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('ALL');
  const { data, isLoading, isError } = useQuery({
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

  const { rows } = listPayload(data);

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="HR · Leave Management"
        title="Leave Requests & Approvals"
        description="Manage annual, sick, casual and unpaid leave across the factory workforce."
      />

      <FilterRow>
        {['ALL', 'Pending', 'Approved', 'Rejected'].map((s) => (
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

      {isError ? (
        <div className="panel p-8 text-center text-sm text-status-danger">Failed to load leave records.</div>
      ) : (
        <DataTable
          loading={isLoading}
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
                <span
                  className={`badge ${
                    r.status === 'Approved'
                      ? 'status-success'
                      : r.status === 'Pending'
                        ? 'status-warning'
                        : 'status-danger'
                  }`}
                >
                  {r.status}
                </span>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (r: any) =>
                r.status === 'Pending' ? (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    disabled={approve.isPending}
                    onClick={() => approve.mutate(r.id)}
                  >
                    Approve
                  </Button>
                ) : null,
            },
          ]}
        />
      )}
    </div>
  );
}
