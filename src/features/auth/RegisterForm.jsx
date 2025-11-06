import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { useAuth, registerInputSchema } from '@/lib/auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export const RegisterForm = () => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      street: '',
      barangay: '',
      city: '',
      province: '',
      region: '',
      postal_code: '',
    },
  });

  const philippineRegions = [
    'NCR',
    'CAR',
    'REGION I',
    'REGION II',
    'REGION III',
    'REGION IV-A',
    'REGION IV-B',
    'REGION V',
    'REGION VI',
    'REGION VII',
    'REGION VIII',
    'REGION IX',
    'REGION X',
    'REGION XI',
    'REGION XII',
    'REGION XIII',
    'BARMM',
  ];

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      await register(data);
      setSuccessMessage(
        `We've sent a confirmation link to ${data.email}. Please check your inbox to verify your email before signing in.`,
      );
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" disabled={isLoading} {...field} />
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
                  <Input
                    type="password"
                    disabled={isLoading}
                    {...field}
                    autoComplete="on"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="text-lg font-medium">Farm Address Information</h3>
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="123 Mabini St."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barangay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Barangay 123"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Municipality</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Quezon City"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Metro Manila"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {philippineRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="1100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>

          <div className="text-sm text-center">
            <Link
              to="/auth/login"
              className="font-medium text-primary hover:text-primary/90"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};
