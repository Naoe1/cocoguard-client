import { api } from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { getInventoryQueryOptions } from './GetInventory';

export const createItemSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(30, { message: 'Name cannot exceed 30 characters' })
    .trim(),
  category: z.string().min(1, { message: 'Category is required' }),
  stockQty: z.coerce
    .number()
    .min(1, { message: 'This should be greater than 1' })
    .max(1000000, { message: 'Exceeds maximum stock quantity' }),
  amountPerUnit: z.coerce
    .number()
    .min(1, {
      message: 'This should be greater than 1',
    })
    .max(1000000, { message: 'Exceeds maximum amount per unit' }),
  unit: z
    .string()
    .min(1, { message: 'Unit is required' })
    .max(20, { message: 'Unit cannot exceed 20 characters' })
    .trim(),
  stockPrice: z.coerce.number().optional().nullable(),
  lowStockAlert: z.coerce.number().optional().nullable(),
});

export const createItem = (data) => {
  return api.post('/inventory', data);
};

export const useCreateItem = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInventoryQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createItem,
  });
};
