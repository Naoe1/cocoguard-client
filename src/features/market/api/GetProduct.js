import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getProduct = ({ productId }) => {
  return api.get(`/products/${productId}`);
};

export const getProductQueryOptions = (productId) => {
  return queryOptions({
    queryKey: ['products', productId],
    queryFn: () => getProduct({ productId }),
    enabled: !!productId,
  });
};

export const useProduct = ({ productId, queryConfig } = {}) => {
  return useQuery({
    ...getProductQueryOptions(productId),
    ...queryConfig,
  });
};
