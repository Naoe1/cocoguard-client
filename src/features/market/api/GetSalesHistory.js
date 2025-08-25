import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getSalesHistory = () => {
  return api.get(`/products/sale-history`);
};

export const getSalesHistoryQueryOptions = () => {
  return queryOptions({
    queryKey: ['sale-history'],
    queryFn: getSalesHistory,
  });
};

export const useSalesHistory = ({ queryConfig } = {}) => {
  return useQuery({
    ...getSalesHistoryQueryOptions(),
    ...queryConfig,
  });
};
