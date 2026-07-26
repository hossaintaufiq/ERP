'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const CHART_COLORS = {
  primary: '#1d727c',
  primarySoft: '#3faab3',
  muted: '#a8a29e',
  success: '#1f8a6a',
  warning: '#c4841d',
  danger: '#c45050',
  grid: 'hsl(var(--border))',
};

const PIE_PALETTE = ['#1d727c', '#3faab3', '#74cbd0', '#c4841d', '#1f8a6a', '#5b6db5', '#c45050', '#8b6bb0'];

export function ChartCard({
  title,
  description,
  className,
  children,
  action,
}: {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className={cn('shadow-none border-border/80 min-w-0 overflow-hidden', className)}>
      <CardHeader className="p-4 sm:p-5 pb-2 flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold tracking-tight">{title}</CardTitle>
          {description && <CardDescription className="text-xs mt-0.5">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="p-3 sm:p-5 pt-2">{children}</CardContent>
    </Card>
  );
}

function ChartTooltip({ active, payload, label, valuePrefix = '', valueSuffix = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-md">
      {label && <div className="font-semibold mb-1 text-foreground">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-muted-foreground flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color || CHART_COLORS.primary }} />
          <span>
            {p.name}: {valuePrefix}
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            {valueSuffix}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Monthly / time series — ERP cash & volume trends */
export function TrendAreaChart({
  data,
  xKey = 'month',
  yKey = 'revenue',
  height = 220,
  valuePrefix = '$',
}: {
  data: Record<string, any>[];
  xKey?: string;
  yKey?: string;
  height?: number;
  valuePrefix?: string;
}) {
  if (!data?.length) return <EmptyChart />;
  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="erpTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.28} />
              <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
          />
          <Tooltip content={<ChartTooltip valuePrefix={valuePrefix} />} />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            fill="url(#erpTrendFill)"
            name={yKey}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Category comparison — stages, lines, status counts */
export function CategoryBarChart({
  data,
  xKey,
  yKey,
  height = 220,
  horizontal = false,
  valueSuffix = '',
  color = CHART_COLORS.primary,
}: {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  height?: number;
  horizontal?: boolean;
  valueSuffix?: string;
  color?: string;
}) {
  if (!data?.length) return <EmptyChart />;
  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 8, right: 8, left: horizontal ? 8 : 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={!horizontal} vertical={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={0} angle={data.length > 6 ? -25 : 0} textAnchor={data.length > 6 ? 'end' : 'middle'} height={data.length > 6 ? 48 : 28} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
            </>
          )}
          <Tooltip content={<ChartTooltip valueSuffix={valueSuffix} />} />
          <Bar
            dataKey={yKey}
            fill={color}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            name={yKey}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Share of whole — order status, stock health, QC results */
export function SharePieChart({
  data,
  nameKey = 'name',
  valueKey = 'value',
  height = 220,
}: {
  data: { name: string; value: number }[];
  nameKey?: string;
  valueKey?: string;
  height?: number;
}) {
  if (!data?.length) return <EmptyChart />;
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  return (
    <div className="w-full min-w-0 flex flex-col sm:flex-row items-center gap-3" style={{ minHeight: height }}>
      <div className="w-full sm:w-1/2 h-[180px] sm:h-full min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
              stroke="hsl(var(--card))"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full sm:w-1/2 space-y-1.5 text-xs px-1">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: PIE_PALETTE[i % PIE_PALETTE.length] }}
              />
              <span className="truncate text-muted-foreground">{d.name}</span>
            </span>
            <span className="font-semibold tabular-nums shrink-0">
              {d.value} · {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
      No chart data
    </div>
  );
}
