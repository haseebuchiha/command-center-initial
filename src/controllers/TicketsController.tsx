import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { TicketsView } from '@/views/tickets/TicketsView';

export const TicketsController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });

  return <TicketsView tickets={tickets} />;
};
