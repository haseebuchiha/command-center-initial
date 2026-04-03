import { z } from 'zod';

export const ticketUpdateValidator = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  notes: z.string().optional(),
});
