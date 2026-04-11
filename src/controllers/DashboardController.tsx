import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { buildTokenUsageSummary } from '@/lib/buildTokenUsageSummary';
import { Dashboard } from '@/views/dashboard/Dashboard';
import { ChartDataPoint } from '@/types/command-center';

export const DashboardController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    workingAgents,
    pendingCount,
    recentActivity,
    tasksDoneToday,
    tokenUsageRows,
    pendingApprovals,
    leadsThisWeek,
    leadsThisWeekByDay,
    ticketsThisWeekByDay,
    campaignsThisWeekByDay,
    openTicketsCount,
    openTicketsByPriority,
    newLeadsCount,
    activeCampaignsCount,
  ] = await Promise.all([
    prisma.agent.findMany({
      where: { userId: user.id, status: { not: 'idle' } },
    }),
    prisma.approval.count({
      where: { userId: user.id, status: 'pending' },
    }),
    prisma.activityEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.activityEvent.count({
      where: { userId: user.id, createdAt: { gte: startOfToday } },
    }),
    prisma.tokenUsage.findMany({
      where: { userId: user.id, date: { gte: startOfMonth } },
      include: { agent: true },
    }),
    prisma.approval.findMany({
      where: { userId: user.id, status: 'pending' },
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.lead.count({
      where: { userId: user.id, createdAt: { gte: startOfWeek } },
    }),
    prisma.lead.findMany({
      where: { userId: user.id, createdAt: { gte: startOfWeek } },
      select: { createdAt: true },
    }),
    prisma.supportTicket.findMany({
      where: { userId: user.id, createdAt: { gte: startOfWeek } },
      select: { createdAt: true },
    }),
    prisma.campaign.findMany({
      where: { userId: user.id, createdAt: { gte: startOfWeek } },
      select: { createdAt: true },
    }),
    prisma.supportTicket.count({
      where: { userId: user.id, status: 'open' },
    }),
    prisma.supportTicket.findMany({
      where: { userId: user.id, status: 'open' },
      select: { priority: true },
    }),
    prisma.lead.count({
      where: { userId: user.id, stage: 'new' },
    }),
    prisma.campaign.count({
      where: { userId: user.id, status: 'active' },
    }),
  ]);

  const tokenUsage = buildTokenUsageSummary(tokenUsageRows);

  // Build weekly chart data grouped by day
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyMap = new Map<string, { leads: number; content: number; sales: number }>();

  // Initialize all 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = dayNames[d.getDay()];
    weeklyMap.set(dayName, { leads: 0, content: 0, sales: 0 });
  }

  for (const lead of leadsThisWeekByDay) {
    const dayName = dayNames[new Date(lead.createdAt).getDay()];
    const entry = weeklyMap.get(dayName);
    if (entry) entry.leads++;
  }

  for (const ticket of ticketsThisWeekByDay) {
    const dayName = dayNames[new Date(ticket.createdAt).getDay()];
    const entry = weeklyMap.get(dayName);
    if (entry) entry.content++;
  }

  for (const campaign of campaignsThisWeekByDay) {
    const dayName = dayNames[new Date(campaign.createdAt).getDay()];
    const entry = weeklyMap.get(dayName);
    if (entry) entry.sales++;
  }

  const weeklyChartData: ChartDataPoint[] = Array.from(weeklyMap.entries()).map(
    ([name, counts]) => ({ name, ...counts })
  );

  const crmSummary = {
    openTickets: openTicketsCount,
    urgentTickets: openTicketsByPriority.filter((t) => t.priority === 'urgent').length,
    highTickets: openTicketsByPriority.filter((t) => t.priority === 'high').length,
    newLeads: newLeadsCount,
    activeCampaigns: activeCampaignsCount,
  };

  return (
    <Dashboard
      stats={{
        activeAgents: workingAgents.length,
        pendingApprovals: pendingCount,
        tasksDoneToday,
        leadsThisWeek,
      }}
      tokenUsage={tokenUsage}
      recentActivity={recentActivity}
      workingAgents={workingAgents}
      pendingApprovals={pendingApprovals}
      weeklyChartData={weeklyChartData}
      crmSummary={crmSummary}
    />
  );
};
