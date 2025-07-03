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
import { useStaff } from '../api/GetStaff';
import { useUpdateStaff } from '../api/UpdateStaff';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { updateStaffSchema } from '../api/UpdateStaff';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Loader2 } from 'lucide-react';

export const UpdateStaff = ({ staffId, closeForm }) => {
  const staffQuery = useStaff({ staffId });
  const updateStaffMutation = useUpdateStaff({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Staff member updated successfully');
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
          toast.error(error.response.data.message || 'Failed to update staff');
        } else {
          toast.error('Failed to update staff member. Please try again.');
        }
      },
    },
  });

  const staff = staffQuery.data?.data;
  const form = useForm({
    resolver: zodResolver(updateStaffSchema),
    values: {
      firstName: staff?.first_name || '',
      lastName: staff?.last_name || '',
      role: staff?.role || 'STAFF',
    },
  });

  const onSubmit = (data) => {
    updateStaffMutation.mutate({
      data,
      id: staffId,
    });
  };

  if (staffQuery.isLoading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex h-48 w-full items-center justify-center text-red-500">
        Staff member not found.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="update-staff"
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
                    disabled={updateStaffMutation.isPending}
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
                    disabled={updateStaffMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={staff?.role}
                disabled={updateStaffMutation.isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Update role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <FormMessage>{form.formState.errors.root.message}</FormMessage>
        )}
        <Button
          type="submit"
          disabled={updateStaffMutation.isPending}
          className="w-full"
        >
          {updateStaffMutation.isPending ? 'Updating...' : 'Update Staff'}
        </Button>
      </form>
    </Form>
  );
};
