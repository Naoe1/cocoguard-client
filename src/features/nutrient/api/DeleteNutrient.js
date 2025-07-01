import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getNutrientsQueryOptions } from './GetNutrients';

export const deleteNutrient = (id) => {
  return api.delete(`/nutrients/${id}`);
};

export const useDeleteNutrient = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getNutrientsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteNutrient,
  });
};
