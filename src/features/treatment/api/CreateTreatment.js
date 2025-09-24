import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { z } from 'zod';
import { getTreatmentsQueryOptions } from './GetTreatments';
import { getInventoryQueryOptions } from '@/features/inventory/api/GetInventory';

export const createTreatmentSchema = z.object({
  treeCode: z
    .string()
    .min(1, { message: 'Required' })
    .max(40, { message: 'Too long' })
    .trim(),
  dateApplied: z.coerce
    .date({ errorMap: () => ({ message: 'Please enter a valid date' }) })
    .refine((date) => date instanceof Date && !isNaN(date), {
      message: 'Date is required',
    })
    .refine((date) => date <= new Date(), {
      message: 'Applied date cannot be in the future',
    })
    .refine(
      (date) => {
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 100);
        return date >= minDate;
      },
      {
        message: 'Cannot be earlier than 100 years ago',
      },
    ),
  type: z.enum(['Pesticide', 'Fungicide', 'Others', 'Herbicide']),
  product: z
    .string()
    .min(1, { message: 'Product is required' })
    .max(50, { message: 'Product name is too long' })
    .trim(),
  endDate: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce
      .date({ errorMap: () => ({ message: 'Invalid date format' }) })
      .refine(
        (date) => {
          if (!date) return true;
          const minDate = new Date();
          minDate.setFullYear(minDate.getFullYear() - 100);
          const maxDate = new Date();
          maxDate.setFullYear(maxDate.getFullYear() + 50);
          return date >= minDate && date <= maxDate;
        },
        {
          message: 'Date must be a valid date',
        },
      )
      .optional()
      .nullable(),
  ),
  inventoryItemId: z.string().trim().optional().nullable(),
  amount: z.coerce
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Must be greater than 0')
    .max(100000, { message: 'Amount is too large' })
    .optional()
    .nullable(),
  unit: z
    .string()
    .min(1, { message: 'Unit is required' })
    .max(10, { message: 'Unit is too long' })
    .trim(),
});

export const createTreatment = (data) => {
  console.log('Creating treatment with data:', data);
  return api.post('/treatments', data);
};

export const useCreateTreatment = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTreatmentsQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getInventoryQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['coconuts', 'stats'],
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createTreatment,
  });
};
