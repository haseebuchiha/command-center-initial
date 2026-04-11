'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, Target, Sparkles, User, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Prisma } from '@/generated/prisma/client';
import { updateLeadAction } from '@/actions/leads/updateLeadAction';

type Lead = Prisma.LeadGetPayload<{ include: { customer: true } }>;

type LeadStage = 'new' | 'contacted' | 'qualified' | 'awaiting_reply' | 'call_scheduled' | 'quoted' | 'proposal_sent' | 'won' | 'lost' | 'reactivation';

type StageFilter = 'all' | LeadStage;

type LeadsViewProps = {
  leads: Lead[];
};

const STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  awaiting_reply: 'Awaiting Reply',
  call_scheduled: 'Call Scheduled',
  quoted: 'Quoted',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
  reactivation: 'Reactivation',
};

const FILTER_LABELS: Record<StageFilter, string> = {
  all: 'All',
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  awaiting_reply: 'Awaiting Reply',
  call_scheduled: 'Call Scheduled',
  quoted: 'Quoted',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
  reactivation: 'Reactivation',
};

function getStageBadge(stage: string) {
  switch (stage) {
    case 'new':
      return (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
        >
          New
        </Badge>
      );
    case 'contacted':
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        >
          Contacted
        </Badge>
      );
    case 'quoted':
      return (
        <Badge
          variant="outline"
          className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400"
        >
          Quoted
        </Badge>
      );
    case 'won':
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
        >
          Won
        </Badge>
      );
    case 'qualified':
      return (
        <Badge
          variant="outline"
          className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400"
        >
          Qualified
        </Badge>
      );
    case 'awaiting_reply':
      return (
        <Badge
          variant="outline"
          className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
        >
          Awaiting Reply
        </Badge>
      );
    case 'call_scheduled':
      return (
        <Badge
          variant="outline"
          className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
        >
          Call Scheduled
        </Badge>
      );
    case 'proposal_sent':
      return (
        <Badge
          variant="outline"
          className="bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-400"
        >
          Proposal Sent
        </Badge>
      );
    case 'lost':
      return (
        <Badge variant="outline" className="bg-secondary text-muted-foreground">
          Lost
        </Badge>
      );
    case 'reactivation':
      return (
        <Badge
          variant="outline"
          className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
        >
          Reactivation
        </Badge>
      );
    default:
      return <Badge variant="secondary">{stage}</Badge>;
  }
}

function getSourceBadge(source: string) {
  switch (source) {
    case 'website':
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 text-blue-500"
        >
          Website
        </Badge>
      );
    case 'referral':
      return (
        <Badge
          variant="outline"
          className="border-success/30 text-success"
        >
          Referral
        </Badge>
      );
    case 'phone':
      return (
        <Badge
          variant="outline"
          className="border-orange-500/30 text-orange-500"
        >
          Phone
        </Badge>
      );
    case 'door_knock':
      return (
        <Badge
          variant="outline"
          className="border-violet-500/30 text-violet-500"
        >
          Door Knock
        </Badge>
      );
    case 'social_media':
      return (
        <Badge
          variant="outline"
          className="border-pink-500/30 text-pink-500"
        >
          Social Media
        </Badge>
      );
    default:
      return <Badge variant="secondary">{source}</Badge>;
  }
}

function getCreatedByBadge(createdBy: string) {
  if (createdBy === 'agent') {
    return (
      <div className="flex flex-col items-end gap-1">
        <Badge className="gap-1 bg-violet-600 text-white hover:bg-violet-600 dark:bg-violet-500 dark:hover:bg-violet-500">
          <Sparkles className="size-3" />
          AI Created
        </Badge>
        <Link
          href="/pipeline"
          className="flex items-center gap-1 text-[11px] text-violet-500 hover:text-violet-400 transition-colors"
        >
          View agent activity in Pipeline History
          <ArrowRight className="size-3" />
        </Link>
      </div>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <User className="size-3" />
      Manual
    </Badge>
  );
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

function isOverdueFollowUp(lead: Lead) {
  if (!lead.followUpDate) return false;
  if (lead.stage === 'won' || lead.stage === 'lost') return false;
  return new Date(lead.followUpDate) < new Date();
}

export const LeadsView = ({ leads }: LeadsViewProps) => {
  const [filter, setFilter] = useState<StageFilter>('all');
  const [localLeads, setLocalLeads] = useState(leads);
  const [isPending, startTransition] = useTransition();

  const filteredLeads =
    filter === 'all'
      ? localLeads
      : localLeads.filter((l) => l.stage === filter);

  const counts: Record<StageFilter, number> = {
    all: localLeads.length,
    new: localLeads.filter((l) => l.stage === 'new').length,
    contacted: localLeads.filter((l) => l.stage === 'contacted').length,
    qualified: localLeads.filter((l) => l.stage === 'qualified').length,
    awaiting_reply: localLeads.filter((l) => l.stage === 'awaiting_reply').length,
    call_scheduled: localLeads.filter((l) => l.stage === 'call_scheduled').length,
    quoted: localLeads.filter((l) => l.stage === 'quoted').length,
    proposal_sent: localLeads.filter((l) => l.stage === 'proposal_sent').length,
    won: localLeads.filter((l) => l.stage === 'won').length,
    lost: localLeads.filter((l) => l.stage === 'lost').length,
    reactivation: localLeads.filter((l) => l.stage === 'reactivation').length,
  };

  const handleStageChange = (leadId: string, newStage: LeadStage) => {
    // Optimistic update
    setLocalLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, stage: newStage } : l
      )
    );

    startTransition(async () => {
      await updateLeadAction({ leadId, stage: newStage });
    });
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
          Sales Leads
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Track and manage sales leads. Update stages as leads
                  progress through the pipeline.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Manage sales leads and track their progress through the pipeline.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as StageFilter[]).map((key) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key)}
          >
            {FILTER_LABELS[key]}
            {counts[key] > 0 && (
              <span className="ml-1.5 rounded-full bg-background/20 px-1.5 text-xs">
                {counts[key]}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Lead list */}
      {filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Target className="mb-4 size-12 text-muted-foreground/40" />
            <h3 className="mb-1 text-lg font-semibold">No leads yet</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all'
                ? 'No leads yet. Create one from Slack by asking your Sales agent.'
                : `No leads with stage "${FILTER_LABELS[filter]}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredLeads.map((lead) => (
          <Card
            key={lead.id}
            className={`mb-4 ${
              isOverdueFollowUp(lead)
                ? 'border-l-4 border-l-amber-500'
                : lead.stage === 'won'
                  ? 'border-success/20'
                  : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 font-semibold">{lead.name}</div>
                  {lead.serviceType && (
                    <div className="text-[13px] text-muted-foreground">
                      {lead.serviceType}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {getSourceBadge(lead.source)}
                  {getStageBadge(lead.stage)}
                  {getCreatedByBadge(lead.createdBy)}
                </div>
              </div>

              {/* Details row */}
              <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {lead.estimatedValue != null && (
                  <span className="font-medium text-foreground">
                    {formatCurrency(lead.estimatedValue)}
                  </span>
                )}
                {lead.followUpDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(lead.followUpDate).toLocaleDateString()}
                  </span>
                )}
                {lead.customer && (
                  <span>
                    Customer: {lead.customer.name}
                  </span>
                )}
                <span>{formatRelativeTime(lead.createdAt)}</span>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div className="mb-4 rounded-lg border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Notes: </span>
                  {lead.notes}
                </div>
              )}

              {/* Stage update */}
              {lead.stage !== 'won' && lead.stage !== 'lost' && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Update stage:
                  </span>
                  <Select
                    value={lead.stage}
                    onValueChange={(value) =>
                      handleStageChange(lead.id, value as LeadStage)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger size="sm" className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="awaiting_reply">Awaiting Reply</SelectItem>
                      <SelectItem value="call_scheduled">Call Scheduled</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="reactivation">Reactivation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
