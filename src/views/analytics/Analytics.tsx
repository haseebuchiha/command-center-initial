'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from 'recharts';
import { chartData, pieData } from '@/lib/data/charts';

export const Analytics = () => (
  <div>
    <div className="mb-7">
      <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
        Analytics
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-4 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                These charts show how your business is doing over time. Blue =
                leads, Purple = content created, Green = sales.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h1>
      <p className="text-[15px] text-muted-foreground">
        Simple charts showing how your business and AI team are doing.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-base font-bold">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
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
              <Line
                type="monotone"
                dataKey="leads"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="content"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-base font-bold">Agent Workload</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <ReTooltip contentStyle={{ borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <div
                  className="size-2 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="text-xs text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
