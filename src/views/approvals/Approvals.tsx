'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { VideoTip } from '@/components/app/VideoTip';
import { useCommandCenterStore } from '@/lib/stores/command-center-store';
import { Prisma } from '@/generated/prisma/client';

type ApprovalStatus = 'pending' | 'approved' | 'revised' | 'blocked';

type ApprovalItem = {
  id: number | string;
  agent: string;
  emoji: string;
  type: string;
  title: string;
  preview: string;
  status: ApprovalStatus;
};

type ApprovalWithAgent = Prisma.ApprovalGetPayload<{
  include: { agent: true };
}>;

type ApprovalsProps = {
  approvals?: ApprovalWithAgent[];
};

const defaultItems: ApprovalItem[] = [
  {
    id: 1,
    agent: 'Olivia',
    emoji: '\u{1F4E7}',
    type: 'Email Campaign',
    title: 'Follow-up email to 12 warm leads',
    preview:
      'Hi [Name],\n\nI wanted to follow up on our conversation about [product]. I know you mentioned you were interested in...',
    status: 'pending',
  },
  {
    id: 2,
    agent: 'Ava',
    emoji: '\u{1F4F1}',
    type: 'Social Media',
    title: '3 Instagram posts for this week',
    preview:
      'Post 1: Behind-the-scenes of our new product launch\nPost 2: Customer testimonial spotlight\nPost 3: Tips & tricks carousel',
    status: 'pending',
  },
  {
    id: 3,
    agent: 'Emma',
    emoji: '\u270D\uFE0F',
    type: 'Blog Post',
    title: '"10 Ways to Grow Your Small Business in 2026"',
    preview:
      'Starting a business is exciting, but growing it can feel overwhelming. Here are 10 proven ways to take your small business to the next level this year...',
    status: 'approved',
  },
];

function getStatusBadge(status: ApprovalStatus) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="secondary">Needs Review</Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="border-success/30 text-success">
          Approved
        </Badge>
      );
    case 'revised':
      return (
        <Badge variant="outline" className="border-amber-500/30 text-amber-500">
          Revised
        </Badge>
      );
    case 'blocked':
      return (
        <Badge
          variant="outline"
          className="border-destructive/30 text-destructive"
        >
          Blocked
        </Badge>
      );
  }
}

export const Approvals = ({ approvals }: ApprovalsProps) => {
  const initialItems: ApprovalItem[] =
    approvals && approvals.length > 0
      ? approvals.map((a) => ({
          id: a.id,
          agent: a.agent.name,
          emoji: a.agent.emoji,
          type: a.type,
          title: a.title,
          preview: a.preview,
          status: a.status as ApprovalStatus,
        }))
      : defaultItems;

  const [items, setItems] = useState(initialItems);
  const triggerConfetti = useCommandCenterStore((s) => s.triggerConfetti);

  const handleAction = (id: number | string, action: ApprovalStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action } : item
      )
    );
    if (action === 'approved') triggerConfetti();
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
          Approvals
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This is your review queue. Your AI agents create content, but
                  nothing gets published until you approve it here.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Review what your AI team has done before it goes live. You&apos;re
          always in control.
        </p>
        <div className="mt-2">
          <VideoTip title="How approvals work" duration="30 sec" />
        </div>
      </div>

      {items.map((item) => (
        <Card
          key={item.id}
          className={`mb-4 ${item.status === 'pending' ? 'border-warning/30' : ''}`}
        >
          <CardContent className="p-6">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-[13px] text-muted-foreground">
                    By {item.agent} &bull; {item.type}
                  </div>
                </div>
              </div>
              {getStatusBadge(item.status)}
            </div>
            <div className="mb-4 max-h-[120px] overflow-hidden whitespace-pre-line rounded-lg border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
              {item.preview}
            </div>
            {item.status === 'pending' && (
              <div className="flex gap-2.5">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAction(item.id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleAction(item.id, 'revised')}
                >
                  Revise
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleAction(item.id, 'blocked')}
                >
                  Block
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
