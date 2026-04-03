import { z } from 'zod';

export const leadUpdateValidator = z.object({
  stage: z.enum(['new', 'contacted', 'quoted', 'won', 'lost']).optional(),
  estimatedValue: z.number().int().optional(),
  followUpDate: z.string().nullable().optional(),
  followUpNotes: z.string().optional(),
  notes: z.string().optional(),
  customerId: z.string().nullable().optional(),
});
