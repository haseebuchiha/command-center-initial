import { z } from 'zod';

export const forgotPasswordValidator = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email')),
});
