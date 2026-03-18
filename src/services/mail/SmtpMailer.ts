import { SmtpConfig } from './Config';
import { MailSendOptions } from './MailSendOptions';
import nodemailer from 'nodemailer';
import { MailerInterface } from './Mailer.interface';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class SmtpMailer implements MailerInterface {
  private mailer;

  constructor(config: SmtpConfig) {
    const transportConfig: SMTPTransport.Options = {
      host: config.host,
      port: config.port,
      secure: config.tls,
    };

    // Only add auth if username and password are provided
    if (config.username && config.password) {
      transportConfig.auth = {
        user: config.username,
        pass: config.password,
      };
    }

    this.mailer = nodemailer.createTransport(transportConfig);
  }

  async send(options: MailSendOptions) {
    return await this.mailer.sendMail(options);
  }
}
