import { MailService } from '@/services/mail/MailService';
import { z } from 'zod';

const parseConfig = () => {
  const smtp = z.object({
    mailer: z.literal('smtp'),
    host: z.string(),
    port: z.number(),
    username: z.string().optional(),
    password: z.string().optional(),
    tls: z.boolean(),
  });

  const mailgun = z.object({
    mailer: z.literal('mailgun'),
    apiKey: z.string(),
    domain: z.string(),
  });

  const validator = z.discriminatedUnion('mailer', [smtp, mailgun]);

  return validator.parse({
    mailer: process.env.MAILER,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || ''),
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    tls: process.env.MAILGUN_TLS === 'true',
  });
};

export const mailer = new MailService({
  from: 'LaunchBased <info@launchbased.com>',
  ...parseConfig(),
});
