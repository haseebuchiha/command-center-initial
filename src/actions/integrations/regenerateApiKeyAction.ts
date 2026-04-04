'use server';

import { authActionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';

export const regenerateApiKeyAction = authActionClient
  .inputSchema(
    z.object({
      integrationSlug: z.string(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const integration = await prisma.integration.findUnique({
      where: { slug: parsedInput.integrationSlug },
    });
    if (!integration) throw new Error('Integration not found');

    const userIntegration = await prisma.userIntegration.findUnique({
      where: {
        userId_integrationId: {
          userId: ctx.user.id,
          integrationId: integration.id,
        },
      },
      include: { slackInstallation: true },
    });

    if (!userIntegration?.slackInstallation) {
      throw new Error('No Slack installation found');
    }

    const newKey = randomBytes(32).toString('hex');

    await prisma.slackInstallation.update({
      where: { id: userIntegration.slackInstallation.id },
      data: { pipelineApiKey: newKey },
    });

    revalidatePath('/integrations');
    return { pipelineApiKey: newKey };
  });
