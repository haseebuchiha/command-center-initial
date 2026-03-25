import { Prisma } from '@/generated/prisma/client';
import { TokenUsageSummary } from '@/types/command-center';

type TokenUsageWithAgent = Prisma.TokenUsageGetPayload<{
  include: { agent: true };
}>;

const AGENT_COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#F97316',
];

export function buildTokenUsageSummary(
  rows: TokenUsageWithAgent[]
): TokenUsageSummary | null {
  if (rows.length === 0) return null;

  const agentMap = new Map<
    string,
    { name: string; emoji: string; tokens: number }
  >();
  for (const row of rows) {
    const key = row.agent.name;
    const existing = agentMap.get(key);
    if (existing) {
      existing.tokens += row.tokens;
    } else {
      agentMap.set(key, {
        name: row.agent.name,
        emoji: row.agent.emoji,
        tokens: row.tokens,
      });
    }
  }

  const byAgent = [...agentMap.values()]
    .sort((a, b) => b.tokens - a.tokens)
    .map((a, i) => ({ ...a, color: AGENT_COLORS[i % AGENT_COLORS.length] }));

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyMap = new Map<string, number>();
  for (const row of rows) {
    const day = dayNames[new Date(row.date).getDay()];
    dailyMap.set(day, (dailyMap.get(day) || 0) + row.tokens);
  }
  const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daily = orderedDays.map((day) => ({
    day,
    tokens: dailyMap.get(day) || 0,
  }));

  const used = rows.reduce((sum, r) => sum + r.tokens, 0);

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const resetDate = nextMonth.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return {
    plan: 'Growth',
    monthlyLimit: 500000,
    used,
    resetDate,
    byAgent,
    daily,
  };
}
