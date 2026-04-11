'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, Ticket, Users, Megaphone } from 'lucide-react';

type CrmSummaryProps = {
  crmSummary?: {
    openTickets: number;
    urgentTickets: number;
    highTickets: number;
    newLeads: number;
    activeCampaigns: number;
  };
};

export const CrmSummaryCard = ({ crmSummary }: CrmSummaryProps) => {
  const data = crmSummary ?? {
    openTickets: 0,
    urgentTickets: 0,
    highTickets: 0,
    newLeads: 0,
    activeCampaigns: 0,
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <span className="text-primary">📊</span> CRM Summary
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3.5 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  A quick snapshot of your CRM health — open tickets, new leads,
                  and active campaigns.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Open Tickets */}
          <Link
            href="/tickets"
            className="rounded-lg border bg-background p-4 transition-colors hover:border-primary/40"
          >
            <div className="mb-2 flex items-center gap-2">
              <Ticket className="size-4 text-muted-foreground" />
              <span className="text-[13px] font-medium text-muted-foreground">
                Open Tickets
              </span>
            </div>
            <div className="text-2xl font-bold">
              <span className={data.openTickets === 0 ? 'text-muted-foreground' : ''}>
                {data.openTickets}
              </span>
            </div>
            {(data.urgentTickets > 0 || data.highTickets > 0) && (
              <div className="mt-1 flex gap-3 text-[12px]">
                {data.urgentTickets > 0 && (
                  <span className="font-medium text-destructive">
                    {data.urgentTickets} urgent
                  </span>
                )}
                {data.highTickets > 0 && (
                  <span className="font-medium text-orange-500">
                    {data.highTickets} high
                  </span>
                )}
              </div>
            )}
          </Link>

          {/* New Leads */}
          <Link
            href="/leads"
            className="rounded-lg border bg-background p-4 transition-colors hover:border-primary/40"
          >
            <div className="mb-2 flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-[13px] font-medium text-muted-foreground">
                New Leads
              </span>
            </div>
            <div className="text-2xl font-bold">
              <span className={data.newLeads === 0 ? 'text-muted-foreground' : ''}>
                {data.newLeads}
              </span>
            </div>
          </Link>

          {/* Active Campaigns */}
          <Link
            href="/campaigns"
            className="rounded-lg border bg-background p-4 transition-colors hover:border-primary/40"
          >
            <div className="mb-2 flex items-center gap-2">
              <Megaphone className="size-4 text-muted-foreground" />
              <span className="text-[13px] font-medium text-muted-foreground">
                Active Campaigns
              </span>
            </div>
            <div className="text-2xl font-bold">
              <span className={data.activeCampaigns === 0 ? 'text-muted-foreground' : ''}>
                {data.activeCampaigns}
              </span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
