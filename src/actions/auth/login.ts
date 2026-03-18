'use server';

import { actionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { loginFormValidator } from '@/validators/auth/loginFormValidator';
import { loginValidator } from '@/validators/auth/loginValidator';
import { UserAuth } from '@/services/UserAuth';
import { verifyPassword } from '@/lib/password';
import { revalidatePath } from 'next/cache';
import { returnValidationErrors } from 'next-safe-action';
import { validateWithErrors } from '@/lib/validateWithErrors';

export const login = actionClient
  .inputSchema(loginFormValidator)
  .action(async ({ parsedInput }) => {
    const validated = await validateWithErrors(
      loginValidator,
      parsedInput,
      loginFormValidator
    );

    const user = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    });

    if (!user) {
      returnValidationErrors(loginFormValidator, {
        email: { _errors: ['Invalid email or password'] },
      });
    }

    const validPassword = await verifyPassword(
      user.password,
      validated.password
    );

    if (!validPassword) {
      returnValidationErrors(loginFormValidator, {
        password: { _errors: ['Invalid email or password'] },
      });
    }

    await UserAuth.login(user);

    revalidatePath('/');

    return user;
  });
