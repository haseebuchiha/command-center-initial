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
import {
  Info,
  History,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  AlertCircle,
} from 'lucide-react';

type PipelineRun = {
  id: string;
  projectName: string;
  phase: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  tokenTotal: number;
  costCents: number;
  errorMessage: string | null;
};

type ActivityEvent = {
  id: string;
  agentName: string;
  agentEmoji: string;
  action: string;
  label: string;
  detail: string | null;
  color: string;
  createdAt: string;
};

type Build = {
  id: string;
  projectName: string;
  liveUrl: string | null;
  status: string;
  platform: string;
  durationMs: number | null;
  errorLog: string | null;
  fileCount: number | null;
};

type PhaseFilter = 'all' | 'research' | 'build' | 'assist';

type PipelineHistoryProps = {
  runs: PipelineRun[];
  activitiesByRun: Record<string, ActivityEvent[]>;
  buildsByRun: Record<string, Build>;
};

const FILTER_LABELS: Record<PhaseFilter, string> = {
  all: 'All',
  research: 'Research',
  build: 'Build',
  assist: 'Assist',
};

function getPhaseBadge(phase: string) {
  switch (phase) {
    case 'research':
      return (
        <Badge variant="outline" className="border-blue-500/30 text-blue-500">
          Research
        </Badge>
      );
    case 'build':
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-500"
        >
          Build
        </Badge>
      );
    case 'assist':
      return (
        <Badge
          variant="outline"
          className="border-violet-500/30 text-violet-500"
        >
          Assist
        </Badge>
      );
    default:
      return <Badge variant="secondary">{phase}</Badge>;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'running':
      return (
        <Badge
          variant="outline"
          className="animate-pulse border-amber-500/30 text-amber-500"
        >
          Running
        </Badge>
      );
    case 'completed':
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-500"
        >
          Completed
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="outline" className="border-red-500/30 text-red-500">
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function formatDuration(startedAt: string, completedAt: string | null): string {
  if (!completedAt) return '\u2014';
  const diffMs =
    new Date(completedAt).getTime() - new Date(startedAt).getTime();
  if (diffMs < 0) return '\u2014';
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function formatRelativeTime(date: string) {
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

function formatTokens(n: number): string {
  return n.toLocaleString();
}

export const PipelineHistory = ({
  runs,
  activitiesByRun,
  buildsByRun,
}: PipelineHistoryProps) => {
  const [filter, setFilter] = useState<PhaseFilter>('all');
  const [expandedRuns, setExpandedRuns] = useState<Set<string>>(new Set());

  const filteredRuns =
    filter === 'all' ? runs : runs.filter((r) => r.phase === filter);

  const counts: Record<PhaseFilter, number> = {
    all: runs.length,
    research: runs.filter((r) => r.phase === 'research').length,
    build: runs.filter((r) => r.phase === 'build').length,
    assist: runs.filter((r) => r.phase === 'assist').length,
  };

  const toggleExpanded = (runId: string) => {
    setExpandedRuns((prev) => {
      const next = new Set(prev);
      if (next.has(runId)) {
        next.delete(runId);
      } else {
        next.add(runId);
      }
      return next;
    });
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
          Pipeline History
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  A complete audit trail of your agent pipeline runs. See what
                  your agents did, how long it took, and what they produced.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Review past agent runs across research, build, and assist phases.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as PhaseFilter[]).map((key) => (
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

      {/* Run list */}
      {filteredRuns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <History className="mb-4 size-12 text-muted-foreground/40" />
            <h3 className="mb-1 text-lg font-semibold">No pipeline runs yet</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all'
                ? 'No pipeline runs yet. Your agents will appear here as they work.'
                : `No runs with phase "${FILTER_LABELS[filter]}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredRuns.map((run) => {
          const activities = activitiesByRun[run.id] || [];
          const build = buildsByRun[run.id];
          const isExpanded = expandedRuns.has(run.id);

          return (
            <Card
              key={run.id}
              className={`mb-4 rounded-xl border p-5 ${
                run.status === 'running' ? 'border-amber-500/20' : ''
              } ${run.status === 'failed' ? 'border-red-500/20' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 font-bold">{run.projectName}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatRelativeTime(run.startedAt)}
                    </span>
                    <span>&bull;</span>
                    <span>{formatDuration(run.startedAt, run.completedAt)}</span>
                    {run.tokenTotal > 0 && (
                      <>
                        <span>&bull;</span>
                        <span>{formatTokens(run.tokenTotal)} tokens</span>
                      </>
                    )}
                    {run.costCents > 0 && (
                      <>
                        <span>&bull;</span>
                        <span>${(run.costCents / 100).toFixed(2)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {getPhaseBadge(run.phase)}
                  {getStatusBadge(run.status)}
                </div>
              </div>

              {/* Build URL */}
              {build?.liveUrl && (
                <div className="mt-3">
                  <a
                    href={build.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="size-3" />
                    {build.liveUrl}
                  </a>
                </div>
              )}

              {/* Error message */}
              {run.status === 'failed' && run.errorMessage && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{run.errorMessage}</span>
                </div>
              )}

              {/* Expandable activity section */}
              {activities.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => toggleExpanded(run.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                    {activities.length} activit{activities.length === 1 ? 'y' : 'ies'}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1 border-l-2 border-muted pl-4">
                      {activities.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start gap-2 py-1 text-sm"
                        >
                          <span className="shrink-0">{event.agentEmoji}</span>
                          <span className="font-medium">{event.agentName}</span>
                          <span className="text-muted-foreground">
                            {event.label}
                          </span>
                          {event.detail && (
                            <span className="truncate text-muted-foreground/70">
                              &mdash;{' '}
                              {event.detail.length > 80
                                ? event.detail.slice(0, 80) + '...'
                                : event.detail}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
};
