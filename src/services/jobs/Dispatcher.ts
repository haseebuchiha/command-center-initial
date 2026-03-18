import { Job } from './Job';
import { Client } from '@upstash/qstash';

export type QueueOptions = {
  retries?: number;
  useQueue?: boolean;
};

export class Dispatcher {
  private qstashClient: Client;

  constructor() {
    this.qstashClient = new Client({
      token: process.env.QSTASH_TOKEN!,
    });
  }

  async dispatch(
    job: Job<unknown>,
    options: QueueOptions = {
      retries: 0,
      useQueue: false,
    }
  ) {
    const config = this.prepareConfig(job, options);

    if (config.queueName) {
      const queue = this.qstashClient.queue({
        queueName: config.queueName,
      });

      return await queue.enqueueJSON(config);
    }

    await this.qstashClient.publishJSON(config);
  }

  async dispatchBatch(
    jobs: Job<unknown>[],
    options: QueueOptions = {
      retries: 0,
      useQueue: false,
    }
  ) {
    await this.qstashClient.batchJSON(
      jobs.map((job) => this.prepareConfig(job, options))
    );
  }

  private getQstashEndpointUrl(): string {
    if (process.env.QSTASH_ENDPOINT_URL) {
      return process.env.QSTASH_ENDPOINT_URL;
    }

    if (process.env.NEXT_PUBLIC_APP_URL) {
      return `${process.env.NEXT_PUBLIC_APP_URL}/qstash`;
    }

    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/qstash`;
    }

    throw new Error(
      'QStash endpoint URL not configured. Set QSTASH_ENDPOINT_URL (local) or deploy to Vercel.'
    );
  }

  private prepareConfig = (job: Job<unknown>, options: QueueOptions) => {
    const body = {
      job: job.jobName,
      payload: job.payload,
    };

    const retries = options.retries ?? job.retries;
    const useQueue = job.useQueue || options.useQueue;

    if (useQueue && !process.env.QSTASH_QUEUE_NAME) {
      throw new Error(
        'QSTASH_QUEUE_NAME is required when using queues. Set it in your environment variables.'
      );
    }

    const queueName = useQueue ? process.env.QSTASH_QUEUE_NAME : undefined;
    const urlGroup = process.env.QSTASH_URL_GROUP;

    if (urlGroup) {
      return { urlGroup, body, retries, queueName };
    }

    return { url: this.getQstashEndpointUrl(), body, retries, queueName };
  };
}

export const dispatcher = new Dispatcher();
