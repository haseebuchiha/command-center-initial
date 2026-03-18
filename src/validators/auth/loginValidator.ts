import { z } from 'zod';

export const loginValidator = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Please enter a valid email')),
  password: z.string().min(1, 'Please enter your password'),
});
