'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CheckCircle, Settings } from 'lucide-react';

const tabs = [
  { id: 'dashboard', href: '/dashboard', icon: Home, label: 'Home' },
  { id: 'agents', href: '/agents', icon: Users, label: 'Team' },
  {
    id: 'approvals',
    href: '/approvals',
    icon: CheckCircle,
    label: 'Approvals',
  },
  { id: 'settings', href: '/settings', icon: Settings, label: 'Settings' },
];

export const AppMobileNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex shrink-0 border-t bg-background pb-[env(safe-area-inset-bottom,0px)]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <tab.icon className="size-5" />
            <span className={`text-[11px] ${isActive ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
