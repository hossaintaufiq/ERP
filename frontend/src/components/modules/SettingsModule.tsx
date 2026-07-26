'use client';

import React, { useEffect, useState } from 'react';
import { erpApi } from '@/lib/api';
import { PageHeader } from '@/components/ui/DataTable';

export default function SettingsModule() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    erpApi.settings().then(setSettings).catch(() => setSettings({}));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await erpApi.updateSettings(settings);
      setSettings(updated);
      setMsg('Settings saved');
    } catch {
      setMsg('Failed to save — is API online?');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="panel p-8 text-center text-sm text-stone-500">Loading settings…</div>;

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Administration"
        title="Company Settings"
        description="Fiscal year, currency, AQL defaults, overtime, and locale."
        actions={
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        }
      />

      <div className="grid md:grid-cols-2 gap-4">
        {[
          ['currency', 'Currency'],
          ['timezone', 'Timezone'],
          ['dateFormat', 'Date format'],
          ['fiscalYearStart', 'Fiscal year start'],
          ['aqlDefault', 'Default AQL'],
          ['overtimeRate', 'Overtime rate'],
        ].map(([key, label]) => (
          <div key={key} className="panel p-4 space-y-1">
            <label className="text-xs font-semibold text-stone-500">{label}</label>
            <input
              className="input-field"
              value={settings[key] ?? ''}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>
      {msg && <p className="text-xs text-brand-700 dark:text-brand-400">{msg}</p>}
    </div>
  );
}
