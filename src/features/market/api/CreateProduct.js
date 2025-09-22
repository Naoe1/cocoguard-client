import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { z } from 'zod';
import { getProductsQueryOptions } from './GetProducts';

export const createProductSchema = z.object({
  inventoryItemId: z
    .string()
    .min(1, { message: 'Please select a product from inventory' })
    .max(50, { message: 'ID seems too long' }),
  description: z
    .string()
    .max(300, { message: 'Max length is 300 characters' })
    .optional()
    .nullable(),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .positive({ message: 'Price must be positive' })
    .max(1000000, { message: 'Price seems too high' }),
  amountToSell: z.coerce
    .number({ invalid_type_error: 'Amount must be a number' })
    .int({ message: 'Amount must be a whole number' })
    .min(0, { message: 'Amount cannot be negative' })
    .max(1000000, { message: 'Amount seems too high' }),
  image: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .max(300, { message: 'Max length is 300 characters' })
    .optional()
    .or(z.literal('')),
});

export const createProduct = (data) => {
  return api.post('/products', data);
};

export const useCreateProduct = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProductsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createProduct,
  });
};
