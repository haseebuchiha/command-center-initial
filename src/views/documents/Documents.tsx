import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const documents = [
  {
    title: '10 Ways to Grow Your Small Business in 2026',
    agent: 'Emma',
    type: 'Blog Post',
    date: 'Today',
    icon: '\u{1F4DD}',
  },
  {
    title: 'Weekly Performance Report',
    agent: 'Ethan',
    type: 'Report',
    date: 'Today',
    icon: '\u{1F4CA}',
  },
  {
    title: 'Instagram Content Calendar - March',
    agent: 'Ava',
    type: 'Social Media Plan',
    date: 'Yesterday',
    icon: '\u{1F4C5}',
  },
  {
    title: 'Competitor Pricing Analysis',
    agent: 'James',
    type: 'Research',
    date: 'Yesterday',
    icon: '\u{1F50D}',
  },
  {
    title: 'Welcome Email Sequence (3 emails)',
    agent: 'Olivia',
    type: 'Email Campaign',
    date: '2 days ago',
    icon: '\u{1F4E7}',
  },
  {
    title: 'SEO Keyword Report',
    agent: 'Liam',
    type: 'SEO Report',
    date: '3 days ago',
    icon: '\u{1F4C8}',
  },
];

export const Documents = () => (
  <div>
    <div className="mb-7">
      <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
        Documents
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-4 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                This is your content library. Every blog post, email, report,
                and social media plan your AI team creates ends up here. Tap
                &apos;View&apos; to read or download.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h1>
      <p className="text-[15px] text-muted-foreground">
        Everything your AI team has created — blog posts, emails, reports, and
        more.
      </p>
    </div>
    {documents.map((doc, i) => (
      <Card key={i} className="mb-2.5">
        <CardContent className="flex items-center gap-3.5 px-5 py-3.5">
          <span className="text-2xl">{doc.icon}</span>
          <div className="flex-1">
            <div className="text-[15px] font-semibold">{doc.title}</div>
            <div className="text-[13px] text-muted-foreground">
              By {doc.agent} &bull; {doc.type} &bull; {doc.date}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
);
