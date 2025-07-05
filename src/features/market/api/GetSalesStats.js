import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getSalesStats = () => {
  return api.get('/products/stats');
};

export const getHSalesStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ['products', 'stats'],
    queryFn: getSalesStats,
  });
};

export const useSalesStats = ({ queryConfig } = {}) => {
  return useQuery({
    ...getHSalesStatsQueryOptions(),
    ...queryConfig,
  });
};
