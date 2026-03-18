import { jobRegistry } from './JobRegistry';
import { JobRegistry } from './JobRegistry.class';

export class JobHandler {
  constructor(private jobRegistry: JobRegistry) {}

  async handle(name: string, payload: unknown) {
    const jobClass = this.jobRegistry.get(name);
    if (!jobClass) throw new Error(`Job class ${name} not found`);

    const job = new jobClass(payload);
    await job.process();
  }
}

export const jobHandler = new JobHandler(jobRegistry);
