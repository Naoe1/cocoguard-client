import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { z } from 'zod';

export const updateAccountSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(40, 'First name too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(40, 'Last name too long'),
  street: z
    .string()
    .min(1, 'Street address is required')
    .max(30, 'Street address too long'),
  barangay: z
    .string()
    .min(1, 'Barangay is required')
    .max(30, 'Barangay too long'),
  city: z
    .string()
    .min(1, 'City/Municipality is required')
    .max(30, 'City/Municipality too long'),
  province: z
    .string()
    .min(1, 'Province is required')
    .max(30, 'Province too long'),
  region: z.string().min(1, 'Region is required').max(30, 'Region too long'),
  postal_code: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^\d+$/, 'Postal code must contain only digits')
    .length(4, 'Postal code must be exactly 4 digits'),
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
