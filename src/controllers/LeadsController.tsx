import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { LeadsView } from '@/views/leads/LeadsView';

export const LeadsController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const leads = await prisma.lead.findMany({
    where: { userId: user.id },
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });

  return <LeadsView leads={leads} />;
};
