'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Bell, Menu, Sun, Moon } from 'lucide-react';
import { sidebarItems } from '@/lib/data/sidebar';
import { routes } from '@/lib/routes';
import { Button } from '@/components/ui/button';

export const AppTopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const getPageTitle = () => {
    for (const item of sidebarItems) {
      const routePath = routes[item.id as keyof typeof routes];
      if (routePath && pathname === routePath) {
        return item.label;
      }
    }
    return 'Dashboard';
  };

  return (
    <div className="flex shrink-0 items-center justify-between border-b bg-background px-6 py-3">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>
        <h2 className="text-lg font-bold">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
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
  );
};
