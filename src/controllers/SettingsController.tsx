import { UserAuth } from '@/services/UserAuth';
import { prisma } from '@/lib/prisma';
import { Settings } from '@/views/settings/Settings';

export const SettingsController = async () => {
  const user = await UserAuth.getUser();

  const connectedTools = user
    ? await prisma.userIntegration.findMany({
        where: { userId: user.id },
        include: { integration: true },
      })
    : [];

  return <Settings userName={user?.name || ''} connectedTools={connectedTools} />;
};
