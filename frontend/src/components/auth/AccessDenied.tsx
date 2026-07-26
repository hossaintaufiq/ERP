'use client';

import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ModuleId } from '@/components/layout/Sidebar';
import { MODULE_LABELS } from '@/lib/rbac';

export default function AccessDenied({
  moduleId,
  roleName,
  onBack,
}: {
  moduleId: ModuleId;
  roleName?: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <Card className="w-full max-w-md border-border/80 shadow-none">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight">Access restricted</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">{MODULE_LABELS[moduleId]}</span> is not
              available for the active role
              {roleName ? (
                <>
                  {' '}
                  <span className="font-medium text-foreground">{roleName}</span>
                </>
              ) : null}
              . Switch role from the header or Roles matrix to continue.
            </p>
          </div>
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to allowed workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
