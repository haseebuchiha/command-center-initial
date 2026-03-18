'use server';

import { actionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { registerFormValidator } from '@/validators/auth/registerFormValidator';
import { registerValidator } from '@/validators/auth/registerValidator';
import { UserAuth } from '@/services/UserAuth';
import { hashPassword } from '@/lib/password';
import { revalidatePath } from 'next/cache';
import { returnValidationErrors } from 'next-safe-action';
import { validateWithErrors } from '@/lib/validateWithErrors';

export const register = actionClient
  .inputSchema(registerFormValidator)
  .action(async ({ parsedInput }) => {
    const validated = await validateWithErrors(
      registerValidator,
      parsedInput,
      registerFormValidator
    );

    const existingUser = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    });

    if (existingUser) {
      returnValidationErrors(registerFormValidator, {
        email: { _errors: ['An account with this email already exists'] },
      });
    }

    const hashedPassword = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    });

    await UserAuth.login(user);

    revalidatePath('/');

    return user;
  });
