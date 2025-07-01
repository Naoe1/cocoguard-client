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
import { useNutrient } from '../api/GetNutrient';
import { useUpdateNutrient } from '../api/UpdateNutrient';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { createNutrientSchema } from '../api/CreateNutrient';
import { Loader2 } from 'lucide-react';

export const UpdateNutrient = ({ nutrientId, closeForm }) => {
  const nutrientQuery = useNutrient({ nutrientId });
  const updateNutrientMutation = useUpdateNutrient({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Nutrient record updated successfully');
      },
      onError: () => {
        toast.error('Failed to update nutrient record');
      },
    },
  });

  const nutrient = nutrientQuery.data?.data;
  const form = useForm({
    resolver: zodResolver(createNutrientSchema),
    values: {
      treeCode: nutrient?.tree?.tree_code || '',
      dateApplied: nutrient?.date_applied
        ? new Date(nutrient.date_applied).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      product: nutrient?.product || '',
      applicationMethod: nutrient?.application_method || '',
      amount: nutrient?.amount || 0,
      unit: nutrient?.unit || 'kg',
    },
  });

  const onSubmit = (data) => {
    updateNutrientMutation.mutate({
      data,
      id: nutrientId,
    });
  };

  if (nutrientQuery.isLoading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="update-nutrient"
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
                  disabled={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateApplied"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Applied *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  disabled={updateNutrientMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product name"
                  disabled={updateNutrientMutation.isPending}
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    disabled={updateNutrientMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter unit name"
                    {...field}
                    disabled={updateNutrientMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="applicationMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Method</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter application method"
                  disabled={updateNutrientMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={updateNutrientMutation.isPending}
          className="w-full"
        >
          Update Nutrient Record
        </Button>
      </form>
    </Form>
  );
};
