'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartCard, SharePieChart } from '@/components/ui/Charts';

export default function OrganizationModule() {
  const [tab, setTab] = useState('branches');
  const branchesQ = useQuery({
    queryKey: ['branches'],
    queryFn: () => resources.list('branches', { limit: 50 }),
  });
  const deptsQ = useQuery({
    queryKey: ['departments'],
    queryFn: () => resources.list('departments', { limit: 100 }),
  });
  const usersQ = useQuery({
    queryKey: ['users-org'],
    queryFn: () => resources.list('users', { limit: 50 }),
  });

  const branches = (branchesQ.data as any)?.data || [];
  const departments = (deptsQ.data as any)?.data || [];
  const users = (usersQ.data as any)?.data || [];

  const branchTypeMix = Object.entries(
    branches.reduce((acc: Record<string, number>, b: any) => {
      acc[b.type || 'other'] = (acc[b.type || 'other'] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value: value as number }));

  const branchName = (id: string) => branches.find((b: any) => b.id === id)?.name || id || '—';

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Master Data · Company"
        title="Organization Structure"
        description="Factories, offices, warehouses, departments, and system users."
      />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <StatCard label="Branches" value={branches.length} />
        <StatCard label="Departments" value={departments.length} />
        <StatCard label="Users" value={users.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <ChartCard title="Branch types" description="Factory / office / warehouse">
          <SharePieChart data={branchTypeMix} height={180} />
        </ChartCard>
        <div className="lg:col-span-2 panel p-4 sm:p-5 text-sm text-muted-foreground leading-relaxed">
          Multi-site garments groups typically run separate factory codes for costing, attendance,
          and inventory. Departments map to merchandising, cutting, sewing, finishing, QC, store,
          and accounts — used for payroll routing and leave approvals.
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full sm:w-auto flex flex-wrap h-auto gap-1">
          <TabsTrigger value="branches" className="flex-1 sm:flex-none">
            Branches
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex-1 sm:flex-none">
            Departments
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1 sm:flex-none">
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branches" className="mt-4">
          <DataTable
            loading={branchesQ.isLoading}
            rows={branches}
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'name', header: 'Name' },
              { key: 'type', header: 'Type' },
              { key: 'companyId', header: 'Company', hideOnMobile: true },
            ]}
          />
        </TabsContent>

        <TabsContent value="departments" className="mt-4">
          <DataTable
            loading={deptsQ.isLoading}
            rows={departments}
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'name', header: 'Department' },
              {
                key: 'branchId',
                header: 'Branch',
                render: (r: any) => branchName(r.branchId),
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <DataTable
            loading={usersQ.isLoading}
            rows={users}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'role', header: 'Role' },
              { key: 'status', header: 'Status', hideOnMobile: true },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
