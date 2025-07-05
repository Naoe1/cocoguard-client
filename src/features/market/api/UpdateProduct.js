import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getProductsQueryOptions } from './GetProducts';
import { getProductQueryOptions } from './GetProduct';

export const updateProduct = ({ data, id }) => {
  return api.patch(`/products/${id}`, data);
};

export const useUpdateProduct = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (data, variables, context) => {
      // Invalidate list query
      queryClient.invalidateQueries({
        queryKey: getProductsQueryOptions().queryKey,
      });
      // Invalidate specific product query
      queryClient.invalidateQueries({
        queryKey: getProductQueryOptions(variables.id).queryKey,
      });
      onSuccess?.(data, variables, context);
    },
    ...restConfig,
    mutationFn: updateProduct,
  });
};
