'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/generated/prisma/client';
import { sidebarItems } from '@/lib/data/sidebar';
import { routes } from '@/lib/routes';
import {
  Home,
  Users,
  CheckCircle,
  LayoutGrid,
  Globe,
  FileText,
  BarChart2,
  Briefcase,
  Rocket,
  Settings,
  LogOut,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAction } from 'next-safe-action/hooks';
import { logout } from '@/actions/auth/logout';
import { useRouter } from '@bprogress/next/app';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Users,
  CheckCircle,
  LayoutGrid,
  Globe,
  FileText,
  BarChart2,
  Briefcase,
  Rocket,
  Settings,
};

export const AppSidebar = ({
  user,
  onNavigate,
}: {
  user: User;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { execute: executeLogout } = useAction(logout, {
    onSuccess: () => router.push('/login'),
    onError: () => router.push('/login'),
  });

  const getRoutePath = (id: string) => {
    const key = id as keyof typeof routes;
    return routes[key] || '/dashboard';
  };

  return (
    <div className="flex h-dvh w-60 flex-col border-r bg-background">
      {/* Logo */}
      <div className="border-b px-5 py-4">
        <div className="text-xl font-extrabold">
          <span className="text-accent">Launch</span>
          <span className="text-primary">Based</span>
        </div>
      </div>

      {/* Nav items */}
      <ScrollArea className="flex-1 px-2 py-3">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.iconName];
          const href = getRoutePath(item.id);
          const isActive = pathname === href;

          return (
            <Link
              key={item.id}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 mb-0.5 text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {Icon && <Icon className="size-5" />}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-destructive px-2 py-px text-xs font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </ScrollArea>

      {/* Profile */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
            {user.name[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{user.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {user.email}
            </div>
          </div>
          <button
            onClick={() => executeLogout()}
            className="text-muted-foreground hover:text-destructive transition-colors"
            title="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
