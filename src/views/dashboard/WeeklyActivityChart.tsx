'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from 'recharts';
import { chartData } from '@/lib/data/charts';

const legends = [
  { label: 'Leads', colorClass: 'bg-primary' },
  { label: 'Content', colorClass: 'bg-accent' },
  { label: 'Sales', colorClass: 'bg-success' },
];

export const WeeklyActivityChart = () => (
  <Card>
    <CardContent className="p-6">
      <h3 className="mb-5 text-lg font-bold">This Week&apos;s Activity</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <ReTooltip contentStyle={{ borderRadius: 8 }} />
          <Bar
            dataKey="leads"
            fill="var(--color-primary)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="content"
            fill="var(--color-accent)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="sales"
            fill="var(--color-success)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex justify-center gap-5">
        {legends.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`size-2.5 rounded-sm ${l.colorClass}`} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
