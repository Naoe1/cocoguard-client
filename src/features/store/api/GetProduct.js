import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getProduct = ({ productId, farmId }) => {
  return api.get(`/market/${farmId}/${productId}`);
};

export const getProductQueryOptions = (productId, farmId) => {
  return queryOptions({
    queryKey: ['products', farmId, productId],
    queryFn: () => getProduct({ productId, farmId }),
  });
};

export const useProduct = ({ productId, queryConfig, farmId } = {}) => {
  return useQuery({
    ...getProductQueryOptions(productId, farmId),
    ...queryConfig,
  });
};
