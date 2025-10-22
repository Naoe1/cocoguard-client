import { Form } from '@/shared/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useUpdateAccount, updateAccountSchema } from '../api/UpdateAccount';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAccount } from '../api/GetAccount';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';

export const UpdateAccount = () => {
  const accountQuery = useAccount({});
  const { setAuth, forgotPassword, auth } = useAuth();

  const updateAccountMutation = useUpdateAccount({
    mutationConfig: {
      onSuccess: (data) => {
        setAuth((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            firstName: data.data.data.firstName,
            lastName: data.data.data.lastName,
          },
        }));
        toast.success('Account updated successfully');
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;
          backendErrors.forEach((err) => {
            form.setError(err.field, {
              type: 'server',
              message: err.message,
            });
          });
          toast.error(
            error.response.data.message || 'Failed to update account',
          );
        } else {
          toast.error('Failed to update account. Please try again.');
        }
      },
    },
  });
  const form = useForm({
    resolver: zodResolver(updateAccountSchema),
    values: {
      firstName: accountQuery.data?.data?.firstName || '',
      lastName: accountQuery.data?.data?.lastName || '',
      street: accountQuery.data?.data?.farmAddress?.street || '',
      barangay: accountQuery.data?.data?.farmAddress?.barangay || '',
      city: accountQuery.data?.data?.farmAddress?.city || '',
      province: accountQuery.data?.data?.farmAddress?.province || '',
      region: accountQuery.data?.data?.farmAddress?.region || '',
      postal_code: accountQuery.data?.data?.farmAddress?.postal_code || '',
      paypal_email: accountQuery.data?.data?.paypal_email || '',
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

  const onSubmit = (data) => {
    updateAccountMutation.mutate(data);
  };

  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async () => {
    try {
      setIsLoading(true);
      await forgotPassword({ email: accountQuery.data?.data?.email });
      toast.success(
        'Password reset link has been successfully sent. It may take 5-10 minutes to arrive in your inbox.',
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (accountQuery.isLoading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="rounded-lg border bg-muted/30 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Email Address</h3>
              <p className="text-sm text-muted-foreground">
                Your email address is used for login and cannot be changed
              </p>
            </div>{' '}
            <FormItem>
              <FormControl>
                <Input
                  value={accountQuery.data?.data?.email || ''}
                  disabled
                  className="bg-muted font-medium"
                />
              </FormControl>
            </FormItem>
          </div>
          <div className="rounded-lg border bg-muted/30 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Paypal Email Address</h3>
              <p className="text-sm text-muted-foreground">
                Your email address is used for receiving payments.
              </p>
            </div>{' '}
            <FormField
              control={form.control}
              name="paypal_email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      disabled={
                        updateAccountMutation.isPending ||
                        auth.user.role === 'STAFF'
                      }
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="border-b pb-3">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                Update your basic personal details
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      First Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        disabled={updateAccountMutation.isPending}
                        className="h-10"
                      />
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
                    <FormLabel className="text-sm font-medium">
                      Last Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        disabled={updateAccountMutation.isPending}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-3">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <p className="text-sm text-muted-foreground">
                Keep your address details current for accurate services
              </p>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Street Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter street address"
                        {...field}
                        disabled={updateAccountMutation.isPending}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="barangay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Barangay *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter barangay"
                          {...field}
                          disabled={updateAccountMutation.isPending}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        City/Municipality *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city/municipality"
                          {...field}
                          disabled={updateAccountMutation.isPending}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Province *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter province"
                          {...field}
                          disabled={updateAccountMutation.isPending}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Region *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          accountQuery.data?.data?.farmAddress?.region
                        }
                        disabled={updateAccountMutation.isPending}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger className="h-10">
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
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Postal Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter postal code"
                          {...field}
                          disabled={updateAccountMutation.isPending}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div></div>
              </div>
            </div>
          </div>

          {form.formState.errors.root && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <FormMessage className="text-destructive">
                {form.formState.errors.root.message}
              </FormMessage>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={resetPassword}
              disabled={isLoading}
              className="min-w-[140px] h-11"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
            <Button
              type="submit"
              disabled={updateAccountMutation.isPending}
              className="min-w-[140px] h-11"
              size="lg"
            >
              {updateAccountMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Account'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
