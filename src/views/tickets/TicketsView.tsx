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
import { Info, MessageSquare, Clock, User, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Prisma } from '@/generated/prisma/client';
import { updateTicketAction } from '@/actions/tickets/updateTicketAction';

type TicketWithCustomer = Prisma.SupportTicketGetPayload<{
  include: { customer: true };
}>;

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

type StatusFilter = 'all' | TicketStatus;

type TicketsViewProps = {
  tickets: TicketWithCustomer[];
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'All',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

function getStatusBadge(status: string) {
  switch (status) {
    case 'open':
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 text-amber-500"
        >
          Open
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge variant="outline" className="border-blue-500/30 text-blue-500">
          In Progress
        </Badge>
      );
    case 'resolved':
      return (
        <Badge
          variant="outline"
          className="border-success/30 text-success"
        >
          Resolved
        </Badge>
      );
    case 'closed':
      return (
        <Badge
          variant="outline"
          className="border-muted-foreground/30 text-muted-foreground"
        >
          Closed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'urgent':
      return (
        <Badge variant="destructive">Urgent</Badge>
      );
    case 'high':
      return (
        <Badge
          variant="outline"
          className="border-orange-500/30 text-orange-500"
        >
          High
        </Badge>
      );
    case 'medium':
      return <Badge variant="secondary">Medium</Badge>;
    case 'low':
      return (
        <Badge
          variant="outline"
          className="border-muted-foreground/30 text-muted-foreground"
        >
          Low
        </Badge>
      );
    default:
      return <Badge variant="secondary">{priority}</Badge>;
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

export const TicketsView = ({ tickets }: TicketsViewProps) => {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [localTickets, setLocalTickets] = useState(tickets);
  const [isPending, startTransition] = useTransition();

  const filteredTickets =
    filter === 'all'
      ? localTickets
      : localTickets.filter((t) => t.status === filter);

  const counts: Record<StatusFilter, number> = {
    all: localTickets.length,
    open: localTickets.filter((t) => t.status === 'open').length,
    in_progress: localTickets.filter((t) => t.status === 'in_progress').length,
    resolved: localTickets.filter((t) => t.status === 'resolved').length,
    closed: localTickets.filter((t) => t.status === 'closed').length,
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    // Optimistic update
    setLocalTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );

    startTransition(async () => {
      await updateTicketAction({ ticketId, status: newStatus });
    });
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
          Support Tickets
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Track and manage support tickets from your customers. Update
                  statuses as you work through each issue.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Manage customer support requests and track resolution progress.
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

      {/* Ticket list */}
      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="mb-4 size-12 text-muted-foreground/40" />
            <h3 className="mb-1 text-lg font-semibold">No tickets found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all'
                ? 'No support tickets yet. Tickets created by agents or manually will appear here.'
                : `No tickets with status "${FILTER_LABELS[filter]}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className={`mb-4 ${ticket.status === 'open' ? 'border-amber-500/20' : ''}`}
          >
            <CardContent className="p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 font-bold">{ticket.subject}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                    <span>{ticket.customer.name}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatRelativeTime(ticket.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {getPriorityBadge(ticket.priority)}
                  {getStatusBadge(ticket.status)}
                  {getCreatedByBadge(ticket.createdBy)}
                </div>
              </div>

              {/* Description preview */}
              <div className="mb-4 max-h-[80px] overflow-hidden whitespace-pre-line rounded-lg border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
                {ticket.description.length > 200
                  ? ticket.description.slice(0, 200) + '...'
                  : ticket.description}
              </div>

              {/* Notes */}
              {ticket.notes && (
                <div className="mb-4 rounded-lg border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Notes: </span>
                  {ticket.notes}
                </div>
              )}

              {/* Status update */}
              {ticket.status !== 'closed' && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Update status:
                  </span>
                  <Select
                    value={ticket.status}
                    onValueChange={(value) =>
                      handleStatusChange(ticket.id, value as TicketStatus)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger size="sm" className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
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
