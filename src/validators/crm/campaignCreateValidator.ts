import { z } from 'zod';

export const campaignCreateValidator = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["content", "social", "email", "local_ads", "review_request"]).optional(),
  channels: z.string().optional(),
  messaging: z.string().optional(),
  targetArea: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  createdBy: z.enum(["manual", "agent"]).optional(),
});
