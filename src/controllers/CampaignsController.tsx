import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { CampaignsView } from '@/views/campaigns/CampaignsView';

export const CampaignsController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return <CampaignsView campaigns={campaigns} />;
};
