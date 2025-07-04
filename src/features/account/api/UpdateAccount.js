import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { z } from 'zod';

export const updateAccountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  street: z.string().min(1, 'Street address is required'),
  barangay: z.string().min(1, 'Barangay is required'),
  city: z.string().min(1, 'City/Municipality is required'),
  province: z.string().min(1, 'Province is required'),
  region: z.string().min(1, 'Region is required'),
  postal_code: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^\d+$/, 'Postal code must contain only digits'),
});

export const updateAccount = (data) => {
  return api.patch('/auth/update-profile', data);
};

export const useUpdateAccount = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['auth', 'me'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateAccount,
  });
};
