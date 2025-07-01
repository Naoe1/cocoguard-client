import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getNutrientsQueryOptions } from './GetNutrients';

export const updateNutrient = ({ data, id }) => {
  return api.patch(`/nutrients/${id}`, data);
};

export const useUpdateNutrient = ({ mutationConfig } = {}) => {
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
    mutationFn: updateNutrient,
  });
};
