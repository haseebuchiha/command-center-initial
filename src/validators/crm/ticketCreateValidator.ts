import { z } from 'zod';

export const ticketCreateValidator = z.object({
  customerId: z.string().min(1),
  subject: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  createdBy: z.enum(["manual", "agent"]).optional(),
});
