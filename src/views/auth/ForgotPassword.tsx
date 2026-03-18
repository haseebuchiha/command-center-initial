'use client';

import { forgotPassword } from '@/actions/auth/forgotPassword';
import { forgotPasswordFormValidator } from '@/validators/auth/forgotPasswordFormValidator';
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
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';

export const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    forgotPassword,
    zodResolver(forgotPasswordFormValidator),
    {
      formProps: {
        defaultValues: {
          email: '',
        },
      },
      actionProps: {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: ({ error }) => {
          if (error.serverError) {
            toast.error('An error occurred. Please try again.');
          }
        },
      },
    }
  );

  if (success) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-full p-4">
          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          <p className="mb-4">
            If an account with that email exists, we have sent a password reset
            link.
          </p>
          <Link href={route('login')}>Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

        <Form {...form}>
          <form
            onSubmit={handleSubmitWithAction}
            className="space-y-4 w-96 max-w-full"
            method="post"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={action.isPending}>
              Send Reset Link
            </Button>
          </form>
        </Form>

        <div className="mt-4">
          <Link href={route('login')}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
