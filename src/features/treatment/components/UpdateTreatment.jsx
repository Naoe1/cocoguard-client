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
import { useTreatment } from '../api/GetTreatment';
import { useUpdateTreatment } from '../api/UpdateTreatment';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { createTreatmentSchema } from '../api/CreateTreatment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Loader2 } from 'lucide-react';

export const UpdateTreatment = ({ treatmentId, closeForm }) => {
  const treatmentQuery = useTreatment({ treatmentId });
  const updateTreatmentMutation = useUpdateTreatment({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Treatment updated successfully');
      },
      onError: () => {
        toast.error('Failed to update treatment');
      },
    },
  });

  const treatment = treatmentQuery.data?.data;
  const form = useForm({
    resolver: zodResolver(createTreatmentSchema),
    values: {
      treeCode: treatment?.tree?.tree_code || '',
      dateApplied: treatment?.date_applied
        ? new Date(treatment.date_applied).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      type: treatment?.type || 'Others',
      product: treatment?.product || '',
      endDate: treatment?.end_date
        ? new Date(treatment.end_date).toISOString().split('T')[0]
        : '',
      amount: treatment?.amount || 0,
      unit: treatment?.unit || 'L',
    },
  });

  const onSubmit = (data) => {
    updateTreatmentMutation.mutate({
      data,
      id: treatmentId,
    });
  };

  if (treatmentQuery.isLoading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="update-treatment"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="treeCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tree Nickname *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Nickname"
                  {...field}
                  disabled={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
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
                    disabled={updateTreatmentMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={updateTreatmentMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment Type *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={updateTreatmentMutation.isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                  <SelectItem value="Pesticide">Pesticide</SelectItem>
                  <SelectItem value="Fungicide">Fungicide</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
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
                <FormLabel>Amount Used</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount used"
                    {...field}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === '' ? 0 : +event.target.value,
                      )
                    }
                    disabled={updateTreatmentMutation.isPending}
                    step="any"
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
                    disabled={updateTreatmentMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product name"
                  disabled={updateTreatmentMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={updateTreatmentMutation.isPending}
          className="w-full"
        >
          Update Treatment
        </Button>
      </form>
    </Form>
  );
};
