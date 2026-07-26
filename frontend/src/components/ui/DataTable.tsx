'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  /** Hide on small screens */
  hideOnMobile?: boolean;
};

export function DataTable<T extends { id?: string }>({
  columns,
  rows,
  onRowClick,
  empty = 'No records found',
  loading = false,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  empty?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!rows?.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 sm:p-10 text-center text-sm text-muted-foreground">{empty}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto -mx-0 scrollbar-thin">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                {columns.map((c) => (
                  <TableHead
                    key={c.key}
                    className={cn(c.className, c.hideOnMobile && 'hidden md:table-cell')}
                  >
                    {c.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow
                  key={(row as any).id || idx}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn(
                        'text-xs sm:text-sm',
                        c.className,
                        c.hideOnMobile && 'hidden md:table-cell',
                      )}
                    >
                      {c.render ? c.render(row) : String((row as any)[c.key] ?? '—')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
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
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-3 sm:gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="module-eyebrow mb-1">{eyebrow}</div>}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">{title}</h2>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto [&_button]:flex-1 sm:[&_button]:flex-none">
          {actions}
        </div>
      )}
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
    default: 'text-foreground',
    success: 'text-status-success',
    warning: 'text-status-warning',
    danger: 'text-status-danger',
  };
  return (
    <Card className="min-w-0">
      <CardHeader className="p-4 sm:p-5 pb-2 space-y-0">
        <CardDescription className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-1 space-y-1">
        <CardTitle className={cn('text-xl sm:text-2xl font-bold tabular-nums break-all', tones[tone])}>
          {value}
        </CardTitle>
        {hint && <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2">{hint}</p>}
      </CardContent>
    </Card>
  );
}

/** Horizontally scrollable filter chip row for mobile */
export function FilterRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin',
        className,
      )}
    >
      {children}
    </div>
  );
}

export { Button };
