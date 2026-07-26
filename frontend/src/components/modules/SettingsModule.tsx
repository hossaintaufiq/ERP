'use client';

import React, { useEffect, useState } from 'react';
import { erpApi } from '@/lib/api';
import { PageHeader } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsModule() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    erpApi
      .settings()
      .then((s) => {
        setSettings(s);
        setError(false);
      })
      .catch(() => {
        setSettings({});
        setError(true);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const updated = await erpApi.updateSettings(settings);
      setSettings(updated);
      setMsg('Settings saved');
    } catch {
      setMsg('Failed to save — is the API online?');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Administration"
        title="Company Settings"
        description="Fiscal year, currency, AQL defaults, overtime, and locale."
        actions={
          <Button onClick={save} disabled={saving || error}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        }
      />

      {error && (
        <Badge variant="destructive" className="font-normal">
          Could not load settings from API
        </Badge>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {(
          [
            ['currency', 'Currency'],
            ['timezone', 'Timezone'],
            ['dateFormat', 'Date format'],
            ['fiscalYearStart', 'Fiscal year start'],
            ['aqlDefault', 'Default AQL'],
            ['overtimeRate', 'Overtime rate'],
          ] as const
        ).map(([key, label]) => (
          <Card key={key} className="shadow-none">
            <CardContent className="p-4 space-y-1.5">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={settings[key] ?? ''}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      {msg && <p className="text-xs text-primary">{msg}</p>}
    </div>
  );
}
