import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { VideoTip } from '@/components/app/VideoTip';
import { Agent } from '@/generated/prisma/client';

type AgentData = {
  name: string;
  role: string;
  emoji: string;
  status: 'working' | 'approval' | 'idle';
  task: string | null;
  progress: number;
};

type TableGroup = {
  label: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  agents: AgentData[];
};

const defaultAgents: AgentData[] = [
  {
    name: 'Emma',
    role: 'Content Writer',
    emoji: '\u270D\uFE0F',
    status: 'working',
    task: 'Writing blog post about spring trends',
    progress: 72,
  },
  {
    name: 'James',
    role: 'Market Researcher',
    emoji: '\u{1F50D}',
    status: 'working',
    task: 'Analyzing competitor pricing data',
    progress: 45,
  },
  {
    name: 'Olivia',
    role: 'Sales Outreach',
    emoji: '\u{1F4E7}',
    status: 'approval',
    task: 'Follow-up email to 12 leads',
    progress: 100,
  },
  {
    name: 'Liam',
    role: 'SEO Specialist',
    emoji: '\u{1F4C8}',
    status: 'idle',
    task: null,
    progress: 0,
  },
  {
    name: 'Sophia',
    role: 'Customer Service',
    emoji: '\u{1F4AC}',
    status: 'working',
    task: 'Responding to 3 customer inquiries',
    progress: 60,
  },
  {
    name: 'Noah',
    role: 'Operations Manager',
    emoji: '\u{1F4CB}',
    status: 'idle',
    task: null,
    progress: 0,
  },
  {
    name: 'Ava',
    role: 'Social Media Manager',
    emoji: '\u{1F4F1}',
    status: 'approval',
    task: '3 Instagram posts ready for review',
    progress: 100,
  },
  {
    name: 'Ethan',
    role: 'Data Analyst',
    emoji: '\u{1F4CA}',
    status: 'working',
    task: 'Weekly performance report',
    progress: 30,
  },
];

function getStatusLabel(status: AgentData['status']) {
  switch (status) {
    case 'working':
      return 'Working';
    case 'approval':
      return 'Review';
    case 'idle':
      return 'Available';
  }
}

function buildTables(agentList: AgentData[]): TableGroup[] {
  return [
    {
      label: 'Working',
      emoji: '\u26A1',
      colorClass: 'text-primary',
      bgClass: 'bg-primary',
      agents: agentList.filter((a) => a.status === 'working'),
    },
    {
      label: 'Needs Approval',
      emoji: '\u23F3',
      colorClass: 'text-warning',
      bgClass: 'bg-warning',
      agents: agentList.filter((a) => a.status === 'approval'),
    },
    {
      label: 'Idle (Available)',
      emoji: '\u{1F4A4}',
      colorClass: 'text-muted-foreground',
      bgClass: 'bg-muted-foreground',
      agents: agentList.filter((a) => a.status === 'idle'),
    },
  ];
}

type AgentOfficeProps = {
  agents?: Agent[];
};

export const AgentOffice = ({ agents }: AgentOfficeProps) => {
  const agentList: AgentData[] =
    agents && agents.length > 0
      ? agents.map((a) => ({
          name: a.name,
          role: a.role,
          emoji: a.emoji,
          status: a.status as AgentData['status'],
          task: a.task,
          progress: a.progress,
        }))
      : defaultAgents;

  const tables = buildTables(agentList);

  return (
  <div>
    <div className="mb-7">
      <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
        Agent Office
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-4 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                This is where your full AI team lives. See what each agent is
                doing, assign tasks, or review work.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h1>
      <p className="text-[15px] text-muted-foreground">
        Your AI team&apos;s workspace. See who&apos;s working, who needs your
        review, and who&apos;s available.
      </p>
      <div className="mt-2">
        <VideoTip title="Meet your AI team" duration="45 sec" />
      </div>
    </div>

    {tables.map((table) => (
      <div key={table.label} className="mb-7">
        <div className="mb-3.5 flex items-center gap-2.5">
          <span className="text-[22px]">{table.emoji}</span>
          <h2 className={`text-xl font-bold ${table.colorClass}`}>
            {table.label}
          </h2>
          <span
            className={`rounded-full ${table.bgClass}/15 ${table.colorClass} px-2.5 py-0.5 text-[13px] font-bold`}
          >
            {table.agents.length}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {table.agents.map((a) => (
            <Card key={a.name}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex size-[52px] items-center justify-center rounded-full border-2 ${table.bgClass}/15 border-current/20 text-[26px] ${table.colorClass}`}
                  >
                    {a.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold">{a.name}</div>
                    <div className="text-[13px] text-muted-foreground">
                      {a.role}
                    </div>
                  </div>
                  <Badge variant="outline" className={table.colorClass}>
                    {getStatusLabel(a.status)}
                  </Badge>
                </div>
                {a.task && (
                  <div className="mt-3 rounded-lg border bg-background p-3">
                    <div className="mb-1.5 text-[13px] text-muted-foreground">
                      {a.task}
                    </div>
                    {a.progress > 0 && a.progress < 100 && (
                      <Progress value={a.progress} className="h-1" />
                    )}
                  </div>
                )}
                {a.status === 'idle' && (
                  <div className="mt-3">
                    <Button size="sm" className="w-full">
                      Assign a Task
                    </Button>
                  </div>
                )}
                {a.status === 'approval' && (
                  <div className="mt-3 flex gap-2">
                    <Button variant="success" size="sm" className="flex-1">
                      Approve
                    </Button>
                    <Button variant="warning" size="sm" className="flex-1">
                      Revise
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Block
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ))}
  </div>
  );
};
