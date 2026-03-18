import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, Clock } from 'lucide-react';

const briefItems = [
  {
    emoji: '\u{1F4C8}',
    title: 'Leads Update',
    text: "James found 7 new leads yesterday from LinkedIn outreach. 3 opened Olivia's follow-up emails. 1 booked a call!",
  },
  {
    emoji: '\u{270D}\u{FE0F}',
    title: 'Content Published',
    text: 'Emma published 2 blog posts and 4 social media posts yesterday. The Instagram carousel about spring tips got 142 likes.',
  },
  {
    emoji: '\u{1F50D}',
    title: 'Competitor Alert',
    text: 'James noticed your main competitor launched a 20% off sale. Want Olivia to create a matching promotion?',
  },
  {
    emoji: '\u{26A0}\u{FE0F}',
    title: 'Needs Your Attention',
    text: "2 items in your approval queue: Olivia's email campaign (12 leads) and Ava's Instagram posts for next week.",
  },
  {
    emoji: '\u{1F4B0}',
    title: 'Revenue',
    text: '3 new orders came in overnight totaling $247. Your monthly total is now $3,821.',
  },
];

export const DailyBrief = () => (
  <div>
    <div className="mb-7">
      <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
        Daily Brief {'\u2600\uFE0F'}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-4 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Ethan (your data analyst) creates this summary every morning. It
                tells you what happened yesterday and what to focus on today.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h1>
      <p className="text-[15px] text-muted-foreground">
        Your morning summary — everything you need to know to start your day.
      </p>
    </div>
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          March 14, 2026 &bull; Generated at 7:00 AM
        </div>
        {briefItems.map((item, i) => (
          <div key={i} className="mb-3 rounded-lg border bg-background p-4">
            <div className="mb-1.5 flex items-center gap-2.5">
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[15px] font-bold">{item.title}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);
