import { FormDrawer } from '@/components/ui/FormDrawer';
import { createStaffSchema, useCreateStaff } from '../api/CreateStaff';
import { Button } from '@/shared/components/ui/button';
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
import { toast } from 'sonner';

export const CreateStaff = ({ TriggerBtn }) => {
  const form = useForm({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'STAFF',
    },
  });

  const createStaffMutation = useCreateStaff({
    mutationConfig: {
      onError: (error) => {
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;
          backendErrors.forEach((err) => {
            form.setError(err.field, {
              type: 'server',
              message: err.message,
            });
          });
          toast.error(error.response.data.message || 'Failed to create staff');
        } else if (error.response?.data?.message) {
          form.setError('root', { message: error.response.data.message });
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to create staff member. Please try again.');
        }
      },
      onSuccess: () => {
        form.reset();
        toast.success('Staff member created successfully');
      },
    },
  });

  const onSubmit = (data) => {
    createStaffMutation.mutate(data);
  };

  return (
    <FormDrawer
      isDone={createStaffMutation.isSuccess}
      description={'Add a new staff member to the system.'}
      triggerButton={TriggerBtn ?? <Button size="sm">Create Staff</Button>}
      title="Create Staff Member"
      submitButton={
        <Button
          form="create-staff"
          type="submit"
          size="sm"
          disabled={createStaffMutation.isPending}
        >
          {createStaffMutation.isPending ? 'Creating...' : 'Submit'}
        </Button>
      }
    >
      <Form {...form}>
        <form
          id="create-staff"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      disabled={createStaffMutation.isPending}
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
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      {...field}
                      disabled={createStaffMutation.isPending}
                    />
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
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    disabled={createStaffMutation.isPending}
                  />
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
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                    disabled={createStaffMutation.isPending}
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          )}
        </form>
      </Form>
    </FormDrawer>
  );
};
