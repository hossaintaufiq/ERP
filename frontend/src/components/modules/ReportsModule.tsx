'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { erpApi } from '@/lib/api';
import { DataTable, PageHeader } from '@/components/ui/DataTable';

export default function ReportsModule() {
  const [reportType, setReportType] = useState('production');
  const [timeline, setTimeline] = useState<'Daily' | 'Monthly' | 'Yearly'>('Monthly');

  const reportTabs = [
    { id: 'production', title: 'Production' },
    { id: 'inventory', title: 'Inventory' },
    { id: 'finance', title: 'Finance' },
    { id: 'payroll', title: 'Payroll' },
    { id: 'attendance', title: 'Attendance' },
    { id: 'quality', title: 'Quality' },
    { id: 'sales', title: 'Sales' },
    { id: 'purchase', title: 'Purchase' },
    { id: 'shipment', title: 'Shipment' },
    { id: 'machine', title: 'Machine OEE' },
  ];

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['report', reportType, timeline],
    queryFn: () => erpApi.report(reportType, timeline),
  });

  const report: any = data || {};
  const preview = report.preview || [];

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 18 · Executive Reports"
        title="Analytics & Export Center"
        description="Generate structured daily, monthly, and yearly compliance reports."
        actions={
          <button
            type="button"
            className="btn-primary text-xs"
            onClick={async () => {
              try {
                const token = localStorage.getItem('ge_access_token');
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/reports/${reportType}/export`,
                  { headers: token ? { Authorization: `Bearer ${token}` } : {} },
                );
                const text = await res.text();
                const blob = new Blob([text], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${reportType}-${timeline}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              } catch {
                alert('Export failed — ensure you are logged in and API is running.');
              }
            }}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 text-xs font-semibold scrollbar-thin">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                reportType === tab.id
                  ? 'bg-brand-600 text-white shadow'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto self-stretch sm:self-start">
          {(['Daily', 'Monthly', 'Yearly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeline(t)}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg ${timeline === t ? 'bg-white dark:bg-stone-900 text-brand-700 shadow' : 'text-stone-500'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="panel p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-brand-700 uppercase font-mono">{timeline} · {reportType}</div>
            <h3 className="text-base sm:text-lg font-bold capitalize">
              {reportTabs.find((r) => r.id === reportType)?.title} report
            </h3>
          </div>
          <button className="text-xs font-semibold text-accent self-start" onClick={() => refetch()}>
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-stone-500">Compiling report…</div>
        ) : (
          <>
            <p className="text-xs text-stone-500">
              {report.summary?.records ?? 0} records · generated {report.generatedAt || '—'}
            </p>
            <DataTable
              rows={preview}
              columns={
                preview[0]
                  ? Object.keys(preview[0])
                      .filter((k) => !['createdAt', 'updatedAt', 'companyId'].includes(k))
                      .slice(0, 6)
                      .map((k) => ({ key: k, header: k }))
                  : [{ key: 'id', header: 'ID' }]
              }
              empty="No preview rows — start the API and reseed data."
            />
          </>
        )}
      </div>
    </div>
  );
}
