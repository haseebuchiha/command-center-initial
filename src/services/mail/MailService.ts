import { MailerConfig } from './Config';
import { MailSendOptions } from './MailSendOptions';
import { MailgunMailer } from './MailgunMailer';
import { SmtpMailer } from './SmtpMailer';

export class MailService {
  private config: MailerConfig;
  private mailer;

  constructor(config: MailerConfig) {
    this.config = config;

    this.mailer = this.createMailer();
  }

  private createMailer() {
    switch (this.config.mailer) {
      case 'smtp':
        return new SmtpMailer({
          host: this.config.host,
          port: this.config.port,
          tls: this.config.tls,
          username: this.config.username,
          password: this.config.password,
        });

      case 'mailgun':
        return new MailgunMailer({
          apiKey: this.config.apiKey,
          domain: this.config.domain,
        });

      default:
        throw new Error('Mailer not configured');
    }
  }

  mergeOptions(options: MailSendOptions) {
    return {
      from: this.config.from,
      ...options,
    };
  }

  async send(options: MailSendOptions) {
    return await this.mailer.send(this.mergeOptions(options));
  }
}
