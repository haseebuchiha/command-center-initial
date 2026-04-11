'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { activityFeedData } from '@/lib/data/activity-feed';
import { ActivityEvent } from '@/generated/prisma/client';
import type { ActivityFeedItem, CompletedFeedItem } from '@/types/command-center';

const workingAgentEmojis = [
  { name: 'Emma', emoji: '✍️' },
  { name: 'James', emoji: '🔍' },
  { name: 'Sophia', emoji: '💬' },
  { name: 'Ethan', emoji: '📊' },
];

type LiveActivityFeedProps = {
  recentEvents?: ActivityEvent[];
};

export const LiveActivityFeed = ({ recentEvents }: LiveActivityFeedProps) => {
  const feedData: ActivityFeedItem[] = useMemo(
    () =>
      recentEvents && recentEvents.length > 0
        ? recentEvents.map((e) => ({
            agent: e.agentName,
            emoji: e.agentEmoji,
            action: e.action,
            color: e.color,
            streamText: e.detail || e.label,
            label: e.label,
          }))
        : activityFeedData,
    [recentEvents]
  );
  const TRUNCATE_LENGTH = 300;
  const [feedItems, setFeedItems] = useState<CompletedFeedItem[]>([]);
  const [streamingIdx, setStreamingIdx] = useState(0);
  const [streamedChars, setStreamedChars] = useState(0);
  const [feedPaused, setFeedPaused] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const currentItem = feedData[streamingIdx % feedData.length];
  const currentText = currentItem.streamText.substring(0, streamedChars);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamedChars, feedItems]);

  // Streaming effect
  useEffect(() => {
    if (feedPaused) return;

    const fullText = currentItem.streamText;

    if (streamedChars < fullText.length) {
      const ch = fullText[streamedChars];
      const isNewline = ch === '\n';
      const isPunctuation = '.!?:'.includes(ch);
      const delay = isNewline ? 120 : isPunctuation ? 80 : 27.5;

      const timer = setTimeout(() => {
        setStreamedChars((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setFeedItems((prev) => {
          const newItems = [
            ...prev,
            {
              ...currentItem,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
              id: Date.now(),
            },
          ];
          return newItems.slice(-20);
        });
        setStreamingIdx((prev) => prev + 1);
        setStreamedChars(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [streamedChars, streamingIdx, feedPaused, currentItem]);

  return (
    <Card className="mb-6 overflow-hidden border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 to-accent/5 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`size-2.5 rounded-full ${feedPaused ? 'bg-warning' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}
            style={{
              animation: feedPaused
                ? 'none'
                : 'pulse-glow 2s ease-in-out infinite',
            }}
          />
          <h3 className="text-base font-bold">Live Agent Activity</h3>
          <span className="font-mono text-xs text-muted-foreground">
            {feedPaused ? 'PAUSED' : 'STREAMING'}
          </span>
        </div>
        <Button
          variant={feedPaused ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFeedPaused(!feedPaused)}
        >
          {feedPaused ? '▶ Resume' : '⏸ Pause'}
        </Button>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="h-[320px] overflow-y-auto bg-gradient-to-b from-background to-card md:h-[380px]"
      >
        {/* Completed items */}
        {feedItems.map((item) => {
          const isLong = item.streamText.length > TRUNCATE_LENGTH;
          const isExpanded = expandedItems.has(item.id);
          const displayText =
            isLong && !isExpanded
              ? item.streamText.substring(0, TRUNCATE_LENGTH) + '...'
              : item.streamText;

          return (
            <div key={item.id} className="border-b px-4 py-2.5 opacity-60">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.emoji}</span>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: item.color }}
                >
                  {item.agent}
                </span>
                <span className="text-xs text-muted-foreground">completed</span>
                <span className="flex-1 text-xs text-muted-foreground">
                  {item.label}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {item.timestamp}
                </span>
                <span className="text-xs text-success">✓</span>
              </div>
              {isLong && (
                <div className="mt-1 pl-7">
                  <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-words text-muted-foreground">
                    {displayText}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.id)}
                    className="mt-0.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Currently streaming */}
        <div
          className="min-h-[200px] border-l-[3px] p-4 pb-5"
          style={{
            borderColor: currentItem.color,
            background: `${currentItem.color}08`,
          }}
        >
          {/* Agent header */}
          <div className="mb-3 flex items-center gap-2.5">
            <div
              className="flex size-9 items-center justify-center rounded-lg border text-xl"
              style={{
                background: `${currentItem.color}15`,
                borderColor: `${currentItem.color}30`,
              }}
            >
              {currentItem.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: currentItem.color }}
                >
                  {currentItem.agent}
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: `${currentItem.color}15`,
                    color: currentItem.color,
                  }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{
                      background: currentItem.color,
                      animation: 'pulse-glow 1s ease-in-out infinite',
                    }}
                  />
                  {currentItem.action}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {currentItem.label}
              </div>
            </div>
          </div>

          {/* Streaming text */}
          <div className="relative min-h-[120px] rounded-lg border bg-background p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
            {currentText}
            {!feedPaused && streamedChars < currentItem.streamText.length && (
              <span
                className="ml-px inline-block h-4 w-[7px] align-text-bottom"
                style={{
                  background: currentItem.color,
                  animation: 'blink-cursor 0.8s step-end infinite',
                }}
              />
            )}
          </div>

          {/* Progress */}
          <div className="mt-2.5 flex items-center gap-2.5">
            <Progress
              value={(streamedChars / currentItem.streamText.length) * 100}
              className="h-[3px] flex-1"
            />
            <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
              {Math.round(
                (streamedChars / currentItem.streamText.length) * 100
              )}
              %
            </span>
          </div>

          {/* Info link */}
          <div className="mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 text-xs text-primary">
                  <Info className="size-3" /> What does this mean?
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {currentItem.agent} is {currentItem.action} for your
                    business. This is real work being done by your AI team!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t bg-card px-4 py-2">
        <span className="text-[11px] text-muted-foreground">
          {feedItems.length} actions completed this session
        </span>
        <div className="flex gap-3">
          {workingAgentEmojis.map((a) => (
            <span
              key={a.name}
              title={a.name}
              className={`text-base transition-opacity ${
                currentItem.agent === a.name ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {a.emoji}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
