import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getCopraPriceHistory = () => {
  return api.get('/products/copra/history');
};

export const getCopraPriceHistoryQueryOptions = () => {
  return queryOptions({
    queryKey: ['copra', 'history'],
    queryFn: getCopraPriceHistory,
  });
};

export const useCopraPriceHistory = ({ queryConfig } = {}) => {
  return useQuery({
    ...getCopraPriceHistoryQueryOptions(),
    ...queryConfig,
  });
};
