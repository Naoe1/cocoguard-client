import { FormDrawer } from '@/components/ui/FormDrawer';
import { createProductSchema, useCreateProduct } from '../api/CreateProduct';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useInventory } from '@/features/inventory/api/GetInventory';
import { toast } from 'sonner';

export const CreateProduct = ({ TriggerBtn }) => {
  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      inventoryItemId: '',
      description: '',
      price: '',
      amountToSell: '',
      image: '',
    },
  });

  const inventoryQuery = useInventory({
    params: { category: 'Product' },
  });

  const createProductMutation = useCreateProduct({
    mutationConfig: {
      onError: (error) => {
        toast.error(
          `Failed to create product: ${error.message || 'Server error'}`,
        );
      },
      onSuccess: () => {
        form.reset();
        toast.success('Product created successfully from inventory item');
      },
    },
  });

  const onSubmit = (data) => {
    const selectedItem = inventoryQuery.data?.data?.inventory.find(
      (item) => String(item.id) === data.inventoryItemId,
    );

    if (selectedItem && data.amountToSell > selectedItem.stock_qty) {
      form.setError('amountToSell', {
        type: 'manual',
        message: `Amount to sell cannot exceed available inventory (${selectedItem.stock_qty} units)`,
      });
      toast.error('Amount to sell exceeds available inventory.');
      return;
    }

    console.log('Submitting Product Data:', data);
    createProductMutation.mutate(data);
  };

  return (
    <FormDrawer
      isDone={createProductMutation.isSuccess}
      description="Select an inventory item and provide market details."
      triggerButton={TriggerBtn ?? <Button size="sm">Add Product</Button>}
      title="Create Product from Inventory"
      submitButton={
        <Button
          form="create-product"
          type="submit"
          size="sm"
          disabled={
            createProductMutation.isPending ||
            inventoryQuery.isLoading ||
            inventoryQuery.isError
          }
        >
          {createProductMutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      }
    >
      <Form {...form}>
        <form
          id="create-product"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="inventoryItemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory Product *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={
                    createProductMutation.isPending ||
                    inventoryQuery.isLoading ||
                    inventoryQuery.isError
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          inventoryQuery.isLoading
                            ? 'Loading inventory...'
                            : inventoryQuery.isError
                            ? 'Error loading inventory'
                            : 'Select product item'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inventoryQuery.data?.data?.inventory.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name} {item.amount_per_unit} {item.unit} (
                        {item.stock_qty} available)
                      </SelectItem>
                    ))}
                    {/* Handle case where no products are available */}
                    {!inventoryQuery.isLoading &&
                      !inventoryQuery.isError &&
                      inventoryQuery.data?.data?.inventory?.length === 0 && (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          No inventory items found in 'Product' category.
                        </div>
                      )}
                  </SelectContent>
                </Select>
                {inventoryQuery.isError && (
                  <p className="text-sm text-red-500">
                    Could not load product inventory.
                  </p>
                )}
                <FormMessage />{' '}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the product for the market (optional)"
                    {...field}
                    value={field.value ?? ''}
                    disabled={createProductMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 1.50"
                      {...field}
                      disabled={createProductMutation.isPending}
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
                      disabled={createProductMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg (optional)"
                    {...field}
                    value={field.value ?? ''}
                    disabled={createProductMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        {form.formState.errors.root && (
          <FormMessage className="mt-2 text-sm text-red-500">
            {form.formState.errors.root.message}
          </FormMessage>
        )}
      </Form>
    </FormDrawer>
  );
};
