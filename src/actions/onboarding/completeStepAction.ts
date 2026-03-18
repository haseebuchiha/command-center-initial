'use server';

import { authActionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const completeStepAction = authActionClient
  .inputSchema(z.object({ stepId: z.string() }))
  .action(async ({ parsedInput }) => {
    await prisma.onboardStep.update({
      where: { id: parsedInput.stepId },
      data: { done: true },
    });
    revalidatePath('/onboarding');
  });
