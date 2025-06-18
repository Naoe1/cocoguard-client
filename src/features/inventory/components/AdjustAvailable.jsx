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

const adjustAmountSchema = z.object({
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
});

export const AdjustAvailable = ({ data, onClose }) => {
  const updateItemMutation = useUpdateItem({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        toast.success('Amount per unit adjusted successfully');
      },
      onError: () => {
        toast.error('Failed to adjust amount per unit');
      },
    },
  });

  const form = useForm({
    resolver: zodResolver(adjustAmountSchema),
    defaultValues: {
      quantity: '',
    },
  });

  const handleAdjustAmount = (isAddition) => {
    const quantity = Number(form.getValues('quantity'));

    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    let newTotalAvailable;
    if (isAddition) {
      newTotalAvailable = Number(data.total_available) + quantity;
    } else {
      newTotalAvailable = Math.max(
        0.01,
        Number(data.total_available) - quantity,
      );
    }

    updateItemMutation.mutate({
      id: data.id,
      data: {
        name: data.name,
        category: data.category,
        stockQty: data.stock_qty.toString(),
        amountPerUnit: data.amount_per_unit.toString(),
        totalAvailable: newTotalAvailable.toString(),
        unit: data.unit,
        stockPrice: data.stock_price.toString(),
        lowStockAlert: data.low_stock_alert?.toString() || '0',
      },
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Current amount per unit:{' '}
            <span className="font-medium text-foreground">
              {data.amount_per_unit} {data.unit}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Total available:{' '}
            <span className="font-medium text-foreground">
              {data.stock_qty * data.amount_per_unit} {data.unit}
            </span>
          </p>
        </div>

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Adjust</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
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
            onClick={() => handleAdjustAmount(false)}
            variant="destructive"
            className="flex-1"
            disabled={updateItemMutation.isPending}
          >
            <Minus className="mr-2 h-4 w-4" /> Reduce
          </Button>
          <Button
            type="button"
            onClick={() => handleAdjustAmount(true)}
            className="flex-1"
            disabled={updateItemMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" /> Increase
          </Button>
        </div>
      </form>
    </Form>
  );
};
