'use server';

import { authActionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const updateTicketAction = authActionClient
  .inputSchema(
    z.object({
      ticketId: z.string(),
      status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
      notes: z.string().optional(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    await prisma.supportTicket.update({
      where: { id: parsedInput.ticketId, userId: ctx.user.id },
      data: {
        ...(parsedInput.status && { status: parsedInput.status }),
        ...(parsedInput.priority && { priority: parsedInput.priority }),
        ...(parsedInput.notes !== undefined && { notes: parsedInput.notes }),
      },
    });
    revalidatePath('/tickets');
  });
