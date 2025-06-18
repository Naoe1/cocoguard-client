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
import { useItem } from '../api/GetItem';
import { useUpdateItem } from '../api/UpdateItem';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { createItemSchema } from '../api/CreateItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Loader2 } from 'lucide-react';

export const UpdateItem = ({ itemId, closeForm }) => {
  const itemQuery = useItem({ itemId });
  const updateItemMutation = useUpdateItem({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Inventory item updated successfully');
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
          toast.error(error.response.data.message || 'Failed to create item');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      },
    },
  });

  const item = itemQuery.data?.data;
  const form = useForm({
    resolver: zodResolver(createItemSchema),
    values: {
      name: item?.name || '',
      category: item?.category || 'Others',
      stockQty: item?.stock_qty?.toString() || '0',
      amountPerUnit: item?.amount_per_unit?.toString() || '1',
      unit: item?.unit || '',
      stockPrice: item?.stock_price?.toString() || '0',
      lowStockAlert: item?.low_stock_alert?.toString() || '0',
    },
  });

  const onSubmit = (data) => {
    updateItemMutation.mutate({
      data,
      id: itemId,
    });
  };

  if (itemQuery.isLoading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="update-item"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter item name"
                  disabled={
                    updateItemMutation.isPending ||
                    ['Coconut', 'Copra'].includes(item?.name)
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={item?.category}
                disabled={updateItemMutation.isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                  <SelectItem value="Pesticide">Pesticide</SelectItem>
                  <SelectItem value="Fungicide">Fungicide</SelectItem>
                  <SelectItem value="Herbicide">Herbicide</SelectItem>
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
            name="stockQty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    disabled={updateItemMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lowStockAlert"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Low Stock Alert</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    disabled={updateItemMutation.isPending}
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
            name="amountPerUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Per Stock *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    disabled={updateItemMutation.isPending}
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
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. kg, liters"
                    disabled={
                      updateItemMutation.isPending ||
                      ['Coconut', 'Copra'].includes(item?.name)
                    }
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
          name="stockPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Price (₱)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  disabled={updateItemMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={updateItemMutation.isPending}
          className="w-full"
        >
          Update Inventory Item
        </Button>
      </form>
    </Form>
  );
};
