'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { NextActionCard } from '@/components/app/NextActionCard';
import { NudgeBanner } from '@/components/app/NudgeBanner';
import { useCommandCenterStore } from '@/lib/stores/command-center-store';
import { Agent, ActivityEvent, Prisma } from '@/generated/prisma/client';
import { TokenUsageSummary } from '@/types/command-center';
import { StatsGrid } from './StatsGrid';
import { TokenUsageCard } from './TokenUsageCard';
import { LiveActivityFeed } from './LiveActivityFeed';
import { WorkingAgentsCard } from './WorkingAgentsCard';
import { PendingApprovalsCard } from './PendingApprovalsCard';
import { WeeklyActivityChart } from './WeeklyActivityChart';

type ApprovalWithAgent = Prisma.ApprovalGetPayload<{
  include: { agent: true };
}>;

type DashboardProps = {
  stats?: {
    activeAgents: number;
    pendingApprovals: number;
    tasksDoneToday: number;
  };
  tokenUsage?: TokenUsageSummary | null;
  recentActivity?: ActivityEvent[];
  workingAgents?: Agent[];
  pendingApprovals?: ApprovalWithAgent[];
};

export const Dashboard = ({
  stats,
  tokenUsage,
  recentActivity,
  workingAgents,
  pendingApprovals,
}: DashboardProps) => {
  const router = useRouter();
  const dismissedNudges = useCommandCenterStore((s) => s.dismissedNudges);
  const dismissNudge = useCommandCenterStore((s) => s.dismissNudge);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
          Command Center
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This is your home base! See everything your AI team is working
                  on, check stats, and approve their work.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Here&apos;s what your AI team is up to right now.
        </p>
      </div>

      <NextActionCard onboardProgress={100} connectedToolsCount={2} />

      {!dismissedNudges.includes('connect-tools-dash') && (
        <NudgeBanner
          emoji="🔌"
          text="Your AI team works even better when connected to your tools! Try adding Instagram or Shopify."
          actionLabel="Connect Tools"
          onAction={() => router.push('/integrations')}
          onDismiss={() => dismissNudge('connect-tools-dash')}
        />
      )}

      <StatsGrid stats={stats} />
      <TokenUsageCard usage={tokenUsage ?? undefined} />
      <LiveActivityFeed recentEvents={recentActivity} />

      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <WorkingAgentsCard agents={workingAgents} />
        <PendingApprovalsCard approvals={pendingApprovals} />
      </div>

      <WeeklyActivityChart />
    </div>
  );
};
