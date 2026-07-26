'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Check, Minus } from 'lucide-react';
import { resources } from '@/lib/api';
import { PageHeader } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  MODULE_ACCESS,
  MODULE_LABELS,
  canAccessModule,
  describeAccess,
  getAllowedModules,
  type RoleRecord,
} from '@/lib/rbac';
import type { ModuleId } from '@/components/layout/Sidebar';

interface RolesModuleProps {
  activeRole: string;
  setActiveRole: (r: string) => void;
}

const MATRIX_MODULES = (Object.keys(MODULE_ACCESS) as ModuleId[]).filter(
  (id) => id !== 'roles' && id !== 'notifications',
);

export default function RolesModule({ activeRole, setActiveRole }: RolesModuleProps) {
  const rolesQ = useQuery({
    queryKey: ['roles'],
    queryFn: () => resources.list('roles', { limit: 50 }),
  });
  const usersQ = useQuery({
    queryKey: ['users'],
    queryFn: () => resources.list('users', { limit: 50 }),
  });

  const roles: RoleRecord[] = (rolesQ.data as any)?.data || [];
  const users = (usersQ.data as any)?.data || [];
  const selected = roles.find((r) => r.id === activeRole) || roles[0];
  const allowed = useMemo(() => getAllowedModules(selected), [selected]);

  const usersForRole = users.filter((u: any) => u.role === selected?.id);

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Security · RBAC"
        title="Roles & permissions"
        description="Select a role to apply its access profile. The sidebar and workspaces update immediately — no re-login required."
      />

      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground shrink-0">Active persona</span>
          <span className="font-semibold truncate">{selected?.name || activeRole}</span>
        </div>
        <Separator orientation="vertical" className="hidden sm:block h-5" />
        <span className="text-xs text-muted-foreground">
          {allowed.length} modules visible · {describeAccess(selected)}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4 sm:gap-5">
        {/* Role list */}
        <Card className="shadow-none border-border/80 overflow-hidden h-fit">
          <CardHeader className="py-3 px-4 border-b border-border/80 space-y-0">
            <CardTitle className="text-sm font-semibold">Roles</CardTitle>
            <CardDescription className="text-xs">Click to activate access profile</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {rolesQ.isLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <ul className="divide-y divide-border/70 max-h-[28rem] overflow-y-auto">
                {roles.map((r) => {
                  const isActive = r.id === (selected?.id || activeRole);
                  const count = getAllowedModules(r).length;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setActiveRole(r.id)}
                        className={cn(
                          'w-full text-left px-4 py-3 transition-colors touch-manipulation',
                          isActive ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-muted/60 border-l-2 border-l-transparent',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className={cn('text-sm font-medium truncate', isActive && 'text-primary')}>
                              {r.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{r.id}</div>
                          </div>
                          <Badge variant="secondary" className="text-[10px] shrink-0 font-normal">
                            {count}
                          </Badge>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Role detail */}
        <div className="space-y-4 min-w-0">
          <Card className="shadow-none border-border/80">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{selected?.name || '—'}</CardTitle>
                  <CardDescription className="mt-1 text-xs font-mono">{selected?.id}</CardDescription>
                </div>
                <Badge variant="outline" className="font-normal">
                  {(selected?.permissions || []).includes('*') ? 'Superuser' : 'Scoped'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Permission grants
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(selected?.permissions || []).map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center rounded border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-mono text-foreground/80"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-[11px] text-muted-foreground">Modules</div>
                  <div className="font-semibold tabular-nums">{allowed.length}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Assigned users</div>
                  <div className="font-semibold tabular-nums">{usersForRole.length}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Total roles</div>
                  <div className="font-semibold tabular-nums">{roles.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/80 overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border/80 space-y-0">
              <CardTitle className="text-sm font-semibold">Module access matrix</CardTitle>
              <CardDescription className="text-xs">
                Checkmarks show what the selected role can open. Other columns compare every role.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[720px] border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="sticky left-0 z-10 bg-muted/95 backdrop-blur py-2.5 px-3 font-semibold text-muted-foreground w-44">
                      Module
                    </th>
                    {roles.map((r) => (
                      <th
                        key={r.id}
                        className={cn(
                          'py-2.5 px-2 text-center font-medium whitespace-nowrap',
                          r.id === selected?.id ? 'text-primary bg-primary/5' : 'text-muted-foreground',
                        )}
                      >
                        {r.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_MODULES.map((mod) => (
                    <tr key={mod} className="border-b border-border/60 hover:bg-muted/30">
                      <td className="sticky left-0 z-10 bg-card py-2 px-3 font-medium text-foreground/90">
                        {MODULE_LABELS[mod]}
                      </td>
                      {roles.map((r) => {
                        const ok = canAccessModule(r, mod);
                        const highlight = r.id === selected?.id;
                        return (
                          <td
                            key={r.id}
                            className={cn(
                              'py-2 px-2 text-center',
                              highlight && 'bg-primary/5',
                            )}
                          >
                            {ok ? (
                              <Check
                                className={cn(
                                  'w-3.5 h-3.5 mx-auto',
                                  highlight ? 'text-primary' : 'text-muted-foreground',
                                )}
                                strokeWidth={2.5}
                              />
                            ) : (
                              <Minus className="w-3.5 h-3.5 mx-auto text-border" strokeWidth={2} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
