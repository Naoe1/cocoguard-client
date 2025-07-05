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
import { Textarea } from '@/shared/components/ui/textarea';
import { useProduct } from '../api/GetProduct';
import { useUpdateProduct } from '../api/UpdateProduct';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { createProductSchema } from '../api/CreateProduct';
import { useEffect } from 'react';

export const UpdateProduct = ({ productId, closeForm }) => {
  const productQuery = useProduct({ productId });
  const updateProductMutation = useUpdateProduct({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Product updated successfully');
      },
      onError: (error) => {
        toast.error(
          `Failed to update product: ${error.message || 'Server error'}`,
        );
      },
    },
  });

  const product = productQuery?.data?.data;
  const form = useForm({
    resolver: zodResolver(createProductSchema),
    values: {
      inventoryItemId: String(product?.inventory.id),
      description: product?.description || '',
      price: product?.price || '',
      amountToSell: product?.amount_to_sell || '',
      image: product?.image || '',
    },
  });

  const onSubmit = (data) => {
    // Validation: Check amountToSell against inventory stock
    const availableStock = product?.inventory?.stock_qty;
    if (availableStock !== undefined && data.amountToSell > availableStock) {
      form.setError('amountToSell', {
        type: 'manual',
        message: `Amount cannot exceed available inventory stock (${availableStock})`,
      });
      toast.error('Amount to sell exceeds available inventory stock.');
      return; // Stop submission
    }

    updateProductMutation.mutate({
      data,
      id: productId,
    });
  };

  if (productQuery.isLoading) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (productQuery.isError) {
    return (
      <div className="flex h-60 w-full items-center justify-center text-red-600">
        Error loading product data.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        id="update-product"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the product (optional)"
                  {...field}
                  value={field.value ?? ''}
                  disabled={updateProductMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.50"
                  {...field}
                  disabled={updateProductMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amountToSell"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Sell *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  placeholder="e.g., 100"
                  {...field}
                  disabled={updateProductMutation.isPending}
                />
              </FormControl>
              <FormMessage />
              {product?.inventory?.stock_qty !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  Available Stock: {product.inventory.stock_qty}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg (optional)"
                  {...field}
                  value={field.value ?? ''}
                  disabled={updateProductMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={updateProductMutation.isPending}
          className="w-full"
        >
          {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
        </Button>
      </form>
      {form.formState.errors.root && (
        <FormMessage className="mt-2 text-sm text-red-500">
          {form.formState.errors.root.message}
        </FormMessage>
      )}
    </Form>
  );
};
