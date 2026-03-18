import { z } from 'zod';

export const forgotPasswordFormValidator = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email')),
});

export type ForgotPasswordFormValues = z.infer<
  typeof forgotPasswordFormValidator
>;
