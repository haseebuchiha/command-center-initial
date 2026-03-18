import { UserAuth } from '@/services/UserAuth';
import { redirect } from 'next/navigation';
import { Login } from '@/views/auth/Login';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Login',
  };
}

export const LoginController = async () => {
  const user = await UserAuth.getUser();

  if (user) {
    redirect('/');
  }

  return <Login />;
};
