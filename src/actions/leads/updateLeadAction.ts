'use server';

import { authActionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const updateLeadAction = authActionClient
  .inputSchema(
    z.object({
      leadId: z.string(),
      stage: z.enum(['new', 'contacted', 'qualified', 'awaiting_reply', 'call_scheduled', 'quoted', 'proposal_sent', 'won', 'lost', 'reactivation']).optional(),
      notes: z.string().optional(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    await prisma.lead.update({
      where: { id: parsedInput.leadId, userId: ctx.user.id },
      data: {
        ...(parsedInput.stage && { stage: parsedInput.stage }),
        ...(parsedInput.notes !== undefined && { notes: parsedInput.notes }),
      },
    });
    revalidatePath('/leads');
  });
