import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getStats = () => {
  return api.get('/stats');
};

export const getStatsQueryOptions = (params = {}) => {
  return queryOptions({
    queryKey: ['stats'],
    queryFn: getStats,
  });
};

export const useStats = ({ queryConfig } = {}) => {
  return useQuery({
    ...getStatsQueryOptions(),
    ...queryConfig,
  });
};
