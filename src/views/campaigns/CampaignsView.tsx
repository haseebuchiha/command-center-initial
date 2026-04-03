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
import { Info, Megaphone, Clock, User, Bot } from 'lucide-react';
import { Prisma } from '@/generated/prisma/client';
import { updateCampaignAction } from '@/actions/campaigns/updateCampaignAction';

type Campaign = Prisma.CampaignGetPayload<{}>;

type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

type StatusFilter = 'all' | CampaignStatus;

type CampaignsViewProps = {
  campaigns: Campaign[];
};

const STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
};

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'All',
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
};

function getStatusBadge(status: string) {
  switch (status) {
    case 'draft':
      return (
        <Badge
          variant="outline"
          className="border-muted-foreground/30 text-muted-foreground"
        >
          Draft
        </Badge>
      );
    case 'active':
      return (
        <Badge
          variant="outline"
          className="border-success/30 text-success"
        >
          Active
        </Badge>
      );
    case 'paused':
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 text-amber-500"
        >
          Paused
        </Badge>
      );
    case 'completed':
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 text-blue-500"
        >
          Completed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case 'content':
      return <Badge variant="secondary">Content</Badge>;
    case 'social':
      return (
        <Badge
          variant="outline"
          className="border-violet-500/30 text-violet-500"
        >
          Social
        </Badge>
      );
    case 'email':
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 text-blue-500"
        >
          Email
        </Badge>
      );
    case 'local_ads':
      return (
        <Badge
          variant="outline"
          className="border-orange-500/30 text-orange-500"
        >
          Local Ads
        </Badge>
      );
    case 'review_request':
      return (
        <Badge
          variant="outline"
          className="border-success/30 text-success"
        >
          Review Request
        </Badge>
      );
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
}

function getCreatedByBadge(createdBy: string) {
  if (createdBy === 'agent') {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-violet-500/30 text-violet-500"
      >
        <Bot className="size-3" />
        Agent
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1">
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

export const CampaignsView = ({ campaigns }: CampaignsViewProps) => {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [localCampaigns, setLocalCampaigns] = useState(campaigns);
  const [isPending, startTransition] = useTransition();

  const filteredCampaigns =
    filter === 'all'
      ? localCampaigns
      : localCampaigns.filter((c) => c.status === filter);

  const counts: Record<StatusFilter, number> = {
    all: localCampaigns.length,
    draft: localCampaigns.filter((c) => c.status === 'draft').length,
    active: localCampaigns.filter((c) => c.status === 'active').length,
    paused: localCampaigns.filter((c) => c.status === 'paused').length,
    completed: localCampaigns.filter((c) => c.status === 'completed').length,
  };

  const handleStatusChange = (
    campaignId: string,
    newStatus: CampaignStatus
  ) => {
    // Optimistic update
    setLocalCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, status: newStatus } : c
      )
    );

    startTransition(async () => {
      await updateCampaignAction({ campaignId, status: newStatus });
    });
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
          Campaigns
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Track and manage marketing campaigns. Update statuses as
                  campaigns progress through their lifecycle.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Manage marketing campaigns and track their progress.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((key) => (
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

      {/* Campaign list */}
      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Megaphone className="mb-4 size-12 text-muted-foreground/40" />
            <h3 className="mb-1 text-lg font-semibold">No campaigns found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all'
                ? 'No campaigns yet. Create one from Slack by asking your Marketing agent.'
                : `No campaigns with status "${FILTER_LABELS[filter]}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredCampaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className={`mb-4 ${campaign.status === 'active' ? 'border-success/20' : ''}`}
          >
            <CardContent className="p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 font-bold">{campaign.name}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                    {campaign.targetArea && (
                      <>
                        <span>{campaign.targetArea}</span>
                        <span>&bull;</span>
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatRelativeTime(campaign.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {getTypeBadge(campaign.type)}
                  {getStatusBadge(campaign.status)}
                  {getCreatedByBadge(campaign.createdBy)}
                </div>
              </div>

              {/* Description preview */}
              {campaign.description && (
                <div className="mb-4 max-h-[80px] overflow-hidden whitespace-pre-line rounded-lg border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
                  {campaign.description.length > 200
                    ? campaign.description.slice(0, 200) + '...'
                    : campaign.description}
                </div>
              )}

              {/* Channels */}
              {campaign.channels && (
                <div className="mb-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Channels:{' '}
                  </span>
                  {campaign.channels}
                </div>
              )}

              {/* Notes */}
              {campaign.notes && (
                <div className="mb-4 rounded-lg border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Notes: </span>
                  {campaign.notes}
                </div>
              )}

              {/* Status update */}
              {campaign.status !== 'completed' && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Update status:
                  </span>
                  <Select
                    value={campaign.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        campaign.id,
                        value as CampaignStatus
                      )
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger size="sm" className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
