import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { Approvals } from '@/views/approvals/Approvals';

export const ApprovalsController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const approvals = await prisma.approval.findMany({
    where: { userId: user.id },
    include: { agent: true },
    orderBy: { createdAt: 'desc' },
  });

  return <Approvals approvals={approvals} />;
};
