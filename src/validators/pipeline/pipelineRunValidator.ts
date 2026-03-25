import { z } from 'zod';

export const pipelineRunValidator = z.object({
  projectName: z.string().min(1),
  phase: z.enum(['research', 'build']),
  status: z.enum(['running', 'completed', 'failed']),
  tokenTotal: z.number().int().optional(),
  costCents: z.number().int().optional(),
  errorMessage: z.string().optional(),
  pipelineRunId: z.string().optional(),
});
