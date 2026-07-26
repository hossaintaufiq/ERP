'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Fingerprint, CreditCard, ScanFace, Play } from 'lucide-react';
import { resources } from '@/lib/api';
import { DataTable, PageHeader, StatCard } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AttendanceModule() {
  const [scanType, setScanType] = useState<'Fingerprint' | 'RFID' | 'Face'>('Fingerprint');
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => resources.list('attendance', { limit: 80, sortBy: 'date', sortDir: 'desc' }),
  });
  const rows = (data as any)?.data || [];

  const scan = useMutation({
    mutationFn: () =>
      resources.create('attendance', {
        employeeCode: `GE-EMP-${Math.floor(100 + Math.random() * 400)}`,
        employeeName: ['Farhana Parvin', 'Kabir Hossain', 'Salma Begum', 'Monir Khan'][
          Math.floor(Math.random() * 4)
        ],
        date: new Date().toISOString().slice(0, 10),
        checkIn: new Date().toTimeString().slice(0, 5),
        checkOut: '',
        method: scanType,
        status: 'Present',
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }),
  });

  const present = rows.filter((r: any) => r.status === 'Present' || r.status === 'On Time' || r.status === 'Late').length;

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        eyebrow="Module 12 · HR"
        title="Biometric Attendance"
        description="Turnstile fingerprint, RFID, and face recognition logs with late/OT flags."
        actions={
          <Button type="button" onClick={() => scan.mutate()} disabled={scan.isPending}>
            <Play className="w-4 h-4" /> {scan.isPending ? 'Scanning…' : 'Simulate Scan'}
          </Button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Records" value={(data as any)?.meta?.total ?? rows.length} />
        <StatCard label="Present-like" value={present} />
        <StatCard label="Sensor" value={scanType} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {(
          [
            { id: 'Fingerprint' as const, icon: Fingerprint, label: 'Fingerprint Scanner' },
            { id: 'RFID' as const, icon: CreditCard, label: 'RFID Card' },
            { id: 'Face' as const, icon: ScanFace, label: 'Face Recognition' },
          ] as const
        ).map(({ id, icon: Icon, label }) => (
          <Card
            key={id}
            role="button"
            tabIndex={0}
            onClick={() => setScanType(id)}
            onKeyDown={(e) => e.key === 'Enter' && setScanType(id)}
            className={cn(
              'p-4 flex items-center gap-3 text-left border-2 cursor-pointer transition-colors',
              scanType === id ? 'border-primary' : 'border-transparent',
            )}
          >
            <Icon className="w-7 h-7 text-primary" />
            <div>
              <div className="font-bold text-sm">{label}</div>
              <div className="text-[10px] text-muted-foreground">Gate sensor · {id}</div>
            </div>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-sm text-stone-500">Loading attendance…</div>
      ) : (
        <DataTable
          rows={rows}
          columns={[
            { key: 'employeeCode', header: 'Code' },
            { key: 'employeeName', header: 'Employee' },
            { key: 'date', header: 'Date' },
            { key: 'checkIn', header: 'In' },
            { key: 'checkOut', header: 'Out' },
            { key: 'method', header: 'Method' },
            { key: 'status', header: 'Status' },
          ]}
        />
      )}
    </div>
  );
}
