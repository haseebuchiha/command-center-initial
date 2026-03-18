'use server';

import { authActionClient } from '@/lib/actionClient';
import { UserAuth } from '@/services/UserAuth';
import { revalidatePath } from 'next/cache';

export const logout = authActionClient.action(async () => {
  await UserAuth.logout();

  revalidatePath('/');
});
