import { z } from 'zod';

export const activityEventValidator = z.object({
  agentName: z.string().min(1),
  agentEmoji: z.string().min(1),
  action: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  pipelineRunId: z.string().optional(),
});
