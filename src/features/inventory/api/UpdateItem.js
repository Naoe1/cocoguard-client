import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getInventoryQueryOptions } from './GetInventory';
import { getProductsQueryOptions } from '../../market/api/GetProducts';

export const updateItem = ({ data, id }) => {
  return api.patch(`/inventory/${id}`, data);
};

export const useUpdateItem = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInventoryQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getProductsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateItem,
  });
};
