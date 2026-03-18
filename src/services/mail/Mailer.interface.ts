import { MailSendOptions } from './MailSendOptions';

export interface MailerInterface {
  send: (options: MailSendOptions) => Promise<unknown>;
}
