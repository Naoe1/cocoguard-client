import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getCoconut = ({ coconutId }) => {
  return api.get(`/coconuts/${coconutId}`);
};

export const getCoconutQueryOptions = (coconutId) => {
  return queryOptions({
    queryKey: ['coconuts', coconutId],
    queryFn: () => getCoconut({ coconutId }),
  });
};

export const useCoconut = ({ coconutId, queryConfig }) => {
  return useQuery({
    ...getCoconutQueryOptions(coconutId),
    ...queryConfig,
  });
};
