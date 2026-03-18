import type { ChartDataPoint, PieDataPoint } from '@/types/command-center';

export const chartData: ChartDataPoint[] = [
  { name: 'Mon', leads: 4, content: 3, sales: 1 },
  { name: 'Tue', leads: 7, content: 5, sales: 2 },
  { name: 'Wed', leads: 5, content: 8, sales: 3 },
  { name: 'Thu', leads: 9, content: 6, sales: 4 },
  { name: 'Fri', leads: 12, content: 7, sales: 6 },
  { name: 'Sat', leads: 8, content: 4, sales: 3 },
  { name: 'Sun', leads: 6, content: 2, sales: 1 },
];

export const pieData: PieDataPoint[] = [
  { name: 'Content', value: 35, color: '#3B82F6' },
  { name: 'Outreach', value: 25, color: '#8B5CF6' },
  { name: 'Research', value: 20, color: '#22C55E' },
  { name: 'SEO', value: 12, color: '#F59E0B' },
  { name: 'Support', value: 8, color: '#EF4444' },
];
