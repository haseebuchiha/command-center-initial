import type { TokenUsageSummary } from '@/types/command-center';

export const tokenUsage: TokenUsageSummary = {
  plan: 'Growth',
  monthlyLimit: 500000,
  used: 312480,
  resetDate: 'Apr 1',
  byAgent: [
    { name: 'Emma', emoji: '✍️', tokens: 87200, color: '#3B82F6' },
    { name: 'James', emoji: '🔍', tokens: 62100, color: '#8B5CF6' },
    { name: 'Olivia', emoji: '📧', tokens: 48300, color: '#22C55E' },
    { name: 'Sophia', emoji: '💬', tokens: 41500, color: '#F59E0B' },
    { name: 'Ethan', emoji: '📊', tokens: 35800, color: '#EF4444' },
    { name: 'Ava', emoji: '📱', tokens: 22400, color: '#EC4899' },
    { name: 'Liam', emoji: '📈', tokens: 9680, color: '#06B6D4' },
    { name: 'Noah', emoji: '📋', tokens: 5500, color: '#84CC16' },
  ],
  daily: [
    { day: 'Mon', tokens: 52100 },
    { day: 'Tue', tokens: 61200 },
    { day: 'Wed', tokens: 48700 },
    { day: 'Thu', tokens: 55300 },
    { day: 'Fri', tokens: 43800 },
    { day: 'Sat', tokens: 31200 },
    { day: 'Sun', tokens: 20180 },
  ],
  totalCostCents: 0,
};
