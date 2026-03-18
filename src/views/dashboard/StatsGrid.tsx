import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    label: 'Active Agents',
    value: '4',
    icon: '🤖',
    colorClass: 'text-primary',
  },
  {
    label: 'Pending Approvals',
    value: '2',
    icon: '⏳',
    colorClass: 'text-warning',
    href: '/approvals',
  },
  {
    label: 'Tasks Done Today',
    value: '12',
    icon: '✅',
    colorClass: 'text-success',
  },
  {
    label: 'Leads This Week',
    value: '31',
    icon: '📈',
    colorClass: 'text-accent',
  },
];

export const StatsGrid = () => (
  <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
    {stats.map((s) => {
      const content = (
        <Card
          className={s.href ? 'cursor-pointer hover:border-primary/30' : ''}
        >
          <CardContent className="flex items-start justify-between p-3 md:p-5">
            <div>
              <div className="mb-1 text-[11px] text-muted-foreground md:text-[13px]">
                {s.label}
              </div>
              <div
                className={`text-2xl font-extrabold md:text-[32px] ${s.colorClass}`}
              >
                {s.value}
              </div>
            </div>
            <div className="text-xl md:text-[28px]">{s.icon}</div>
          </CardContent>
        </Card>
      );
      return s.href ? (
        <Link key={s.label} href={s.href}>
          {content}
        </Link>
      ) : (
        <div key={s.label}>{content}</div>
      );
    })}
  </div>
);
