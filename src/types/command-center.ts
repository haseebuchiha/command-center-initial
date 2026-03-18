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
