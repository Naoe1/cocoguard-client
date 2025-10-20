import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { z } from 'zod';
import { getStaffsQueryOptions } from './GetStaffs';

export const createStaffSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name is too long' })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Last name is too long' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required' }),
  role: z.enum(['ADMIN', 'STAFF'], {
    errorMap: () => ({ message: 'Role is required' }),
  }),
});

export const createStaff = (data) => {
  return api.post('/staff/invite', data);
};

export const useCreateStaff = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getStaffsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createStaff,
  });
};
