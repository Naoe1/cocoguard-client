import { FormDrawer } from '@/components/ui/FormDrawer';
import {
  createTreatmentSchema,
  useCreateTreatment,
} from '../api/CreateTreatment';
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
import { useEffect } from 'react';
import { toast } from 'sonner';

export const CreateTreatment = ({ TriggerBtn, code }) => {
  const form = useForm({
    resolver: zodResolver(createTreatmentSchema),
    defaultValues: {
      treeCode: code || '',
      dateApplied: new Date().toISOString().split('T')[0],
      type: 'Others',
      product: '',
      endDate: '',
      inventoryItemId: 'none',
      amount: 0,
      unit: '',
    },
  });

  const selectedType = form.watch('type');
  const inventoryQuery = useInventory({
    params: { category: selectedType },
    queryConfig: {
      enabled: !!selectedType,
    },
  });

  useEffect(() => {
    form.resetField('inventoryItemId', { defaultValue: 'none' });
  }, [selectedType, form]);

  const createTreatmentMutation = useCreateTreatment({
    mutationConfig: {
      onError: (error) => {
        if (error.response?.data?.validationError) {
          console.log(error);
          const { field, message } = error.response.data.validationError;
          form.setError(field || 'root', {
            type: 'manual',
            message: message || 'An error occurred',
          });
          toast.error('Validation Failed');
        }
        toast.error('Failed to create treatment');
      },
      onSuccess: () => {
        form.reset();
        toast.success('Treatment created successfully');
      },
    },
  });

  const onSubmit = (data) => {
    // --- Start Date Validation ---
    if (data.endDate && data.dateApplied && data.endDate < data.dateApplied) {
      form.setError('endDate', {
        type: 'manual',
        message: 'End Date cannot be earlier than Date Applied.',
      });
      return;
    }
    if (
      data.inventoryItemId &&
      data.inventoryItemId !== 'none' &&
      data.amount != null
    ) {
      const selectedItem = inventoryQuery.data?.data?.inventory.find(
        (item) => String(item.id) === data.inventoryItemId,
      );
      if (selectedItem && data.amount > selectedItem.total_available) {
        form.setError('amount', {
          type: 'manual',
          message: `Amount cannot exceed available stock (${selectedItem.total_available} ${selectedItem.unit})`,
        });
        return;
      }
    } else if (
      data.inventoryItemId &&
      data.inventoryItemId !== 'none' &&
      data.amount == null
    ) {
      form.setError('amount', {
        type: 'manual',
        message: 'Amount is required when subtracting from inventory.',
      });
      return;
    }
    const formattedData = {
      ...data,
      inventoryItemId:
        data.inventoryItemId === 'none' ? null : data.inventoryItemId,
      amount: data.amount || null,
    };
    console.log(formattedData);
    createTreatmentMutation.mutate(formattedData);
  };

  return (
    <FormDrawer
      isDone={createTreatmentMutation.isSuccess}
      description={'Create a new treatment'}
      triggerButton={TriggerBtn ?? <Button size="sm">Create Treatment</Button>}
      title="Create Treatment"
      submitButton={
        <Button
          form="create-treatment"
          type="submit"
          size="sm"
          disabled={createTreatmentMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form {...form}>
        <form
          id="create-treatment"
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateApplied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Applied *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <Input type="date" {...field} />
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
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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

          <FormField
            control={form.control}
            name="inventoryItemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtract from Inventory</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== 'none') {
                      const selectedItem =
                        inventoryQuery.data?.data?.inventory.find(
                          (item) => String(item.id) === value,
                        );
                      if (selectedItem) {
                        form.setValue('product', selectedItem.name);
                        form.setValue('unit', selectedItem.unit);
                      }
                    } else {
                      form.setValue('product', '');
                      form.setValue('unit', '');
                    }
                  }}
                  value={field.value}
                  disabled={
                    inventoryQuery.isLoading ||
                    !selectedType ||
                    inventoryQuery.isError
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          inventoryQuery.isLoading
                            ? 'Loading inventory...'
                            : 'Select item (optional)'
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
                    Could not load inventory.
                  </p>
                )}
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
                      } // Handle empty string and convert to number
                      step="any" // Allow decimals if needed
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
                      disabled={form.watch('inventoryItemId') !== 'none'}
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
                    disabled={form.watch('inventoryItemId') !== 'none'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {form.formState.errors.root && (
        <FormMessage>{form.formState.errors.root.message}</FormMessage>
      )}
    </FormDrawer>
  );
};
