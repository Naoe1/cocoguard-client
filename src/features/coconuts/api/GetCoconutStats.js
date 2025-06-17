import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getCoconutStats = ({ coconutId }) => {
  return api.get(`/coconuts/${coconutId}/stats`);
};

export const getCoconutStatsQueryOptions = (coconutId) => {
  return queryOptions({
    queryKey: ['coconuts', 'stats', coconutId],
    queryFn: () => getCoconutStats({ coconutId }),
  });
};

export const useCoconutStats = ({ coconutId, queryConfig }) => {
  return useQuery({
    ...getCoconutStatsQueryOptions(coconutId),
    ...queryConfig,
  });
};
