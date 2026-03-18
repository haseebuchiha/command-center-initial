import { UserAuth } from '@/services/UserAuth';
import { redirect } from 'next/navigation';
import { ForgotPassword } from '@/views/auth/ForgotPassword';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Forgot Password',
  };
}

export const ForgotPasswordController = async () => {
  const user = await UserAuth.getUser();

  if (user) {
    redirect('/');
  }

  return <ForgotPassword />;
};
