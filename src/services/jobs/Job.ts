export abstract class Job<Payload> {
  public payload: Payload;
  useQueue = false;
  retries = 0;

  constructor(payload: Payload) {
    this.payload = payload;
  }

  abstract jobName: string;

  abstract process(): Promise<void>;
}
