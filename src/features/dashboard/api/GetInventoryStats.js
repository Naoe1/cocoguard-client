import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getInventoryStats = () => {
  return api.get('/inventory/stats');
};

export const getInventoryStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ['inventory', 'count'],
    queryFn: getInventoryStats,
  });
};

export const useInventoryStats = ({ queryConfig } = {}) => {
  return useQuery({
    ...getInventoryStatsQueryOptions(),
    ...queryConfig,
  });
};
