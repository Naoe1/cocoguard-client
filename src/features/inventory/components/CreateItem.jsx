import { FormDrawer } from '@/components/ui/FormDrawer';
import { createItemSchema, useCreateItem } from '../api/CreateItem';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { toast } from 'sonner';

export const CreateItem = () => {
  const form = useForm({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: '',
      category: 'Others',
      stockQty: 0,
      amountPerUnit: 0,
      unit: '',
      stockPrice: 0,
      lowStockAlert: 0,
    },
  });
  // console.log('Form state errors:', form.formState.errors);

  const createItemMutation = useCreateItem({
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
          toast.error(error.response.data.message || 'Failed to create item');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      },
      onSuccess: () => {
        form.reset();
        toast.success('Item created successfully!');
      },
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    createItemMutation.mutate(data);
  };

  return (
    <FormDrawer
      isDone={createItemMutation.isSuccess}
      description="Create a new inventory item."
      triggerButton={<Button size="sm">Create Inventory Item</Button>}
      title="Create Inventory Item"
      submitButton={
        <Button
          form="create-item"
          type="submit"
          size="sm"
          disabled={createItemMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form {...form}>
        <form
          id="create-item"
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
                  <Input placeholder="Enter item name" {...field} />
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
                  defaultValue={field.value}
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
                    <Input type="number" step="0.01" {...field} />
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
                    <Input type="number" step="0.01" {...field} />
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
                    <Input type="number" step="0.01" {...field} />
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
                    <Input placeholder="e.g. kg, liters" {...field} />
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
                <FormLabel>Price per stock</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
