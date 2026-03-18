export type BaseConfig = {
  mailer: 'smtp' | 'mailgun';
  from: string;
};

export type MailgunConfig = {
  apiKey: string;
  domain: string;
};

export type SmtpConfig = {
  host: string;
  port: number;
  username?: string;
  password?: string;
  tls: boolean;
};

export type MailerConfig = BaseConfig &
  (({ mailer: 'mailgun' } & MailgunConfig) | ({ mailer: 'smtp' } & SmtpConfig));
