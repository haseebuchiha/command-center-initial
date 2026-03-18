import { UserAuth } from '@/services/UserAuth';
import { redirect, notFound } from 'next/navigation';
import { ResetPassword } from '@/views/auth/ResetPassword';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Reset Password',
  };
}

export const ResetPasswordController = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const user = await UserAuth.getUser();

  if (user) {
    redirect('/');
  }

  const { token } = await params;

  const passwordReset = await prisma.passwordReset.findUnique({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!passwordReset) {
    notFound();
  }

  return <ResetPassword token={token} />;
};
