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
import { useHarvest } from '../api/GetHarvest';
import { useUpdateHarvest } from '../api/UpdateHarvest';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { createHarvestSchema } from '../api/CreateHarvest';
import { Loader2 } from 'lucide-react';

export const UpdateHarvest = ({ harvestId, closeForm }) => {
  const harvestQuery = useHarvest({ harvestId });
  const updateHarvestMutation = useUpdateHarvest({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Harvest updated successfully');
      },
      onError: () => {
        toast.error('Failed to update harvest');
      },
    },
  });
  const harvest = harvestQuery.data?.data;
  const form = useForm({
    resolver: zodResolver(createHarvestSchema),
    values: {
      treeCode: harvest?.tree.tree_code || '',
      harvestDate: harvest?.harvest_date
        ? new Date(harvest.harvest_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      coconutCount: harvest?.coconut_count || 0,
      totalWeight: harvest?.total_weight || 0,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    updateHarvestMutation.mutate({
      data,
      id: harvestId,
    });
  };

  if (harvestQuery.isLoading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="update-harvest"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="treeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coconut ID *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tree code"
                  {...field}
                  disabled={true}
                />
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
              <FormLabel>Harvest Date *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={updateHarvestMutation.isPending}
                />
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
              <FormLabel>Coconut nut count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter quantity collected"
                  disabled={updateHarvestMutation.isPending}
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
              <FormLabel>Quantity Collected (kg) *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter coconut weight in kg"
                  disabled={updateHarvestMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={updateHarvestMutation.isPending}
          className="w-full"
        >
          Update Harvest
        </Button>
      </form>
    </Form>
  );
};
