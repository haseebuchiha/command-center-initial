import { dispatcher, QueueOptions } from './Dispatcher';
import { Job } from './Job';

export const dispatch = async (job: Job<unknown>, options?: QueueOptions) => {
  await dispatcher.dispatch(job, options);
};

export const dispatchBatch = async (
  jobs: Job<unknown>[],
  options?: QueueOptions
) => {
  await dispatcher.dispatchBatch(jobs, options);
};
