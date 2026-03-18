'use server';

import { actionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { forgotPasswordFormValidator } from '@/validators/auth/forgotPasswordFormValidator';
import { forgotPasswordValidator } from '@/validators/auth/forgotPasswordValidator';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';
import { dispatch } from '@/services/jobs/dispatch';
import { SendPasswordResetEmail } from '@/jobs/SendPasswordResetEmail';
import { validateWithErrors } from '@/lib/validateWithErrors';

export const forgotPassword = actionClient
  .inputSchema(forgotPasswordFormValidator)
  .action(async ({ parsedInput }) => {
    const validated = await validateWithErrors(
      forgotPasswordValidator,
      parsedInput,
      forgotPasswordFormValidator
    );

    const user = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    });

    if (!user) {
      return {
        message:
          'If an account with that email exists, we have sent a password reset link.',
      };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const passwordReset = await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await dispatch(
      new SendPasswordResetEmail({
        passwordResetId: passwordReset.id,
      })
    );

    revalidatePath('/');

    return {
      message:
        'If an account with that email exists, we have sent a password reset link.',
    };
  });
