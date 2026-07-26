'use client';

import React from 'react';
import { cn } from '@/lib/cn';

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T extends { id?: string }>({
  columns,
  rows,
  onRowClick,
  empty = 'No records found',
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  empty?: string;
}) {
  if (!rows?.length) {
    return (
      <div className="panel p-10 text-center text-sm text-stone-500 border-dashed">
        {empty}
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.className}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={(row as any).id || idx}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {columns.map((c) => (
                  <td key={c.key} className={c.className}>
                    {c.render ? c.render(row) : String((row as any)[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        {eyebrow && <div className="module-eyebrow mb-1">{eyebrow}</div>}
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{title}</h2>
        {description && <p className="text-sm text-stone-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const tones = {
    default: 'text-stone-900 dark:text-stone-100',
    success: 'text-status-success',
    warning: 'text-status-warning',
    danger: 'text-status-danger',
  };
  return (
    <div className="glass-panel p-5 space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{label}</div>
      <div className={`text-2xl font-bold ${tones[tone]}`}>{value}</div>
      {hint && <div className="text-xs text-stone-500">{hint}</div>}
    </div>
  );
}
