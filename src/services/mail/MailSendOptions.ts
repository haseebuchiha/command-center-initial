export type MailSendOptions = {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  bcc?: string | string[];
  attachments?: {
    filename: string;
    content: Buffer;
  }[];
  replyTo?: string;
};
