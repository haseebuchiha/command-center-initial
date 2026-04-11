'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, Users, TicketCheck, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PieDataPoint } from '@/types/command-center';

type LeadFunnelItem = { stage: string; count: number };
type TicketBreakdownItem = { status: string; count: number };

type AnalyticsProps = {
  leadFunnel: LeadFunnelItem[];
  ticketBreakdown: TicketBreakdownItem[];
  agentWorkload: PieDataPoint[];
  headlineStats: {
    totalLeads: number;
    ticketsResolved: number;
    totalCostDollars: string;
  };
};

const leadStageColors: Record<string, string> = {
  New: '#3B82F6',
  Contacted: '#8B5CF6',
  Quoted: '#F59E0B',
  Won: '#10B981',
  Lost: '#EF4444',
};

const ticketStatusColors: Record<string, string> = {
  Open: '#3B82F6',
  'In Progress': '#F59E0B',
  Resolved: '#10B981',
  Closed: '#6B7280',
};

const hasData = (items: { count?: number; value?: number }[]) =>
  items.some((i) => (i.count ?? i.value ?? 0) > 0);

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export const Analytics = ({
  leadFunnel,
  ticketBreakdown,
  agentWorkload,
  headlineStats,
}: AnalyticsProps) => {
  const noLeads = !hasData(leadFunnel);
  const noTickets = !hasData(ticketBreakdown);
  const noAgents = !hasData(agentWorkload);

  return (
    <div>
      {/* Header */}
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
                  Real-time metrics from your leads, tickets, and AI agent
                  activity.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          How your business and AI team are performing.
        </p>
      </div>

      {/* Headline Stats */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold">{headlineStats.totalLeads}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
              <TicketCheck className="size-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tickets Resolved</p>
              <p className="text-2xl font-bold">
                {headlineStats.ticketsResolved}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <DollarSign className="size-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total AI Cost</p>
              <p className="text-2xl font-bold">
                ${headlineStats.totalCostDollars}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Lead Pipeline */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-bold">Lead Pipeline</h3>
            {noLeads ? (
              <EmptyState message="No leads yet — your agents will populate this as they work." />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={leadFunnel} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      tick={{ fontSize: 12 }}
                      width={80}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ReTooltip contentStyle={{ borderRadius: 8 }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {leadFunnel.map((entry) => (
                        <Cell
                          key={entry.stage}
                          fill={leadStageColors[entry.stage] ?? '#3B82F6'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 flex flex-wrap justify-center gap-3">
                  {leadFunnel
                    .filter((l) => l.count > 0)
                    .map((l) => (
                      <div key={l.stage} className="flex items-center gap-1.5">
                        <div
                          className="size-2 rounded-full"
                          style={{
                            background:
                              leadStageColors[l.stage] ?? '#3B82F6',
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {l.stage}: {l.count}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Agent Workload */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-bold">Agent Workload</h3>
            {noAgents ? (
              <EmptyState message="No agent activity yet — metrics will appear after your first run." />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={agentWorkload}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {agentWorkload.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip contentStyle={{ borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3">
                  {agentWorkload.map((p) => (
                    <div key={p.name} className="flex items-center gap-1.5">
                      <div
                        className="size-2 rounded-full"
                        style={{ background: p.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tickets by Status */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-bold">Tickets by Status</h3>
            {noTickets ? (
              <EmptyState message="No tickets yet — your agents will populate this as they work." />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ticketBreakdown}>
                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <ReTooltip contentStyle={{ borderRadius: 8 }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {ticketBreakdown.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={
                            ticketStatusColors[entry.status] ?? '#3B82F6'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 flex flex-wrap justify-center gap-3">
                  {ticketBreakdown
                    .filter((t) => t.count > 0)
                    .map((t) => (
                      <div
                        key={t.status}
                        className="flex items-center gap-1.5"
                      >
                        <div
                          className="size-2 rounded-full"
                          style={{
                            background:
                              ticketStatusColors[t.status] ?? '#3B82F6',
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {t.status}: {t.count}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
