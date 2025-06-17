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
import { useAuth, updatePasswordInputSchema } from '@/lib/auth';

export const UpdatePasswordForm = ({ token }) => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(updatePasswordInputSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      // Include token if your API requires it, e.g., await updatePassword({ ...data, token });
      await updatePassword(data, token);
      setSuccessMessage(
        'Your password has been updated successfully. You can now sign in.',
      );
      form.reset();
      // setTimeout(() => {
      //   navigate('/auth/login');
      // }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to update password. Please try again.',
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
        {successMessage && (
          <div className="text-sm text-center">
            <Link
              to="/auth/login"
              className="font-medium text-primary hover:text-primary/90"
            >
              Back to Sign in
            </Link>
          </div>
        )}
      </form>
    </Form>
  );
};
