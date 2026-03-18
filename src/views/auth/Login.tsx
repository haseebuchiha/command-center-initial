'use client';

import { login } from '@/actions/auth/login';
import { loginFormValidator } from '@/validators/auth/loginFormValidator';
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
import Link from 'next/link';

export const Login = () => {
  const router = useRouter();

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    login,
    zodResolver(loginFormValidator),
    {
      formProps: {
        defaultValues: {
          email: '',
          password: '',
        },
      },
      actionProps: {
        onSuccess: () => {
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
        <h1 className="text-2xl font-bold mb-4">Login</h1>

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Password" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={action.isPending}>
              Login
            </Button>
          </form>
        </Form>

        <div className="mt-4 space-y-2">
          <div>
            <Link href={route('register')}>
              Don&apos;t have an account? Register
            </Link>
          </div>
          <div>
            <Link href={route('password.request')}>Forgot your password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
