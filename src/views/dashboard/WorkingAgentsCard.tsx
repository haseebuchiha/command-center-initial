import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Agent } from '@/generated/prisma/client';

const defaultWorkingAgents = [
  {
    name: 'Emma',
    emoji: '✍️',
    role: 'Content Writer',
    task: 'Writing blog post about spring trends',
    progress: 72,
  },
  {
    name: 'James',
    emoji: '🔍',
    role: 'Market Researcher',
    task: 'Analyzing competitor pricing data',
    progress: 45,
  },
  {
    name: 'Sophia',
    emoji: '💬',
    role: 'Customer Service',
    task: 'Responding to 3 customer inquiries',
    progress: 60,
  },
  {
    name: 'Ethan',
    emoji: '📊',
    role: 'Data Analyst',
    task: 'Weekly performance report',
    progress: 30,
  },
];

type WorkingAgentsCardProps = {
  agents?: Agent[];
};

export const WorkingAgentsCard = ({ agents }: WorkingAgentsCardProps) => {
  const displayAgents =
    agents && agents.length > 0
      ? agents.map((a) => ({
          name: a.name,
          emoji: a.emoji,
          role: a.role,
          task: a.task || 'Working...',
          progress: a.progress,
        }))
      : defaultWorkingAgents;

  return (
  <Card>
    <CardContent className="p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span className="text-primary">⚡</span> Working Now
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-3.5 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                These agents are busy doing tasks right now.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      {displayAgents.map((a) => (
        <div key={a.name} className="mb-4 rounded-lg border bg-background p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">
              {a.emoji} {a.name}{' '}
              <span className="text-[13px] font-normal text-muted-foreground">
                ({a.role})
              </span>
            </span>
            <span className="text-[13px] font-bold text-primary">
              {a.progress}%
            </span>
          </div>
          <div className="mb-2 text-[13px] text-muted-foreground">
            {a.task}
          </div>
          <Progress value={a.progress} className="h-1.5" />
        </div>
      ))}
    </CardContent>
  </Card>
  );
};
