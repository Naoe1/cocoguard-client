import { FormDrawer } from '@/components/ui/FormDrawer';
import { createHarvestSchema, useCreateHarvest } from '../api/CreateHarvest';
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

export const CreateHarvest = ({ TriggerBtn, code }) => {
  const form = useForm({
    resolver: zodResolver(createHarvestSchema),
    defaultValues: {
      treeCode: code || '',
      coconutCount: 0,
      totalWeight: 0,
      harvestDate: new Date().toISOString().split('T')[0],
    },
  });

  const createHarvestMutation = useCreateHarvest({
    mutationConfig: {
      onError: (error) => {
        if (error.response?.data?.validationError) {
          console.log(error);
          const { field, message } = error.response.data.validationError;
          form.setError(field || 'root', {
            type: 'manual',
            message: message || 'An error occurred',
          });
          toast.error('Validation error');
        } else toast.error('Something went wrong. Please try again.');
      },
      onSuccess: () => {
        form.reset();
        toast.success('Harvest created successfully!');
      },
    },
  });

  const onSubmit = (data) => {
    createHarvestMutation.mutate(data);
  };

  return (
    <FormDrawer
      isDone={createHarvestMutation.isSuccess}
      description="Create a new harvest record."
      triggerButton={TriggerBtn ?? <Button size="sm">Create Harvest</Button>}
      title="Create Harvest"
      submitButton={
        <Button
          form="create-harvest"
          type="submit"
          size="sm"
          disabled={createHarvestMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form {...form}>
        <form
          id="create-harvest"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="treeCode"
            disabled={!!code}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tree Code *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tree code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="harvestDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harvest Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coconutCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of coconuts</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter number of coconuts"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Enter coconut weight"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormDrawer>
  );
};
