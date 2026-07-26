'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard, FilterRow } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';

export default function EmployeeModule() {
  const [dept, setDept] = useState('ALL');
  const { data, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => resources.list('employees', { limit: 100, sortBy: 'name', sortDir: 'asc' }),
  });

  const rows = (data as any)?.data || [];
  const departments = useMemo(
    () => ['ALL', ...Array.from(new Set(rows.map((e: any) => e.department).filter(Boolean)))],
    [rows],
  );
  const filtered = dept === 'ALL' ? rows : rows.filter((e: any) => e.department === dept);

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 11 · HR"
        title="Employee Directory"
        description="Factory workforce profiles, departments, salaries, and performance scores."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Loaded records" value={(data as any)?.meta?.total ?? filtered.length} />
        <StatCard label="Showing" value={filtered.length} />
        <StatCard label="Departments" value={Math.max(departments.length - 1, 0)} />
      </div>

      <FilterRow>
        {departments.map((d: any) => (
          <button
            key={d}
            type="button"
            onClick={() => setDept(d)}
            className={cn('filter-chip', dept === d ? 'filter-chip-active' : 'filter-chip-idle')}
          >
            {d}
          </button>
        ))}
      </FilterRow>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading employees…</div>
      ) : (
        <DataTable
          rows={filtered}
          columns={[
            { key: 'employeeCode', header: 'Code' },
            { key: 'name', header: 'Name' },
            { key: 'department', header: 'Department' },
            { key: 'designation', header: 'Role' },
            {
              key: 'salary',
              header: 'Salary (BDT)',
              render: (r: any) => Number(r.salary || 0).toLocaleString(),
            },
            { key: 'shift', header: 'Shift' },
            {
              key: 'performanceScore',
              header: 'Score',
              render: (r: any) => `${r.performanceScore}%`,
            },
          ]}
        />
      )}
    </div>
  );
}
