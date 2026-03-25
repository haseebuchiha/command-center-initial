import { z } from 'zod';

export const buildValidator = z.object({
  pipelineRunId: z.string().min(1),
  projectName: z.string().min(1),
  status: z.enum(['pending', 'deployed', 'failed']),
  liveUrl: z.string().optional(),
  platform: z.string().optional(),
  neonProjectId: z.string().optional(),
  durationMs: z.number().int().optional(),
  errorLog: z.string().optional(),
  fileCount: z.number().int().optional(),
});
