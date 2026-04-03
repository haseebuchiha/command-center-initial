'use server';

import { authActionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const updateCampaignAction = authActionClient
  .inputSchema(
    z.object({
      campaignId: z.string(),
      status: z
        .enum(['draft', 'active', 'paused', 'completed'])
        .optional(),
      notes: z.string().optional(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    await prisma.campaign.update({
      where: { id: parsedInput.campaignId, userId: ctx.user.id },
      data: {
        ...(parsedInput.status && { status: parsedInput.status }),
        ...(parsedInput.notes !== undefined && { notes: parsedInput.notes }),
      },
    });
    revalidatePath('/campaigns');
  });
