'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, X, Zap, Search, ExternalLink } from 'lucide-react';
import { VideoTip } from '@/components/app/VideoTip';
import { intCategories } from '@/lib/data/integration-categories';
import { useAction } from 'next-safe-action/hooks';
import { toggleIntegrationAction } from '@/actions/integrations/toggleIntegrationAction';
import { toast } from 'sonner';
import { route } from '@/lib/route';
import type { Integration } from '@/generated/prisma/client';

type ConnectedInfo = {
  slug: string;
  teamName?: string | null;
};

const categoryCapabilities: Record<string, string> = {
  crm: 'View and update contacts, track deals, log activities, sync lead data from outreach campaigns, and generate pipeline reports.',
  ads: 'Create ad campaigns, monitor performance metrics, adjust budgets, A/B test creatives, and generate ROI reports.',
  chat: 'Send and receive messages, get notifications for approvals, chat with your AI team on the go, and share files.',
  ecommerce:
    'Manage products and inventory, process orders, track shipping, generate sales reports, and optimize listings.',
  ai: 'Use this AI model for specific agent tasks, route complex queries, and balance cost vs. quality for different workloads.',
  docs: 'Store generated documents, collaborate on files, sync folders, and organize your business knowledge base.',
  email:
    'Send emails, manage campaigns, track opens and clicks, segment audiences, and automate follow-up sequences.',
  social:
    'Schedule and publish posts, track engagement metrics, respond to comments, and analyze what content performs best.',
  productivity:
    'Manage calendars, schedule meetings, track tasks and projects, and automate repetitive workflows.',
  analytics:
    'Track website traffic, user behavior, conversions, and generate easy-to-read performance dashboards.',
  suppliers:
    'Browse supplier catalogs, import products to your store, track orders, and sync inventory levels.',
};

export const Integrations = ({
  integrations,
  connectedInfo: initialConnectedInfo,
}: {
  integrations: Integration[];
  connectedInfo: ConnectedInfo[];
}) => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  const [connectedInfo, setConnectedInfo] =
    useState<ConnectedInfo[]>(initialConnectedInfo);

  const connected = connectedInfo.map((c) => c.slug);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauth = params.get('oauth');
    if (oauth === 'success') {
      toast.success('Slack connected successfully!');
      window.history.replaceState({}, '', '/integrations');
    } else if (oauth === 'error') {
      const reason = params.get('reason');
      const messages: Record<string, string> = {
        denied: 'You declined the authorization request.',
        missing_params: 'Missing required parameters from Slack.',
        invalid_state: 'Invalid security token. Please try again.',
        token_exchange_failed: 'Failed to exchange authorization code.',
        server_error: 'An unexpected error occurred. Please try again.',
      };
      toast.error(messages[reason ?? ''] ?? 'Failed to connect to Slack.');
      window.history.replaceState({}, '', '/integrations');
    }
  }, []);

  const { execute, isPending } = useAction(toggleIntegrationAction, {
    onSuccess: () => {
      toast.success('Integration updated!');
    },
    onError: () => {
      toast.error('Failed to update integration');
    },
  });

  const toggleConnect = (slug: string) => {
    // Optimistic update
    if (connected.includes(slug)) {
      setConnectedInfo((prev) => prev.filter((c) => c.slug !== slug));
    } else {
      setConnectedInfo((prev) => [...prev, { slug }]);
    }
    execute({ integrationSlug: slug });
    setModalSlug(null);
  };

  const handleConnect = (integ: Integration) => {
    if (integ.authType === 'oauth') {
      window.location.href = route('slack.oauth.start');
    } else {
      toggleConnect(integ.slug);
    }
  };

  const handleDisconnect = (integ: Integration) => {
    if (integ.authType === 'oauth') {
      const confirmed = confirm(
        "Disconnecting will revoke access. You'll need to re-authorize to reconnect."
      );
      if (!confirmed) return;
    }
    toggleConnect(integ.slug);
  };

  const filtered = integrations.filter((i) => {
    const matchCat = category === 'all' || i.category === category;
    const matchSearch =
      !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const modalInteg = modalSlug
    ? integrations.find((i) => i.slug === modalSlug)
    : null;

  const getTeamName = (slug: string) =>
    connectedInfo.find((c) => c.slug === slug)?.teamName;

  return (
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
          Integrations
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  These are apps and tools your AI team can connect to. When you
                  link a tool, your agents can work with your real data!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Connect your favorite tools so your AI team can work with them. One
          click to connect.
        </p>
        <div className="mt-2">
          <VideoTip title="How to connect a tool" duration="30 sec" />
        </div>
      </div>

      {/* Search + counts */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search tools... (e.g. Shopify, Gmail, HubSpot)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-card py-3 pl-10 pr-4 text-[15px] outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-2">
          <span className="text-sm font-bold text-success">
            {connected.length}
          </span>
          <span className="text-[13px] text-muted-foreground">Connected</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-4 py-2">
          <span className="text-sm font-bold text-primary">
            {integrations.length}
          </span>
          <span className="text-[13px] text-muted-foreground">Available</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1">
        {intCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`whitespace-nowrap rounded-lg border px-3.5 py-2 text-[13px] transition-colors ${
              category === cat.id
                ? 'border-primary/30 bg-primary/15 font-bold text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Popular section */}
      {category === 'all' && !search && (
        <div className="mb-7">
          <h3 className="mb-3.5 flex items-center gap-2 text-base font-bold">
            <span className="text-warning">&#11088;</span> Popular &
            Recommended
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {integrations
              .filter((i) => i.popular)
              .slice(0, 9)
              .map((integ) => {
                const isConn = connected.includes(integ.slug);
                const teamName = getTeamName(integ.slug);
                return (
                  <Card
                    key={integ.slug}
                    className="cursor-pointer hover:border-primary/30"
                    onClick={() => !isConn && setModalSlug(integ.slug)}
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg border bg-primary/5 text-[22px]">
                          {integ.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold">{integ.name}</div>
                          <div className="text-[11px] capitalize text-muted-foreground">
                            {integ.category}
                          </div>
                        </div>
                        {isConn ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <Badge
                              variant="outline"
                              className="border-success/30 text-success"
                            >
                              Connected
                            </Badge>
                            {teamName && (
                              <span className="text-[10px] text-muted-foreground">
                                {teamName}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalSlug(integ.slug);
                            }}
                          >
                            + Add
                          </Button>
                        )}
                      </div>
                      <div className="text-xs leading-relaxed text-muted-foreground">
                        {integ.description}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* All integrations */}
      <div>
        <h3 className="mb-3.5 text-base font-bold">
          {search
            ? `Search results for "${search}"`
            : category !== 'all'
              ? `${intCategories.find((c) => c.id === category)?.label} (${filtered.length})`
              : 'All Integrations'}
        </h3>
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-3 text-5xl">&#128269;</div>
              <div className="mb-1 text-base font-semibold">
                No tools found
              </div>
              <div className="text-sm text-muted-foreground">
                Try a different search or category.
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((integ) => {
            const isConn = connected.includes(integ.slug);
            const teamName = getTeamName(integ.slug);
            return (
              <Card key={integ.slug}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-lg border text-2xl ${
                      isConn ? 'border-success/20 bg-success/5' : 'bg-primary/5'
                    }`}
                  >
                    {integ.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="text-sm font-bold">{integ.name}</span>
                      {integ.popular && (
                        <span className="rounded bg-warning/15 px-1.5 py-px text-[10px] font-semibold text-warning">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="text-xs leading-relaxed text-muted-foreground">
                      {integ.description}
                    </div>
                  </div>
                  <div className="ml-2 shrink-0">
                    {isConn ? (
                      <div className="flex flex-col items-center gap-1">
                        <Badge
                          variant="outline"
                          className="border-success/30 text-success"
                        >
                          Connected
                        </Badge>
                        {teamName && (
                          <span className="text-[10px] text-muted-foreground">
                            {teamName}
                          </span>
                        )}
                        <button
                          onClick={() => handleDisconnect(integ)}
                          className="text-[11px] text-destructive"
                          disabled={isPending}
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setModalSlug(integ.slug)}
                      >
                        + Add
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Connection Modal */}
      {modalInteg && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setModalSlug(null)}
          />
          <div className="relative w-full max-w-[480px] rounded-2xl border bg-card p-8 shadow-2xl">
            <button
              onClick={() => setModalSlug(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <div className="mb-5 flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl border bg-primary/5 text-[30px]">
                {modalInteg.icon}
              </div>
              <div>
                <h2 className="text-[22px] font-extrabold">
                  Connect {modalInteg.name}
                </h2>
                <div className="text-[13px] capitalize text-muted-foreground">
                  {modalInteg.category}
                </div>
              </div>
            </div>
            <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
              {modalInteg.description}
            </p>
            <div className="mb-5 rounded-lg border bg-background p-4">
              <div className="mb-2 text-sm font-semibold">
                What your AI team can do with {modalInteg.name}:
              </div>
              <div className="text-[13px] leading-relaxed text-muted-foreground">
                {categoryCapabilities[modalInteg.category] ||
                  "Connect this tool to enhance your AI team's capabilities."}
              </div>
            </div>
            {modalInteg.authType === 'oauth' && (
              <p className="mb-4 text-[13px] text-muted-foreground">
                <ExternalLink className="mr-1 inline size-3" />
                {"You'll be redirected to "}
                {modalInteg.name}
                {' to authorize access. We only request the permissions listed above.'}
              </p>
            )}
            <Button
              size="lg"
              className="w-full"
              onClick={() => handleConnect(modalInteg)}
              disabled={isPending}
            >
              <Zap className="mr-2 size-4" />
              {modalInteg.authType === 'oauth'
                ? `Connect to ${modalInteg.name}`
                : `Connect ${modalInteg.name}`}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              You can disconnect anytime from Settings. Your data stays safe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
