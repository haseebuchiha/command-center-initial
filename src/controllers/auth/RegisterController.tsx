import { UserAuth } from '@/services/UserAuth';
import { redirect } from 'next/navigation';
import { Register } from '@/views/auth/Register';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Register',
  };
}

export const RegisterController = async () => {
  const user = await UserAuth.getUser();

  if (user) {
    redirect('/');
  }

  return <Register />;
};
