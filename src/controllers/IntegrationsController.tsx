import { UserAuth } from '@/services/UserAuth';
import { prisma } from '@/lib/prisma';
import { Integrations } from '@/views/integrations/Integrations';

export const IntegrationsController = async () => {
  const user = await UserAuth.getUser();

  const allIntegrations = await prisma.integration.findMany({
    orderBy: { name: 'asc' },
  });

  const connectedSlugs = user
    ? (
        await prisma.userIntegration.findMany({
          where: { userId: user.id },
          include: { integration: true },
        })
      ).map((ui) => ui.integration.slug)
    : [];

  return (
    <Integrations
      integrations={allIntegrations}
      connectedSlugs={connectedSlugs}
    />
  );
};
