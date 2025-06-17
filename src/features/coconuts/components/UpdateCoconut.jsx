import { Form } from '@/shared/components/ui/form';
import { createCoconutSchema } from '../api/CreateCoconut';
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
import { useCoconut } from '../api/GetCoconut';
import { useUpdateCoconut } from '../api/UpdateCoconut';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Loader2 } from 'lucide-react';

export const UpdateCoconut = ({ coconutId, closeForm }) => {
  const coconutQuery = useCoconut({ coconutId });
  const updateCoconutMutation = useUpdateCoconut({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Coconut updated successfully');
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
            error.response.data.message || 'Failed to update coconut',
          );
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      },
    },
  });
  const coconut = coconutQuery.data?.data;

  const form = useForm({
    resolver: zodResolver(createCoconutSchema),
    values: {
      treeCode: coconut?.tree_code || '',
      plantingDate:
        coconut?.planting_date || new Date().toISOString().split('T')[0],
      height: coconut?.height || '',
      trunkDiameter: coconut?.trunk_diameter || '',
      status: coconut?.status || 'Healthy',
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      height: data.height ? data.height : null,
      trunkDiameter: data.trunkDiameter ? data.trunkDiameter : null,
    };
    updateCoconutMutation.mutate({
      data: formattedData,
      id: coconutId,
    });
  };

  if (coconutQuery.isLoading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="update-coconut"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="treeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tree Code *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tree code"
                  {...field}
                  disabled={updateCoconutMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plantingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Planting Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={updateCoconutMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (m)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter height"
                  disabled={updateCoconutMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trunkDiameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trunk Diameter (cm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  disabled={updateCoconutMutation.isPending}
                  placeholder="Enter trunk diameter"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={coconut?.status}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Diseased">Diseased</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={updateCoconutMutation.isPending}
          className="w-full"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
