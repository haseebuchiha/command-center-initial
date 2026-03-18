'use client';

import { resetPassword } from '@/actions/auth/resetPassword';
import { resetPasswordFormValidator } from '@/validators/auth/resetPasswordFormValidator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { route } from '@/lib/route';
import { useRouter } from '@bprogress/next/app';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

export const ResetPassword = ({ token }: { token: string }) => {
  const router = useRouter();

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    resetPassword,
    zodResolver(resetPasswordFormValidator),
    {
      formProps: {
        defaultValues: {
          token,
          password: '',
          passwordConfirmation: '',
        },
      },
      actionProps: {
        onSuccess: () => {
          toast.success('Password reset successfully! You are now logged in.');
          router.push(route('home'));
        },
        onError: ({ error }) => {
          if (error.serverError) {
            toast.error('An error occurred. Please try again.');
          }
        },
      },
    }
  );

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

        <Form {...form}>
          <form
            onSubmit={handleSubmitWithAction}
            className="space-y-4 w-96 max-w-full"
            method="post"
          >
            <input type="hidden" {...form.register('token')} value={token} />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="New Password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Confirm New Password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={action.isPending}>
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
