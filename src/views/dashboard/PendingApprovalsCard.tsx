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

const pendingApprovals = [
  { name: 'Olivia', emoji: '📧', task: 'Follow-up email to 12 leads' },
  {
    name: 'Ava',
    emoji: '📱',
    task: '3 Instagram posts ready for review',
  },
];

export const PendingApprovalsCard = () => (
  <Card>
    <CardContent className="p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span className="text-warning">⏳</span> Needs Your Approval
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-3.5 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Your agents finished these tasks and need your review. Nothing
                goes live without your OK!
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      {pendingApprovals.map((a) => (
        <div
          key={a.name}
          className="mb-4 rounded-lg border border-warning/30 bg-background p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">
              {a.emoji} {a.name}
            </span>
            <Badge variant="secondary">Ready for Review</Badge>
          </div>
          <div className="mb-3 text-[13px] text-muted-foreground">
            {a.task}
          </div>
          <div className="flex gap-2">
            <Button variant="success" size="sm">
              ✓ Approve
            </Button>
            <Button variant="warning" size="sm">
              ✏️ Revise
            </Button>
            <Button variant="destructive" size="sm">
              ✕ Block
            </Button>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);
