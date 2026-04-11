import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { Analytics } from '@/views/analytics/Analytics';

export const AnalyticsController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const [
    leadsByStage,
    ticketsByStatus,
    agentActivity,
    totalCostAgg,
    totalLeads,
    totalTicketsResolved,
  ] = await Promise.all([
    prisma.lead.groupBy({
      by: ['stage'],
      _count: true,
      where: { userId: user.id },
    }),
    prisma.supportTicket.groupBy({
      by: ['status'],
      _count: true,
      where: { userId: user.id },
    }),
    prisma.activityEvent.groupBy({
      by: ['agentName'],
      _count: true,
      where: { userId: user.id },
    }),
    prisma.tokenUsage.aggregate({
      _sum: { costCents: true },
      where: { userId: user.id },
    }),
    prisma.lead.count({ where: { userId: user.id } }),
    prisma.supportTicket.count({
      where: { userId: user.id, status: 'resolved' },
    }),
  ]);

  // Transform lead stages into ordered funnel
  const stageOrder = ['new', 'contacted', 'qualified', 'awaiting_reply', 'call_scheduled', 'quoted', 'proposal_sent', 'won', 'lost', 'reactivation'];
  const stageMap = new Map(
    leadsByStage.map((r) => [r.stage, r._count])
  );
  const leadFunnel = stageOrder.map((stage) => ({
    stage: stage.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    count: stageMap.get(stage) ?? 0,
  }));

  // Transform ticket statuses
  const statusOrder = ['open', 'in_progress', 'resolved', 'closed'];
  const statusMap = new Map(
    ticketsByStatus.map((r) => [r.status, r._count])
  );
  const ticketBreakdown = statusOrder.map((status) => ({
    status: status
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    count: statusMap.get(status) ?? 0,
  }));

  // Transform agent activity into pie data
  const agentColors = [
    '#3B82F6',
    '#8B5CF6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#06B6D4',
    '#EC4899',
    '#14B8A6',
  ];
  const agentWorkload = agentActivity.map((r, i) => ({
    name: r.agentName,
    value: r._count,
    color: agentColors[i % agentColors.length],
  }));

  const totalCostCents = totalCostAgg._sum.costCents ?? 0;
  const totalCostDollars = (totalCostCents / 100).toFixed(2);

  return (
    <Analytics
      leadFunnel={leadFunnel}
      ticketBreakdown={ticketBreakdown}
      agentWorkload={agentWorkload}
      headlineStats={{
        totalLeads,
        ticketsResolved: totalTicketsResolved,
        totalCostDollars,
      }}
    />
  );
};
