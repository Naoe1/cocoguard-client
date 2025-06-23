import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getInventoryQueryOptions } from '@/features/inventory/api/GetInventory';
import { getHarvestsQueryOptions } from './GetHarvests';

export const addHarvestToInventory = ({ data }) => {
  return api.patch(`/inventory/add-to-inventory`, data);
};

export const useAddHarvestToInventory = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInventoryQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getHarvestsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: addHarvestToInventory,
  });
};
