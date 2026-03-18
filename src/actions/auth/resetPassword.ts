'use server';

import { actionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { resetPasswordFormValidator } from '@/validators/auth/resetPasswordFormValidator';
import { resetPasswordValidator } from '@/validators/auth/resetPasswordValidator';
import { UserAuth } from '@/services/UserAuth';
import { hashPassword } from '@/lib/password';
import { revalidatePath } from 'next/cache';
import { returnValidationErrors } from 'next-safe-action';
import { validateWithErrors } from '@/lib/validateWithErrors';

export const resetPassword = actionClient
  .inputSchema(resetPasswordFormValidator)
  .action(async ({ parsedInput }) => {
    const validated = await validateWithErrors(
      resetPasswordValidator,
      parsedInput,
      resetPasswordFormValidator
    );

    const passwordReset = await prisma.passwordReset.findUnique({
      where: {
        token: validated.token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!passwordReset || !passwordReset.user) {
      returnValidationErrors(resetPasswordFormValidator, {
        token: { _errors: ['Invalid or expired reset token'] },
      });
    }

    const hashedPassword = await hashPassword(validated.password);

    await prisma.user.update({
      where: {
        id: passwordReset.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordReset.delete({
      where: {
        id: passwordReset.id,
      },
    });

    await UserAuth.login(passwordReset.user);

    revalidatePath('/');

    return passwordReset.user;
  });
