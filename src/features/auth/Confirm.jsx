import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/shared/components/ui/form';
import { useAuth, forgotPasswordInputSchema as emailSchema } from '@/lib/auth';

export const Confirm = ({ token }) => {
  const { confirmEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      await confirmEmail(data, token);
      setSuccessMessage(
        'Your email has been confirmed successfully. You can now log in to your account.',
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to confirm email. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm font-medium text-white bg-red-500 rounded-md">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-3 text-sm font-medium text-white bg-green-500 rounded-md">
            {successMessage}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paypal Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Online payment would be sent to this email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Confirming...' : 'Confirm Paypal Email'}
        </Button>

        <div className="text-sm text-center">
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Back to Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};
