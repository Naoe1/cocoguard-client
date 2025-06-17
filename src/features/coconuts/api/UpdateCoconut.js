import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getCoconutsQueryOptions } from './GetCoconuts';

export const updateCoconut = ({ data, id }) => {
  return api.patch(`/coconuts/${id}`, data);
};

export const useUpdateCoconut = ({ data, id, mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getCoconutsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateCoconut,
  });
};
