import { UserAuth } from '@/services/UserAuth';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app/AppShell';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  return <AppShell user={user}>{children}</AppShell>;
}
