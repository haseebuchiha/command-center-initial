'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { User } from '@/generated/prisma/client';
import { AppSidebar } from './AppSidebar';
import { AppTopBar } from './AppTopBar';
import { AppMobileNav } from './AppMobileNav';
import { HelpChat } from './HelpChat';
import { Confetti } from './Confetti';
import { GuidedTour } from './GuidedTour';
import { useCommandCenterStore } from '@/lib/stores/command-center-store';
import { tourSteps } from '@/lib/data/tour-steps';

const pathToPageKey: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/agents': 'agents',
  '/approvals': 'approvals',
  '/integrations': 'integrations',
};

export const AppShell = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const confetti = useCommandCenterStore((s) => s.confetti);
  const visitedPages = useCommandCenterStore((s) => s.visitedPages);
  const markPageVisited = useCommandCenterStore((s) => s.markPageVisited);

  const pageKey = pathToPageKey[pathname];
  const shouldShowTour =
    pageKey != null &&
    !visitedPages.includes(pageKey) &&
    tourSteps[pageKey] != null;

  const handleCloseTour = () => {
    if (pageKey) {
      markPageVisited(pageKey);
    }
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <Confetti show={confetti} />

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={`${
          mobileSidebarOpen
            ? 'fixed inset-y-0 left-0 z-[999]'
            : 'hidden'
        } md:relative md:block`}
      >
        <AppSidebar
          user={user}
          onNavigate={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <AppTopBar onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-7">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <div className="md:hidden">
          <AppMobileNav />
        </div>
      </div>

      {/* Floating help chat */}
      <HelpChat />

      {/* Guided tour on first visit */}
      {shouldShowTour && pageKey && (
        <GuidedTour steps={tourSteps[pageKey]} onClose={handleCloseTour} />
      )}
    </div>
  );
};
