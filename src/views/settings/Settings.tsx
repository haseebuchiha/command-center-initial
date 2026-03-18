'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';
import type { Prisma } from '@/generated/prisma/client';

type ConnectedTool = Prisma.UserIntegrationGetPayload<{
  include: { integration: true };
}>;

const notifications = [
  'Email me when an agent needs approval',
  'Daily brief every morning at 7 AM',
  'Weekly performance summary',
  'Community auto-posts on my behalf',
];

export const Settings = ({
  userName,
  connectedTools,
}: {
  userName: string;
  connectedTools: ConnectedTool[];
}) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold">Settings</h1>
        <p className="text-[15px] text-muted-foreground">
          Manage your business profile, brand, notifications, and connected
          tools.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Brand Settings */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-bold">🎨 Brand Settings</h3>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold">
                Business Name
              </label>
              <input
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                defaultValue={userName}
                readOnly
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Logo</label>
              <div className="cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50">
                <Upload className="mx-auto size-6 text-muted-foreground" />
                <div className="mt-2 text-sm text-muted-foreground">
                  Drag & drop your logo here, or click to browse
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG, SVG, or WebP
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-bold">🔔 Notifications</h3>
            {notifications.map((n, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-2.5 ${
                  i < notifications.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="text-sm">{n}</span>
                <Switch defaultChecked={i < 3} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Connected Tools */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">🔌 Connected Tools</h3>
              <Button size="sm" onClick={() => router.push('/integrations')}>
                + Add New Tool
              </Button>
            </div>
            {connectedTools.length === 0 ? (
              <div className="py-5 text-center">
                <div className="mb-2 text-[32px]">🔌</div>
                <div className="mb-3 text-sm text-muted-foreground">
                  No tools connected yet.
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push('/integrations')}
                >
                  Browse Integrations
                </Button>
              </div>
            ) : (
              <>
                {connectedTools.map((ct, i) => (
                  <div
                    key={ct.id}
                    className={`flex items-center justify-between py-2.5 ${
                      i < connectedTools.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{ct.integration.icon}</span>
                      <div>
                        <span className="text-sm font-medium">
                          {ct.integration.name}
                        </span>
                        <div className="text-[11px] capitalize text-muted-foreground">
                          {ct.integration.category}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-success/30 text-success"
                    >
                      Connected
                    </Badge>
                  </div>
                ))}
                <div className="mt-3 text-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/integrations')}
                  >
                    Browse All Integrations
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-base font-bold">🌗 Appearance</h3>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-semibold">Dark Mode</div>
                <div className="text-xs text-muted-foreground">
                  Currently: {theme === 'dark' ? 'Dark' : 'Light'}
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) =>
                  setTheme(checked ? 'dark' : 'light')
                }
              />
            </div>
            <div className="mt-4">
              <div className="mb-3 text-sm font-semibold">
                Usage This Month
              </div>
              <div className="mb-1.5 flex justify-between">
                <span className="text-[13px] text-muted-foreground">
                  AI Actions Used
                </span>
                <span className="text-[13px] font-semibold">
                  1,847 / 5,000
                </span>
              </div>
              <Progress value={37} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
