import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { useAuth, forgotPasswordInputSchema } from '@/lib/auth';

export const ForgotPasswordForm = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(forgotPasswordInputSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      await forgotPassword(data);
      setSuccessMessage(
        'Password reset link has been successfully sent. It may take 5-10 minutes to arrive in your inbox.',
      );
      form.reset();
      // navigate('/auth/login'); // navigate to login page after a delay
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to send password reset email. Please try again.',
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
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
