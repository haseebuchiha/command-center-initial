import { Constructable } from '@/types/Constructable';
import { Job } from './Job';

export class JobRegistry {
  private jobs = new Map<string, Constructable<Job<unknown>>>();

  register(name: string, job: Constructable<Job<unknown>>) {
    this.jobs.set(name, job);
  }

  get(name: string) {
    return this.jobs.get(name);
  }
}
