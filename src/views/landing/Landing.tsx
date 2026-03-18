'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Sun, Moon, Star } from 'lucide-react';

const features = [
  {
    icon: '🌐',
    title: 'Website Built For You',
    desc: 'We build your professional website automatically. See a live preview before you sign up.',
  },
  {
    icon: '🤖',
    title: '8 AI Agents On Your Team',
    desc: 'A content writer, researcher, sales rep, SEO expert, and more — all working for your business.',
  },
  {
    icon: '📱',
    title: 'Manage From Your Phone',
    desc: 'Talk to your AI team from Discord, Slack, or text. Approve their work with one tap.',
  },
];

const starKeys = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5'];

export const Landing = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-[#0D1B3E] to-[#1A0B2E] text-foreground">
      {/* Nav */}
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-4 md:px-10 md:py-5">
        <div className="text-xl font-extrabold md:text-2xl">
          <span className="text-accent">Launch</span>
          <span className="text-primary">Based</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            asChild
          >
            <Link href="/order">Pricing</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
          >
            Book a Demo
          </Button>
          <Button size="sm" asChild>
            <Link href="/order">Get Started</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-[800px] px-4 pb-6 pt-10 text-center md:px-5 md:pb-10 md:pt-20">
        <div className="mb-4 inline-block rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold text-accent md:mb-6 md:text-sm">
          Your AI Team Is Ready To Work
        </div>
        <h1 className="mb-5 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-3xl font-extrabold leading-tight text-transparent md:text-6xl">
          Build Your Business With AI Agents That Work 24/7
        </h1>
        <p className="mb-8 text-base leading-relaxed text-muted-foreground md:text-xl">
          No coding. No tech skills. Just tell us about your business, and we
          set up a team of AI agents that builds your website, creates content,
          finds customers, and grows your business while you sleep.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/order">
              <Rocket className="mr-2 size-4" />
              Start Building My Business
            </Link>
          </Button>
          <Button variant="secondary" size="lg">
            Book a Free Demo Call
          </Button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-4 px-4 py-8 md:grid-cols-3 md:px-10 md:py-16">
        {features.map((f) => (
          <Card key={f.title} className="text-center">
            <CardContent className="p-8">
              <div className="mb-4 text-5xl">{f.icon}</div>
              <h3 className="mb-3 text-xl font-bold">{f.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Social proof */}
      <div className="px-5 pb-20 pt-10 text-center">
        <div className="mb-3 flex justify-center gap-1">
          {starKeys.map((key) => (
            <Star
              key={key}
              className="size-5 fill-yellow-500 text-yellow-500"
            />
          ))}
        </div>
        <p className="text-base text-muted-foreground">
          Join 2,000+ solopreneurs already building with LaunchBased
        </p>
      </div>
    </div>
  );
};
