import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getCoconutsStats = () => {
  return api.get('/coconuts/stats');
};

export const getCoconutsStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ['coconut', 'count'],
    queryFn: getCoconutsStats,
  });
};

export const useCoconutsStats = ({ queryConfig } = {}) => {
  return useQuery({
    ...getCoconutsStatsQueryOptions(),
    ...queryConfig,
  });
};
