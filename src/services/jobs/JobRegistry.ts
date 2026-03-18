import { JobRegistry } from './JobRegistry.class';
import { RunScheduledJobs } from '@/jobs/RunScheduledJobs';
import { SendPasswordResetEmail } from '@/jobs/SendPasswordResetEmail';

const jobRegistry = new JobRegistry();

jobRegistry.register('RunScheduledJobs', RunScheduledJobs);
jobRegistry.register('SendPasswordResetEmail', SendPasswordResetEmail);

export { jobRegistry };
