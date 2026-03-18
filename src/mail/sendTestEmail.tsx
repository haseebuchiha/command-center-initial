import { mailer } from '@/lib/mailer';
import { TestEmail } from '@/views/emails/TestEmail';
import { render } from '@react-email/render';

export const sendTestEmail = async (to: string) => {
  const email = await render(<TestEmail />);

  const result = await mailer.send({
    to: to,
    subject: 'Test Email',
    html: email,
  });

  return result;
};
