import { z } from 'zod';

export const tokenUsageValidator = z.object({
  agentName: z.string().min(1),
  tokens: z.number().int().positive(),
  costCents: z.number().int().optional(),
  model: z.string().optional(),
  pipelineRunId: z.string().optional(),
});
