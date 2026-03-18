import { mailer } from '@/lib/mailer';
import PasswordResetEmail from '@/views/emails/PasswordResetEmail';
import { render } from '@react-email/render';

interface SendPasswordResetEmailProps {
  to: string;
  name: string;
  resetUrl: string;
}

export const sendPasswordResetEmail = async ({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailProps) => {
  const email = await render(
    <PasswordResetEmail name={name} resetUrl={resetUrl} />
  );

  const result = await mailer.send({
    to: to,
    subject: 'Reset Your Password',
    html: email,
  });

  return result;
};
