import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getStaffStats = () => {
  return api.get('/staff/count');
};

export const getStaffStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ['staff', 'count'],
    queryFn: getStaffStats,
  });
};

export const useStaffStats = ({ queryConfig } = {}) => {
  return useQuery({
    ...getStaffStatsQueryOptions(),
    ...queryConfig,
  });
};
