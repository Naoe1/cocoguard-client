import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getHarvestStats = () => {
  return api.get('/harvests/stats');
};

export const getHarvestStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ['harvest', 'stats'],
    queryFn: getHarvestStats,
  });
};

export const useHarvestStats = ({ queryConfig } = {}) => {
  return useQuery({
    ...getHarvestStatsQueryOptions(),
    ...queryConfig,
  });
};
