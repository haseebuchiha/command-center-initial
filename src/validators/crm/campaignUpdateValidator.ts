import { z } from 'zod';

export const campaignUpdateValidator = z.object({
  status: z.enum(["draft", "active", "paused", "completed"]).optional(),
  messaging: z.string().optional(),
  notes: z.string().optional(),
  channels: z.string().optional(),
});
