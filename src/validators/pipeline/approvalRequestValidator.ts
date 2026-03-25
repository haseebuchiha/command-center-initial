import { z } from 'zod';

export const approvalRequestValidator = z.object({
  agentName: z.string().min(1),
  type: z.string().min(1),
  title: z.string().min(1),
  preview: z.string().min(1),
  pipelineRunId: z.string().optional(),
});
