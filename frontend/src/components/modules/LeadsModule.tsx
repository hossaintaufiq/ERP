'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader } from '@/components/ui/DataTable';

export default function LeadsModule() {
  const leads = useQuery({
    queryKey: ['leads'],
    queryFn: () => resources.list('leads', { limit: 50, sortBy: 'estimatedValue' }),
  });
  const quotations = useQuery({
    queryKey: ['quotations'],
    queryFn: () => resources.list('quotations', { limit: 50 }),
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="CRM · Merchandising"
        title="Leads & Quotations"
        description="Capture buyer leads and track quotation lifecycle through to order conversion."
      />

      <DataTable
        rows={(leads.data as any)?.data || []}
        columns={[
          { key: 'companyName', header: 'Company' },
          { key: 'contact', header: 'Contact' },
          { key: 'country', header: 'Country' },
          {
            key: 'estimatedValue',
            header: 'Est. Value',
            render: (r: any) => `$${Number(r.estimatedValue).toLocaleString()}`,
          },
          { key: 'status', header: 'Status' },
        ]}
      />

      <h3 className="font-semibold text-sm text-stone-800 dark:text-stone-200">Quotations</h3>
      <DataTable
        rows={(quotations.data as any)?.data || []}
        columns={[
          { key: 'quotationNumber', header: 'Quotation #' },
          {
            key: 'amount',
            header: 'Amount',
            render: (r: any) => `$${Number(r.amount).toLocaleString()}`,
          },
          { key: 'validUntil', header: 'Valid until' },
          { key: 'status', header: 'Status' },
        ]}
      />
    </div>
  );
}
