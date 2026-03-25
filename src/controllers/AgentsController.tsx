import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { AgentOffice } from '@/views/agents/AgentOffice';

export const AgentsController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const agents = await prisma.agent.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
  });

  return <AgentOffice agents={agents} />;
};
