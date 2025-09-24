import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { z } from 'zod';
import { getNutrientsQueryOptions } from './GetNutrients';
import { getInventoryQueryOptions } from '@/features/inventory/api/GetInventory';

export const createNutrientSchema = z.object({
  treeCode: z
    .string()
    .trim()
    .min(1, { message: 'Tree ID is required' })
    .max(50, 'Too long'),
  dateApplied: z.coerce
    .date({ errorMap: () => ({ message: 'Please enter a valid date' }) })
    .refine((date) => date instanceof Date && !isNaN(date), {
      message: 'Date is required',
    })
    .refine((date) => date <= new Date(), {
      message: 'Applied date cannot be in the future',
    }),
  product: z
    .string()
    .trim()
    .min(1, { message: 'Product is required' })
    .max(50, 'Too long'),
  amount: z.coerce
    .number()
    .min(1, { message: 'This should be greater than 1' })
    .max(100000, 'Too large'),
  applicationMethod: z
    .string()
    .trim()
    .max(20, 'Too long')
    .optional()
    .nullable(),
  unit: z.string().trim().max(20, 'Too long').min(1, 'Required'),
  inventoryItemId: z.string().trim().optional().nullable(),
});

export const createNutrient = (data) => {
  return api.post('/nutrients', data);
};

export const useCreateNutrient = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getNutrientsQueryOptions().queryKey,
      });
      onSuccess?.(...args);

      queryClient.invalidateQueries({
        queryKey: getInventoryQueryOptions().queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ['coconuts', 'stats'],
      });
    },
    ...restConfig,
    mutationFn: createNutrient,
  });
};
