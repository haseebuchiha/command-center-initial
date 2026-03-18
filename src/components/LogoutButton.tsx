'use client';

import { logout } from '@/actions/auth/logout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from '@bprogress/next/app';
import { route } from '@/lib/route';
import { useState } from 'react';

export const LogoutButton = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await logout();

      if (result?.serverError) {
        toast.error('An error occurred. Please try again.');
      } else {
        router.push(route('home'));
        router.refresh();
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </Button>
  );
};
