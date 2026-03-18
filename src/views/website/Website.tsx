import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, Globe, Send } from 'lucide-react';
import { VideoTip } from '@/components/app/VideoTip';

export const Website = ({ userName }: { userName: string }) => {
  const slug = userName.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <div className="mb-7">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold">
          My Website
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  We built a website for your business automatically! You can
                  view it, edit it, or connect your own domain name here.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Your website is live! Here&apos;s where you can manage it.
        </p>
        <div className="mt-2">
          <VideoTip title="Managing your website" duration="45 sec" />
        </div>
      </div>

      {/* URL Card */}
      <Card className="mb-5">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-6">
          <div>
            <div className="mb-1 text-[13px] text-muted-foreground">
              Your website URL
            </div>
            <div className="text-lg font-bold text-primary">
              lb-{slug}.ondigitalocean.app
            </div>
          </div>
          <div className="flex gap-2.5">
            <Button size="sm">
              <Globe className="mr-1.5 size-4" />
              Visit Website
            </Button>
            <Button variant="secondary" size="sm">
              <Send className="mr-1.5 size-4" />
              Share Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit / Domain cards */}
      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-3 text-base font-bold">
              📝 Edit Website Content
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Change text, swap images, or add new sections. Or just ask Emma
              (your content writer) to update it for you!
            </p>
            <Button size="sm" className="w-full">
              Open Editor
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-3 text-base font-bold">
              🌐 Connect Custom Domain
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Use your own domain name like www.yourbusiness.com instead of the
              default URL.
            </p>
            <Button variant="accent" size="sm" className="w-full">
              Set Up My Domain
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Domain Setup */}
      <Card className="border-accent/30">
        <CardContent className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Globe className="size-5" />
            Connect Your Domain
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="size-4 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Type the domain name you bought from GoDaddy, Namecheap, or
                    any other provider. Don&apos;t include https:// or www.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>

          <div className="mb-3">
            <label className="mb-2 block text-sm font-semibold">
              Your Domain Name
            </label>
            <input
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="yourbusiness.com"
              readOnly
            />
          </div>
          <Button>Check Domain</Button>

          <div className="mt-5 rounded-lg border bg-background p-4">
            <div className="mb-3 text-sm font-semibold">
              After you enter your domain, we&apos;ll show you one simple step:
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              {[
                { label: 'Type', value: 'CNAME' },
                { label: 'Name / Host', value: 'www' },
                {
                  label: 'Points To',
                  value: `lb-${slug}.ondigitalocean.app`,
                },
                { label: 'TTL', value: 'Auto' },
              ].map((r, i) => (
                <div key={i} className="rounded-lg bg-muted p-2.5 text-center">
                  <div className="mb-1 text-[11px] text-muted-foreground">
                    {r.label}
                  </div>
                  <div className="break-all text-[13px] font-semibold text-primary">
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              We have video guides for GoDaddy, Namecheap, Cloudflare, and more.
              Just 60 seconds each!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
