import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getHarvestsQueryOptions } from './GetHarvests';

export const updateHarvest = ({ data, id }) => {
  return api.patch(`/harvests/${id}`, data);
};

export const useUpdateHarvest = ({ data, id, mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getHarvestsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateHarvest,
  });
};
