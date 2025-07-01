import { FormDrawer } from '@/components/ui/FormDrawer';
import { createNutrientSchema, useCreateNutrient } from '../api/CreateNutrient';
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
import { useInventory } from '@/features/inventory/api/GetInventory';
import { toast } from 'sonner';

export const CreateNutrient = ({ TriggerBtn, code }) => {
  const form = useForm({
    resolver: zodResolver(createNutrientSchema),
    defaultValues: {
      treeCode: code || '',
      dateApplied: new Date().toISOString().split('T')[0],
      product: '',
      amount: '',
      applicationMethod: '',
      inventoryItemId: 'none',
      unit: '',
    },
  });

  const inventoryQuery = useInventory({
    params: { category: 'Fertilizer' },
  });

  const createNutrientMutation = useCreateNutrient({
    mutationConfig: {
      onError: (error) => {
        if (error.response?.data?.validationError) {
          console.error(
            'Validation Error:',
            error.response.data.validationError,
          );
          const { field, message } = error.response.data.validationError;
          form.setError(field || 'root', {
            type: 'manual',
            message: message || 'An error occurred',
          });
          toast.error(`Validation Failed: ${message || 'Check inputs'}`);
        } else {
          toast.error(
            `Failed to create nutrient record: ${
              error.message || 'Server error'
            }`,
          );
        }
      },
      onSuccess: () => {
        form.reset();
        toast.success('Nutrient record created successfully');
      },
    },
  });

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    if (
      data.inventoryItemId &&
      data.inventoryItemId !== 'none' &&
      data.amount != null &&
      data.amount !== ''
    ) {
      const selectedItem = inventoryQuery.data?.data?.inventory.find(
        (item) => String(item.id) === data.inventoryItemId,
      );
      const numericAmount = Number(data.amount);

      if (selectedItem && numericAmount > selectedItem.total_available) {
        form.setError('amount', {
          type: 'manual',
          message: `Amount cannot exceed available stock (${selectedItem.total_available} ${selectedItem.unit})`,
        });
        toast.error('Amount exceeds available inventory stock.');
        return;
      }
      if (numericAmount <= 0) {
        form.setError('amount', {
          type: 'manual',
          message: 'Amount must be greater than 0.',
        });
        toast.error('Amount must be positive.');
        return;
      }
    }
    const formattedData = {
      ...data,
      inventoryItemId:
        data.inventoryItemId === 'none' ? null : data.inventoryItemId,
      amount: data.amount === '' ? null : Number(data.amount),
    };

    console.log('Submitting Nutrient Data:', formattedData);
    createNutrientMutation.mutate(formattedData);
  };
  console.log('CreateNutrient Component Rendered' + code);

  return (
    <FormDrawer
      isDone={createNutrientMutation.isSuccess}
      description="Create a new nutrient application record."
      triggerButton={
        TriggerBtn ?? <Button size="sm">Create Nutrient Record</Button>
      }
      title="Create Nutrient Record"
      submitButton={
        <Button
          form="create-nutrient"
          type="submit"
          size="sm"
          disabled={createNutrientMutation.isPending}
        >
          {createNutrientMutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      }
    >
      <Form {...form}>
        <form
          id="create-nutrient"
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
            name="dateApplied"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Applied *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={createNutrientMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subtract from Inventory */}
          <FormField
            control={form.control}
            name="inventoryItemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtract from Inventory</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('amount', '');
                    form.clearErrors('amount');
                    if (value !== 'none') {
                      const selectedItem =
                        inventoryQuery.data?.data?.inventory.find(
                          (item) => String(item.id) === value,
                        );
                      if (selectedItem) {
                        form.setValue('product', selectedItem.name, {
                          shouldDirty: true,
                        }); // Set product field
                        form.setValue('unit', selectedItem.unit, {
                          shouldDirty: true,
                        }); // Set unit field
                      }
                    } else {
                      form.setValue('product', '', { shouldDirty: true });
                      form.setValue('unit', '', { shouldDirty: true });
                    }
                  }}
                  value={field.value} // Use value for controlled component
                  disabled={
                    createNutrientMutation.isPending ||
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
                            : 'Select fertilizer (optional)' // Updated placeholder
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'none'}>None (Manual Input)</SelectItem>
                    {inventoryQuery.data?.data?.inventory.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name} ({item.total_available} {item.unit} left)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {inventoryQuery.isError && (
                  <p className="text-sm text-red-500">
                    Could not load fertilizer inventory.
                  </p>
                )}
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
                    {...field}
                    disabled={
                      createNutrientMutation.isPending ||
                      form.watch('inventoryItemId') !== 'none'
                    }
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
                      step="any" // Allow decimals
                      placeholder="Enter amount"
                      {...field} // Pass field directly
                      // value={field.value ?? ''} // Ensure value is never null/undefined
                      // onChange={(e) => field.onChange(e.target.value)} // Let RHF handle conversion via Zod
                      disabled={createNutrientMutation.isPending}
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
                      placeholder="Enter unit"
                      {...field}
                      // Disable if an inventory item is selected
                      disabled={
                        createNutrientMutation.isPending ||
                        form.watch('inventoryItemId') !== 'none'
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Application Method */}
          <FormField
            control={form.control}
            name="applicationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Method</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Foliar spray, Soil drench"
                    {...field}
                    disabled={createNutrientMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        {/* Display root errors */}
        {form.formState.errors.root && (
          <FormMessage className="mt-2 text-sm text-red-500">
            {form.formState.errors.root.message}
          </FormMessage>
        )}
      </Form>
    </FormDrawer>
  );
};
