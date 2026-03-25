import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { buildTokenUsageSummary } from '@/lib/buildTokenUsageSummary';
import { Dashboard } from '@/views/dashboard/Dashboard';

export const DashboardController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const [
    workingAgents,
    pendingCount,
    recentActivity,
    tasksDoneToday,
    tokenUsageRows,
    pendingApprovals,
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
  ]);

  const tokenUsage = buildTokenUsageSummary(tokenUsageRows);

  return (
    <Dashboard
      stats={{
        activeAgents: workingAgents.length,
        pendingApprovals: pendingCount,
        tasksDoneToday,
      }}
      tokenUsage={tokenUsage}
      recentActivity={recentActivity}
      workingAgents={workingAgents}
      pendingApprovals={pendingApprovals}
    />
  );
};
