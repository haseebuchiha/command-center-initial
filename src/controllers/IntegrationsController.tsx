import { UserAuth } from '@/services/UserAuth';
import { prisma } from '@/lib/prisma';
import { Integrations } from '@/views/integrations/Integrations';

export const IntegrationsController = async () => {
  const user = await UserAuth.getUser();

  const allIntegrations = await prisma.integration.findMany({
    orderBy: { name: 'asc' },
  });

  const connectedIntegrations = user
    ? await prisma.userIntegration.findMany({
        where: { userId: user.id },
        include: {
          integration: true,
          slackInstallation: {
            select: { teamName: true },
          },
        },
      })
    : [];

  const connectedInfo = connectedIntegrations.map((ui) => ({
    slug: ui.integration.slug,
    teamName: ui.slackInstallation?.teamName ?? null,
  }));

  return (
    <Integrations
      integrations={allIntegrations}
      connectedInfo={connectedInfo}
    />
  );
};
