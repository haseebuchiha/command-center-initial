'use server';

import { authActionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const toggleIntegrationAction = authActionClient
  .inputSchema(z.object({ integrationSlug: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const integration = await prisma.integration.findUnique({
      where: { slug: parsedInput.integrationSlug },
    });
    if (!integration) throw new Error('Integration not found');

    const existing = await prisma.userIntegration.findUnique({
      where: {
        userId_integrationId: {
          userId: ctx.user.id,
          integrationId: integration.id,
        },
      },
    });

    if (existing) {
      await prisma.userIntegration.delete({ where: { id: existing.id } });
    } else {
      if (integration.authType === 'oauth') {
        throw new Error('This integration requires OAuth authorization');
      }

      await prisma.userIntegration.create({
        data: {
          userId: ctx.user.id,
          integrationId: integration.id,
        },
      });
    }

    revalidatePath('/integrations');
    revalidatePath('/settings');
  });
