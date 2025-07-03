import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getStaffsQueryOptions } from './GetStaffs';
import { z } from 'zod';
import { createStaffSchema } from './CreateStaff';

export const updateStaffSchema = createStaffSchema.extend({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required' })
    .optional(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .optional(),
});

export const updateStaff = ({ data, id }) => {
  return api.patch(`/staff/${id}`, data);
};

export const useUpdateStaff = ({ mutationConfig } = {}) => {
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
    mutationFn: updateStaff,
  });
};
