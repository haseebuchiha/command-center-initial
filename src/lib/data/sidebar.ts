import type { SidebarNavItem } from '@/types/command-center';

export const sidebarItems: SidebarNavItem[] = [
  { id: 'dashboard', label: 'Command Center', iconName: 'Home' },
  { id: 'agents', label: 'Agent Office', iconName: 'Users' },
  { id: 'approvals', label: 'Approvals', iconName: 'CheckCircle', badge: 2 },
  { id: 'tickets', label: 'Support Tickets', iconName: 'MessageSquare' },
  { id: 'campaigns', label: 'Campaigns', iconName: 'Megaphone' },
  { id: 'leads', label: 'Sales Leads', iconName: 'Target' },
  { id: 'integrations', label: 'Integrations', iconName: 'LayoutGrid' },
  { id: 'website', label: 'My Website', iconName: 'Globe' },
  { id: 'docs', label: 'Documents', iconName: 'FileText' },
  { id: 'analytics', label: 'Analytics', iconName: 'BarChart2' },
  { id: 'pipeline', label: 'Pipeline', iconName: 'History' },
  { id: 'daily', label: 'Daily Brief', iconName: 'Briefcase' },
  { id: 'onboarding', label: 'Setup Guide', iconName: 'Rocket' },
  { id: 'settings', label: 'Settings', iconName: 'Settings' },
];
