import { Job } from '@/services/jobs/Job';
import { CronExpressionParser } from 'cron-parser';
import { dispatch } from '@/services/jobs/dispatch';
import { DateTime } from 'luxon';

type Payload = void;

export class RunScheduledJobs extends Job<Payload> {
  jobName = 'RunScheduledJobs';

  async process(): Promise<void> {
    for (const { job, cron } of this.getJobs()) {
      if (this.shouldRunJob(cron)) {
        await dispatch(job);
      }
    }
  }

  private getJobs() {
    // All times are in business timezone (America/New_York)

    return [];
  }

  private shouldRunJob(cronExpression: string): boolean {
    try {
      // Parse cron in business timezone
      const interval = CronExpressionParser.parse(cronExpression, {
        tz: this.timezone(),
      });

      // Get the previous run time in business timezone, then convert to UTC
      const previousRun = interval.prev().toDate();

      // Current time in UTC
      const currentTime = new Date();

      // Check if current time is within 1 minute of the scheduled time
      const timeDiff = Math.abs(currentTime.getTime() - previousRun.getTime());
      return timeDiff < 60000; // 60 seconds
    } catch (error) {
      console.error(`Invalid cron expression: ${cronExpression}`, error);
      return false;
    }
  }

  private isFirstOfMonth(): boolean {
    const now = DateTime.now().setZone(this.timezone());
    return now.day === 1;
  }

  private isWednesday(): boolean {
    const now = DateTime.now().setZone(this.timezone());
    return now.weekday === 3;
  }

  private timezone() {
    return process.env.NEXT_PUBLIC_TIMEZONE || 'America/New_York';
  }
}
