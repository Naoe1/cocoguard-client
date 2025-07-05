import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getProducts = () => {
  return api.get(`/products`);
};

export const getProductsQueryOptions = () => {
  return queryOptions({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

export const useProducts = ({ queryConfig } = {}) => {
  return useQuery({
    ...getProductsQueryOptions(),
    ...queryConfig,
  });
};
