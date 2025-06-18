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
import { useUpdateItem } from '../api/UpdateItem';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { z } from 'zod';
import { Plus, Minus } from 'lucide-react';

const adjustStockSchema = z.object({
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Quantity must be a positive number',
  }),
});

export const AdjustStock = ({ data, onClose }) => {
  const updateItemMutation = useUpdateItem({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        toast.success('Stock quantity adjusted successfully');
      },
      onError: () => {
        toast.error('Failed to adjust stock quantity');
      },
    },
  });

  const form = useForm({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      quantity: '',
    },
  });

  const handleAdjustStock = (isAddition) => {
    const quantity = Number(form.getValues('quantity'));

    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    if (!isAddition && quantity > Number(data.stock_qty)) {
      toast.error(
        `Cannot remove more than the current stock (${data.stock_qty})`,
      );
      return;
    }

    let newStockQty;
    if (isAddition) {
      newStockQty = Number(data.stock_qty) + quantity;
    } else {
      newStockQty = Math.max(0, Number(data.stock_qty) - quantity);
    }

    updateItemMutation.mutate({
      id: data.id,
      data: {
        name: data.name,
        category: data.category,
        stockQty: newStockQty.toString(),
        amountPerUnit: data.amount_per_unit.toString(),
        unit: data.unit,
        stockPrice: data.stock_price?.toString(),
        lowStockAlert: data.low_stock_alert?.toString() || '0',
      },
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Current stock:{' '}
            <span className="font-medium text-foreground">
              {data.stock_qty} {data.stock_qty === 1 ? 'unit' : 'units'}
            </span>
          </p>
        </div>

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity to Adjust</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter quantity"
                  disabled={updateItemMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={updateItemMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => handleAdjustStock(false)}
            variant="destructive"
            className="flex-1"
            disabled={updateItemMutation.isPending}
          >
            <Minus className="mr-2 h-4 w-4" /> Remove
          </Button>
          <Button
            type="button"
            onClick={() => handleAdjustStock(true)}
            className="flex-1"
            disabled={updateItemMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
