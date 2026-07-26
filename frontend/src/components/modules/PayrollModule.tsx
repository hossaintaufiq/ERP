'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';

export default function PayrollModule() {
  const [period, setPeriod] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['payroll'],
    queryFn: () => resources.list('payroll', { limit: 100, sortBy: 'netPay', sortDir: 'desc' }),
  });
  const rows = (data as any)?.data || [];
  const periods = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((p: any) => p.period).filter(Boolean)))],
    [rows],
  );
  const filtered = period === 'ALL' ? rows : rows.filter((p: any) => p.period === period);
  const net = filtered.reduce((s: number, r: any) => s + (r.netPay || 0), 0);

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 13 · HR / Finance"
        title="Payroll & Payslips"
        description="Period-wise salary computation with OT, allowances, and deductions."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Payslips" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Showing" value={filtered.length} />
        <StatCard label="Net payroll" value={`BDT ${Math.round(net / 1000).toLocaleString()}k`} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {periods.map((p: any) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              period === p ? 'bg-brand-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading payroll…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'employeeCode', header: 'Code' },
            { key: 'employeeName', header: 'Employee' },
            { key: 'period', header: 'Period' },
            {
              key: 'basic',
              header: 'Basic',
              render: (r: any) => Number(r.basic || 0).toLocaleString(),
            },
            {
              key: 'overtime',
              header: 'OT',
              render: (r: any) => Number(r.overtime || 0).toLocaleString(),
            },
            {
              key: 'allowances',
              header: 'Allow.',
              render: (r: any) => Number(r.allowances || 0).toLocaleString(),
            },
            {
              key: 'deductions',
              header: 'Deduct.',
              render: (r: any) => Number(r.deductions || 0).toLocaleString(),
            },
            {
              key: 'netPay',
              header: 'Net pay',
              render: (r: any) => Number(r.netPay || 0).toLocaleString(),
            },
            { key: 'status', header: 'Status' },
          ]}
        />
      )}
    </div>
  );
}
