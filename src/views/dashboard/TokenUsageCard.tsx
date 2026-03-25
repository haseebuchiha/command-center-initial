import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { tokenUsage as defaultTokenUsage } from '@/lib/data/token-usage';
import { TokenUsageSummary } from '@/types/command-center';

type TokenUsageCardProps = {
  usage?: TokenUsageSummary;
};

export const TokenUsageCard = ({ usage }: TokenUsageCardProps) => {
  const data = usage || defaultTokenUsage;
  const usagePercent = Math.round((data.used / data.monthlyLimit) * 100);
  const remaining = data.monthlyLimit - data.used;
  const maxAgentTokens = data.byAgent[0]?.tokens || 1;
  const daysAtPace = Math.round(remaining / (data.used / 14 || 1));

  return (
    <Card className="mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🪙</span>
          <h3 className="text-base font-bold">Token Usage</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3.5 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Tokens are like fuel for your AI team. Every task uses tokens.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary"
          >
            {data.plan} Plan
          </Badge>
          <span className="text-xs text-muted-foreground">
            Resets {data.resetDate}
          </span>
        </div>
      </div>

      <CardContent className="p-4 md:p-5">
        {/* Main usage */}
        <div className="mb-5">
          <div className="mb-2 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold md:text-4xl">
                {(data.used / 1000).toFixed(0)}K
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                / {(data.monthlyLimit / 1000).toFixed(0)}K tokens
              </span>
            </div>
            <span
              className={`text-sm font-bold ${usagePercent > 85 ? 'text-destructive' : usagePercent > 65 ? 'text-warning' : 'text-success'}`}
            >
              {usagePercent}% used
            </span>
          </div>
          <Progress value={usagePercent} className="h-3" />
          <div className="mt-1.5 flex justify-between">
            <span className="text-xs text-muted-foreground">
              {(remaining / 1000).toFixed(0)}K tokens left this month
            </span>
            <span className="text-xs text-muted-foreground">
              ~{daysAtPace} days at this pace
            </span>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Per-agent breakdown */}
          <div>
            <div className="mb-2.5 flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground">
              Usage by Agent
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-3 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      See which agents use the most tokens.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {data.byAgent.map((a) => (
              <div key={a.name} className="mb-2">
                <div className="mb-0.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{a.emoji}</span>
                    <span className="text-xs font-semibold">{a.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {(a.tokens / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="h-1 rounded-full bg-muted-foreground/10">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(a.tokens / maxAgentTokens) * 100}%`,
                      background: a.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Daily usage mini chart */}
          <div>
            <div className="mb-2.5 flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground">
              Daily Usage This Week
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-3 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Tokens used each day this week.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <DailyUsageBars daily={data.daily} />
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-3.5 py-2.5">
          <span className="text-base">💡</span>
          <span className="text-xs leading-relaxed text-muted-foreground">
            {usagePercent > 80
              ? "You're using a lot of tokens this month! Consider upgrading your plan or pausing non-urgent tasks."
              : "You're on track this month. Your AI team has plenty of fuel to keep working!"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const DailyUsageBars = ({
  daily,
}: {
  daily: { day: string; tokens: number }[];
}) => {
  const maxTokens = Math.max(...daily.map((x) => x.tokens), 1);
  const today = new Date().getDay() - 1;

  return (
    <div className="flex h-[120px] items-end gap-1 px-1 md:gap-2">
      {daily.map((d, i) => {
        const barHeight = (d.tokens / maxTokens) * 100;
        const isToday = i === today;
        return (
          <div
            key={d.day}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <span className="font-mono text-[10px] text-muted-foreground">
              {(d.tokens / 1000).toFixed(0)}K
            </span>
            <div
              className={`w-full min-h-2 rounded ${isToday ? 'border border-primary bg-gradient-to-b from-primary to-accent' : 'bg-primary/20'}`}
              style={{ height: `${barHeight}%` }}
            />
            <span
              className={`text-[11px] ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}
            >
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
};
