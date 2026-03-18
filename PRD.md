# PRD: LaunchBased Command Center Migration

## Overview

Migrate the LaunchBased Command Center from a 2,300-line monolithic JavaScript prototype into this AI-Ready architecture (MVC, TypeScript, Prisma, Shadcn UI, Tailwind v4, server actions).

**Source monolith**: `/Users/apple/Projects/dan-sasura/launchbased-command-center/app/LaunchBasedApp.jsx`
**Target project (this repo)**: `/Users/apple/Projects/dan-sasura/launchbased-command-center-v2/`
**Architecture guide**: Read `CLAUDE.md` in this repo before every wave.

**Key Decisions**:
- Keep the existing auth system (login/register/password-reset)
- Dashboard pages are auth-gated; landing + order form are public
- Database from day one (Prisma models + seed data)
- Zustand for trivial UI-only state (visited pages, dismissed nudges, confetti)

---

## WAVE 1: Foundation

**Goal**: Install dependencies, configure dark mode theming, set up routes, configure deployment.

**Prerequisites**: Fresh repo already created with AI-Ready template as base.

### 1.1 Update package.json

Change name to `"launchbased-command-center"`. Install:
```bash
npm install recharts zustand
```

### 1.2 Add Shadcn UI components

```bash
npx shadcn@latest add badge progress tabs card tooltip avatar separator switch scroll-area
```

This adds to the existing: button, calendar, checkbox, command, dialog, dropdown-menu, form, input, label, pagination, popover, select, sheet, sonner, textarea.

### 1.3 Wire dark mode

**Modify `src/app/layout.tsx`**:

The current layout has `NuqsAdapter`, `BProgressProvider`, `Header`, and `Toaster`. Wrap with `ThemeProvider` from `next-themes` (already installed). Remove the existing `<Header />` — it will be replaced by the app shell layout in Wave 3.

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { BProgressProvider } from '@/components/BProgressProvider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LaunchBased - Command Center',
  description: 'AI Agent Teams Made Easy for Solopreneurs',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NuqsAdapter>
            <BProgressProvider>
              {children}
              <Toaster />
            </BProgressProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 1.4 Customize theme colors

**Modify `src/app/globals.css`**. Replace the `:root` and `.dark` blocks with the Command Center's blue/purple palette. Keep the `@import`, `@custom-variant`, and `@theme inline` blocks unchanged. Convert hex values to oklch.

The source monolith uses these colors:
- Dark: bg=#0B1120, bgCard=#111B2E, primary=#3B82F6, accent=#8B5CF6, success=#22C55E, warning=#F59E0B, error=#EF4444, border=#1E2D47, text=#F0F4FF, textSec=#A8B8D8, textMuted=#7B8FB5
- Light: bg=#F8FAFF, bgCard=#FFFFFF, primary=#2563EB, accent=#7C3AED, success=#16A34A, warning=#D97706, error=#DC2626, border=#E2E8F0, text=#0F172A, textSec=#475569, textMuted=#94A3B8

Map these to Shadcn CSS variables. Add custom `--success` and `--warning` variables.

Add custom keyframe animations after the `@layer base` block:
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

### 1.5 Configure deployment

**Modify `next.config.ts`**: Add `output: 'standalone'`.

**Create `.do/app.yaml`**:
```yaml
name: launchbased-command-center
region: nyc
services:
  - name: web
    github:
      branch: main
      deploy_on_push: true
    build_command: npm install && npx prisma generate && npm run build
    run_command: npm start
    http_port: 3000
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        scope: RUN_AND_BUILD_TIME
        type: SECRET
```

### 1.6 Update routes

**Modify `src/lib/routes.ts`**:
```ts
export const routes = {
  home: '/',
  'blobs.store': '/blobs',
  login: '/login',
  register: '/register',
  'password.request': '/password/reset',
  'password.reset': '/password/reset/:token',
  // Public pages
  landing: '/landing',
  'order.form': '/order',
  // Auth-gated app pages
  dashboard: '/dashboard',
  agents: '/agents',
  approvals: '/approvals',
  integrations: '/integrations',
  website: '/website',
  docs: '/documents',
  analytics: '/analytics',
  daily: '/daily-brief',
  onboarding: '/onboarding',
  settings: '/settings',
};
```

### 1.7 Extend Button variants

**Modify `src/components/ui/button.tsx`**: Add three new variants to the `buttonVariants` cva:
```ts
success: 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600',
warning: 'bg-amber-500 text-black shadow-xs hover:bg-amber-600',
accent: 'bg-violet-500 text-white shadow-xs hover:bg-violet-600',
```

### Wave 1 Verification
- `npm run typecheck` passes
- `npm run lint` passes
- `npm run dev` starts without errors
- Dark mode applies blue/purple palette
- All Shadcn components installed (check `src/components/ui/` for badge.tsx, progress.tsx, card.tsx, tooltip.tsx, etc.)

---

## WAVE 2: Database Schema + Data

**Goal**: Create Prisma models, seed script, TypeScript types, and static data files.

**Prerequisites**: Wave 1 complete.

### 2.1 Prisma schema

**Modify `prisma/schema.prisma`**: Add these models below the existing User, Session, PasswordReset models. Add the corresponding relation fields to the User model.

Models to add: Agent, Integration, UserIntegration, Approval, Document, OnboardStep, TokenUsage, DailyBrief, OrderSubmission.

**Agent** — the 8 AI team members:
```prisma
model Agent {
  id          String        @id @default(cuid())
  name        String
  role        String
  emoji       String
  status      String        @default("idle")
  task        String?
  progress    Int           @default(0)
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  approvals   Approval[]
  tokenUsages TokenUsage[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

**Integration** — the 71 available tools (global catalog, not per-user):
```prisma
model Integration {
  id               String            @id @default(cuid())
  slug             String            @unique
  name             String
  category         String
  icon             String
  description      String
  popular          Boolean           @default(false)
  userIntegrations UserIntegration[]
}
```

**UserIntegration** — which tools a user has connected:
```prisma
model UserIntegration {
  id            String      @id @default(cuid())
  userId        String
  integrationId String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  integration   Integration @relation(fields: [integrationId], references: [id], onDelete: Cascade)
  createdAt     DateTime    @default(now())

  @@unique([userId, integrationId])
}
```

**Approval**:
```prisma
model Approval {
  id        String   @id @default(cuid())
  agentId   String
  agent     Agent    @relation(fields: [agentId], references: [id], onDelete: Cascade)
  type      String
  title     String
  preview   String
  status    String   @default("pending")
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Document**:
```prisma
model Document {
  id        String   @id @default(cuid())
  title     String
  agentName String
  type      String
  icon      String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

**OnboardStep**:
```prisma
model OnboardStep {
  id        String  @id @default(cuid())
  label     String
  sortOrder Int
  done      Boolean @default(false)
  skippable Boolean @default(false)
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, sortOrder])
}
```

**TokenUsage**:
```prisma
model TokenUsage {
  id        String   @id @default(cuid())
  agentId   String
  agent     Agent    @relation(fields: [agentId], references: [id], onDelete: Cascade)
  tokens    Int
  date      DateTime @db.Date
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

**DailyBrief**:
```prisma
model DailyBrief {
  id        String   @id @default(cuid())
  emoji     String
  title     String
  text      String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date      DateTime @db.Date
  createdAt DateTime @default(now())
}
```

**OrderSubmission**:
```prisma
model OrderSubmission {
  id            String   @id @default(cuid())
  firstName     String
  lastName      String
  email         String
  phone         String?
  bizName       String
  bizDesc       String
  idealCustomer String?
  bizType       String
  industry      String?
  goals         String[]
  hasWebsite    Boolean  @default(false)
  currentUrl    String?
  revenueGoal   String?
  theme         String
  inspireUrls   String[]
  colors        String?
  createdAt     DateTime @default(now())
}
```

Add corresponding relation arrays to the User model:
```prisma
  agents           Agent[]
  userIntegrations UserIntegration[]
  approvals        Approval[]
  documents        Document[]
  onboardSteps     OnboardStep[]
  tokenUsages      TokenUsage[]
  dailyBriefs      DailyBrief[]
```

### 2.2 Seed script

**Create `prisma/seed.ts`**: Seed the Integration catalog with the 71 tools from the monolith (lines 646-716). Use upsert on slug.

The full integrations data (extract every entry from the monolith):
- Chat (5): discord, slack, telegram, whatsapp, teams
- CRM (6): hubspot, salesforce, pipedrive, zoho, freshsales, gohighlevel
- Ads (5): meta-ads, google-ads, tiktok-ads, linkedin-ads, pinterest-ads
- eCommerce (6): shopify, etsy, woocommerce, amazon, stripe, square
- AI (5): openai, anthropic, gemini, perplexity, mistral
- Docs (6): gdrive, onedrive, dropbox, notion, google-docs, google-sheets
- Email (6): gmail, outlook, mailchimp, convertkit, sendgrid, instantly
- Social (7): instagram, facebook, twitter, linkedin, youtube, tiktok, pinterest
- Productivity (6): gcal, calendly, trello, asana, zapier, make
- Analytics (3): ga4, hotjar, posthog
- Suppliers (3): printful, spocket, cj-drop

Copy each entry's `id`, `name`, `cat`, `icon`, `desc`, and `popular` from the monolith lines 646-716 verbatim.

Add `"prisma": { "seed": "npx tsx prisma/seed.ts" }` to package.json.
Install tsx as a dev dependency: `npm install -D tsx`

### 2.3 Types

**Create `src/types/command-center.ts`**: Types for data that isn't in the database:

```ts
export type ChartDataPoint = {
  name: string;
  leads: number;
  content: number;
  sales: number;
};

export type PieDataPoint = {
  name: string;
  value: number;
  color: string;
};

export type TokenUsageSummary = {
  plan: string;
  monthlyLimit: number;
  used: number;
  resetDate: string;
  byAgent: { name: string; emoji: string; tokens: number; color: string }[];
  daily: { day: string; tokens: number }[];
};

export type ActivityFeedItem = {
  agent: string;
  emoji: string;
  action: string;
  color: string;
  streamText: string;
  label: string;
};

export type CompletedFeedItem = ActivityFeedItem & {
  timestamp: string;
  id: number;
};

export type SidebarNavItem = {
  id: string;
  label: string;
  iconName: string;
  badge?: number;
};

export type HelpChatMessage = {
  from: 'user' | 'bot';
  text: string;
};

export type TourStep = {
  emoji: string;
  title: string;
  body: string;
};

export type IntegrationCategoryItem = {
  id: string;
  label: string;
  icon: string;
};

export type OrderFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bizName: string;
  bizDesc: string;
  idealCustomer: string;
  bizType: string;
  industry: string;
  goals: string[];
  hasWebsite: boolean;
  currentUrl: string;
  revenueGoal: string;
  theme: string;
  inspireUrls: string[];
  colors: string;
};
```

### 2.4 Static data files

These are UI-only constants that don't belong in the DB.

**Create `src/lib/data/charts.ts`**: Copy chartData and pieData verbatim from monolith lines 66-76.

**Create `src/lib/data/token-usage.ts`**: Copy tokenUsage object from monolith lines 79-96.

**Create `src/lib/data/activity-feed.ts`**: Copy the 7 activityFeedData entries from monolith lines 586-594. Each entry has: agent, emoji, action, color, streamText (long string), label.

**Create `src/lib/data/help-chat.ts`**: Copy quickReplies (lines 240-253) and botResponses (lines 255-292) objects.

**Create `src/lib/data/sidebar.ts`**: Convert sidebarItems (lines 744-755) to use lucide-react icon name strings instead of JSX:
```ts
export const sidebarItems: SidebarNavItem[] = [
  { id: 'dashboard', label: 'Command Center', iconName: 'Home' },
  { id: 'agents', label: 'Agent Office', iconName: 'Users' },
  { id: 'approvals', label: 'Approvals', iconName: 'CheckCircle', badge: 2 },
  { id: 'integrations', label: 'Integrations', iconName: 'LayoutGrid' },
  { id: 'website', label: 'My Website', iconName: 'Globe' },
  { id: 'docs', label: 'Documents', iconName: 'FileText' },
  { id: 'analytics', label: 'Analytics', iconName: 'BarChart2' },
  { id: 'daily', label: 'Daily Brief', iconName: 'Briefcase' },
  { id: 'onboarding', label: 'Setup Guide', iconName: 'Rocket' },
  { id: 'settings', label: 'Settings', iconName: 'Settings' },
];
```

**Create `src/lib/data/tour-steps.ts`**: Copy tourSteps (lines 782-802) and agentStatusMessages (lines 804-814).

**Create `src/lib/data/integration-categories.ts`**: Copy intCategories (lines 718-731).

### Wave 2 Verification
- `npx prisma generate` succeeds
- `npx prisma migrate dev --name init` creates all tables
- `npx prisma db seed` seeds 71 integrations
- `npm run typecheck` passes
- All data files export typed constants

---

## WAVE 3: Layout System

**Goal**: Create public and app shell layouts, sidebar, top bar, mobile nav, and help chat.

**Prerequisites**: Wave 2 complete. Read `CLAUDE.md` for the Controller/View pattern.

### 3.1 Public layout group

**Create `src/app/(public)/layout.tsx`**:
```tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh">{children}</div>;
}
```

Move the existing auth routes (login, register, password/*) into `(public)/` if desired, or leave them at root level.

### 3.2 App shell layout (auth-gated)

**Create `src/app/(app)/layout.tsx`**:
```tsx
import { UserAuth } from '@/services/UserAuth';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app/AppShell';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  return <AppShell user={user}>{children}</AppShell>;
}
```

### 3.3 AppShell component

**Create `src/components/app/AppShell.tsx`** — `"use client"` component that contains sidebar + topbar + mobile nav + help chat. Port the layout structure from monolith lines 2173-2298.

Key conversions:
- `setPage("dashboard")` → `<Link href="/dashboard">`
- `isDark`/`setIsDark` → `useTheme()` from next-themes
- `isMobile` with resize listener → Tailwind responsive classes (`md:flex hidden`)
- `<Icons.Home />` inline SVG → `<Home className="size-5" />` from lucide-react
- `page === item.id` active check → `usePathname() === route(item.id)`

Icon mapping (all 25 icons have direct lucide-react equivalents):
| Source | lucide-react |
|--------|-------------|
| Icons.Sun | Sun |
| Icons.Moon | Moon |
| Icons.Home | Home |
| Icons.Users | Users |
| Icons.Check | CheckCircle |
| Icons.Chat | MessageSquare |
| Icons.Settings | Settings |
| Icons.Briefcase | Briefcase |
| Icons.Globe | Globe |
| Icons.Layout | LayoutGrid |
| Icons.File | FileText |
| Icons.BarChart2 | BarChart2 |
| Icons.Bell | Bell |
| Icons.Info | Info |
| Icons.ChevronRight | ChevronRight |
| Icons.Rocket | Rocket |
| Icons.Star | Star |
| Icons.ArrowLeft | ArrowLeft |
| Icons.Upload | Upload |
| Icons.Zap | Zap |
| Icons.Clock | Clock |
| Icons.Send | Send |
| Icons.X | X |
| Icons.Menu | Menu |

Sub-components to create:
- `src/components/app/AppSidebar.tsx` — port lines 2182-2233
- `src/components/app/AppTopBar.tsx` — port lines 2238-2260
- `src/components/app/AppMobileNav.tsx` — port lines 2268-2290
- `src/components/app/HelpChat.tsx` — port lines 232-397 (self-contained, uses help-chat data)

Inline style → Tailwind conversion patterns:
```
padding: "20px 40px"           → className="px-10 py-5"
display: "flex", gap: 12       → className="flex gap-3"
fontSize: isMobile ? 28 : 56   → className="text-3xl md:text-6xl"
gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)" → className="grid grid-cols-1 md:grid-cols-3"
color: t.text                  → className="text-foreground"
color: t.textSec               → className="text-muted-foreground"
background: t.bgCard           → className="bg-card"
border: `1px solid ${t.border}` → className="border"
background: `${t.primary}15`   → className="bg-primary/10"
```

### 3.4 Zustand store

**Create `src/lib/stores/command-center-store.ts`**:
```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CommandCenterStore = {
  visitedPages: string[];
  markPageVisited: (page: string) => void;
  dismissedNudges: string[];
  dismissNudge: (id: string) => void;
  confetti: boolean;
  triggerConfetti: () => void;
};

export const useCommandCenterStore = create<CommandCenterStore>()(
  persist(
    (set) => ({
      visitedPages: [],
      markPageVisited: (page) =>
        set((state) => ({
          visitedPages: state.visitedPages.includes(page)
            ? state.visitedPages
            : [...state.visitedPages, page],
        })),
      dismissedNudges: [],
      dismissNudge: (id) =>
        set((state) => ({
          dismissedNudges: [...state.dismissedNudges, id],
        })),
      confetti: false,
      triggerConfetti: () => {
        set({ confetti: true });
        setTimeout(() => set({ confetti: false }), 4000);
      },
    }),
    { name: 'launchbased-ui' }
  )
);
```

### Wave 3 Verification
- Navigate to `/dashboard` without login → redirects to `/login`
- Register a user, login → see app shell with sidebar, top bar
- Sidebar links navigate between pages (pages show 404 for now — that's expected)
- Dark/light toggle works via next-themes
- Mobile view shows bottom nav, hamburger toggles sidebar
- Help chat bubble appears and opens

---

## WAVE 4: Shared Components

**Goal**: Build the 7 custom components that have no Shadcn equivalent.

**Prerequisites**: Wave 3 complete.

### 4.1 Confetti

**Create `src/components/app/Confetti.tsx`** — port lines 523-541. Pure CSS animation, `"use client"`.

```tsx
'use client';

export const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null;
  const colors = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute -top-5"
          style={{
            left: `${Math.random() * 100}%`,
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            background: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${2 + Math.random() * 3}s ease-in forwards`,
            animationDelay: `${Math.random()}s`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
};
```

### 4.2 GuidedTour

**Create `src/components/app/GuidedTour.tsx`** — port lines 400-431. Use Shadcn Dialog for the overlay. Uses `TourStep` type, `Button`, `Progress`.

### 4.3 NudgeBanner

**Create `src/components/app/NudgeBanner.tsx`** — port lines 434-449. Simple banner with gradient background, action button, dismiss button.

### 4.4 VideoTip

**Create `src/components/app/VideoTip.tsx`** — port lines 452-465. Small inline component with play icon.

### 4.5 NextActionCard

**Create `src/components/app/NextActionCard.tsx`** — port lines 468-497. Uses `useRouter()` instead of `setPage()`. Determines suggestion based on onboarding progress and connected tools count.

### 4.6 MilestoneMsg

**Create `src/components/app/MilestoneMsg.tsx`** — port lines 500-508.

### 4.7 FriendlyError

**Create `src/components/app/FriendlyError.tsx`** — port lines 511-520.

### Wave 4 Verification
- `npm run typecheck` passes
- Each component renders when imported into a test page
- Confetti animates and disappears after 4 seconds
- GuidedTour shows steps with navigation

---

## WAVE 5: Simple + Medium Pages

**Goal**: Build 10 pages: Documents, Daily Brief, Analytics, Website, Settings, Onboarding, Approvals, Agent Office, Landing, Order Form.

**Prerequisites**: Wave 4 complete.

Each page follows the MVC pattern from CLAUDE.md:
- **Route**: `src/app/(app)/{slug}/page.tsx` — thin file exporting controller
- **Controller**: `src/controllers/{Name}Controller.tsx` — async server component fetching data from Prisma
- **View**: `src/views/{name}/{Name}.tsx` — React component rendering UI

### 5.1 Documents Page

**Route**: `src/app/(app)/documents/page.tsx`
**Controller**: `src/controllers/DocumentsController.tsx` — fetch documents for current user
**View**: `src/views/documents/Documents.tsx`

Port from monolith lines 1807-1833. Lists document cards with icon, title, agent, type, date. Uses `Card`, `Badge`, `Button`.

### 5.2 Daily Brief Page

**Route**: `src/app/(app)/daily-brief/page.tsx`
**Controller**: `src/controllers/DailyBriefController.tsx` — fetch daily briefs for current user
**View**: `src/views/daily-brief/DailyBrief.tsx`

Port from monolith lines 1775-1802. Five sections with emoji, title, text inside a Card.

### 5.3 Analytics Page

**Route**: `src/app/(app)/analytics/page.tsx`
**Controller**: `src/controllers/AnalyticsController.tsx`
**View**: `src/views/analytics/Analytics.tsx` — `"use client"` (recharts requires it)

Port from monolith lines 1730-1770. Two charts side-by-side: LineChart (weekly activity) and PieChart (agent workload). Import chart data from `@/lib/data/charts`.

recharts imports needed:
```tsx
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
```

### 5.4 Website Page

**Route**: `src/app/(app)/website/page.tsx`
**Controller**: `src/controllers/WebsiteController.tsx` — fetch user for business name
**View**: `src/views/website/Website.tsx`

Port from monolith lines 1661-1725. Shows website URL, edit/domain cards, CNAME setup instructions.

### 5.5 Settings Page

**Route**: `src/app/(app)/settings/page.tsx`
**Controller**: `src/controllers/SettingsController.tsx` — fetch user, connected integrations
**View**: `src/views/settings/Settings.tsx` — `"use client"` (theme toggle, switches)

Port from monolith lines 2032-2140. Four cards in 2x2 grid: Brand Settings, Notifications, Connected Tools, Appearance.

Uses `useTheme()` for dark mode toggle. Connected tools fetched from UserIntegration + Integration join.

### 5.6 Onboarding Page

**Route**: `src/app/(app)/onboarding/page.tsx`
**Controller**: `src/controllers/OnboardingController.tsx` — fetch OnboardSteps for user
**View**: `src/views/onboarding/Onboarding.tsx` — `"use client"`

**Server action**: `src/actions/onboarding/completeStepAction.ts` — marks step as done

Port from monolith lines 1097-1156. Progress card, step list with complete/skip buttons, completion celebration.

### 5.7 Approvals Page

**Route**: `src/app/(app)/approvals/page.tsx`
**Controller**: `src/controllers/ApprovalsController.tsx` — fetch Approvals with Agent relation
**View**: `src/views/approvals/Approvals.tsx` — `"use client"`

**Server action**: `src/actions/approvals/updateApprovalAction.ts` — approve/revise/block

Port from monolith lines 1614-1656. Approval cards with preview, badge, action buttons.

### 5.8 Agent Office Page

**Route**: `src/app/(app)/agents/page.tsx`
**Controller**: `src/controllers/AgentsController.tsx` — fetch Agents for user, group by status
**View**: `src/views/agents/AgentOffice.tsx` — `"use client"`

Port from monolith lines 1549-1609. Three groups: Working, Needs Approval, Idle. Each agent card shows emoji, name, role, status badge, task, progress bar.

### 5.9 Landing Page (public)

**Route**: `src/app/(public)/landing/page.tsx`
**Controller**: `src/controllers/LandingController.tsx`
**View**: `src/views/landing/Landing.tsx` — `"use client"` (theme toggle)

Port from monolith lines 819-876. Hero with gradient text, 3 feature cards, social proof stars.

### 5.10 Order Form Page (public)

**Route**: `src/app/(public)/order/page.tsx`
**Controller**: `src/controllers/OrderController.tsx`
**View**: `src/views/order/OrderForm.tsx` — `"use client"`

**Validators**:
- `src/validators/order/orderFormValidator.ts` — Zod schema for client
- `src/validators/order/orderValidator.ts` — server validator with transforms

**Server action**: `src/actions/order/submitOrderAction.ts` — saves to OrderSubmission

Port from monolith lines 881-1092. Multi-step form: About You, Your Business, Your Goals, Design Style, Preview.

Step sub-components:
- `src/views/order/steps/AboutYou.tsx`
- `src/views/order/steps/YourBusiness.tsx`
- `src/views/order/steps/YourGoals.tsx`
- `src/views/order/steps/DesignStyle.tsx`
- `src/views/order/steps/Preview.tsx`

### Wave 5 Verification
- All 10 pages render and display correct content
- Navigation between all pages works
- Landing and order form accessible without login
- Order form saves to database on submit
- Approvals approve/revise/block buttons work
- Onboarding step completion persists
- Analytics charts render
- Settings theme toggle works
- Mobile responsive on all pages

---

## WAVE 6: Dashboard + Integrations

**Goal**: Build the two most complex pages — Dashboard (with live streaming feed) and Integrations (with search, tabs, modal).

**Prerequisites**: Wave 5 complete.

### 6.1 Integrations Page

**Route**: `src/app/(app)/integrations/page.tsx`
**Controller**: `src/controllers/IntegrationsController.tsx` — fetch all Integrations + user's UserIntegrations
**View**: `src/views/integrations/Integrations.tsx` — `"use client"`

**Server action**: `src/actions/integrations/toggleIntegrationAction.ts` — connect/disconnect

Port from monolith lines 1841-2027. Components:

**`src/views/integrations/IntegrationCard.tsx`** — card with icon, name, category, description, connect/disconnect button.

**`src/views/integrations/IntegrationModal.tsx`** — Shadcn Dialog showing tool details, capabilities per category, connect button.

Features:
- Search input filtering by name/description
- Category tabs using Shadcn Tabs (import categories from `@/lib/data/integration-categories`)
- Popular section (shown only when category="all" and no search)
- Connected count + total count badges
- Connect/disconnect toggles server action

### 6.2 Dashboard Page

**Route**: `src/app/(app)/dashboard/page.tsx`
**Controller**: `src/controllers/DashboardController.tsx` — fetch agents, approvals, token usage aggregates
**View**: `src/views/dashboard/Dashboard.tsx` — `"use client"`

Port from monolith lines 1161-1544. This is the most complex page.

**Sub-components**:

**`src/views/dashboard/StatsGrid.tsx`** — 4 stat cards (Active Agents, Pending Approvals, Tasks Done Today, Leads This Week). Port lines 1183-1201.

**`src/views/dashboard/TokenUsageCard.tsx`** — token usage progress bar, per-agent breakdown bars, daily usage mini bar chart. Port lines 1203-1328. Import data from `@/lib/data/token-usage`.

**`src/views/dashboard/LiveActivityFeed.tsx`** — THE KEY COMPONENT. Character-by-character streaming animation. Port lines 1330-1465.

This component must:
1. Import activityFeedData from `@/lib/data/activity-feed`
2. Maintain state: feedItems, streamingIdx, streamedChars, feedPaused
3. Use `useEffect` with setTimeout chaining (lines 604-634):
   - Character delay: newline=120ms, punctuation=80ms, normal=15-40ms random
   - When text complete, wait 2000ms, then move to next item
   - Store completed items (max 20) with timestamp
4. Show completed items collapsed at top with opacity-60
5. Show current streaming item with agent header, monospace text, blinking cursor
6. Pause/resume button
7. Progress bar for current stream
8. Feed footer with completed count and working agent emoji indicator

**`src/views/dashboard/WorkingAgentsCard.tsx`** — cards for agents where status="working" with progress bars. Port lines 1479-1496.

**`src/views/dashboard/PendingApprovalsCard.tsx`** — cards for agents where status="approval" with approve/revise/block buttons. Port lines 1498-1517.

**`src/views/dashboard/WeeklyActivityChart.tsx`** — recharts BarChart. Port lines 1520-1541. Import from `@/lib/data/charts`.

Dashboard also includes:
- NextActionCard component (from Wave 4)
- NudgeBanner for connect-tools prompt (from Wave 4)

### Wave 6 Verification
- Integrations: search filters in real time, category tabs work, popular section shows, modal opens, connect/disconnect persists to DB
- Dashboard: all 6 sections render, live feed streams characters, pause/resume works, completed items stack up, recharts render, stat cards show correct numbers
- Full app flow: register → login → see dashboard → navigate all pages → logout
- Mobile responsive on both pages
- Dark/light mode correct on both pages

---

## Final Verification Checklist

After all 6 waves:
1. Auth flow: register → login → dashboard redirect
2. All 13 app pages render behind auth
3. Landing + order form accessible without login
4. Order form saves to database
5. Integrations connect/disconnect persists
6. Onboarding progress persists
7. Dark/light mode persists across pages via next-themes
8. Live activity feed streams on dashboard
9. recharts render on analytics + dashboard
10. Mobile: bottom nav, collapsible sidebar, responsive grids
11. HelpChat context-aware on every page
12. Guided tours trigger on first visit to dashboard/agents/approvals/integrations
13. `npm run typecheck` — zero errors
14. `npm run lint` — zero warnings
15. `npm run build` — succeeds
