'use client';

import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NextActionCard = ({
  onboardProgress,
  connectedToolsCount,
}: {
  onboardProgress: number;
  connectedToolsCount: number;
}) => {
  const router = useRouter();

  let suggestion: {
    emoji: string;
    text: string;
    action: string;
    target: string;
  } | null = null;

  if (onboardProgress < 100) {
    suggestion = {
      emoji: '📋',
      text: "You haven't finished setting up yet! Complete your checklist to unlock your full AI team.",
      action: 'Finish Setup',
      target: '/onboarding',
    };
  } else if (connectedToolsCount < 3) {
    suggestion = {
      emoji: '🔌',
      text: 'Your AI team works better with more tools connected. Try adding Instagram or Shopify!',
      action: 'Connect Tools',
      target: '/integrations',
    };
  } else {
    suggestion = {
      emoji: '⏳',
      text: 'You have 2 items waiting for your review. Approve them so your agents can keep working!',
      action: 'Review Now',
      target: '/approvals',
    };
  }

  if (!suggestion) return null;

  return (
    <div className="mb-5 rounded-xl border border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5 px-5 py-4">
      <div className="mb-2 flex items-center gap-2">
        <Zap className="size-4 fill-accent text-accent" />
        <span className="text-sm font-bold text-accent">
          What should I do next?
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-2xl">{suggestion.emoji}</span>
        <div className="min-w-[200px] flex-1">
          <p className="text-sm leading-relaxed">{suggestion.text}</p>
        </div>
        <Button
          variant="accent"
          size="sm"
          onClick={() => router.push(suggestion.target)}
        >
          {suggestion.action}
        </Button>
      </div>
    </div>
  );
};
