import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getStore = ({ farmId }) => {
  return api.get(`/market/${farmId}`);
};

export const getStoreQueryOptions = (farmId) => {
  return queryOptions({
    queryKey: ['store', farmId],
    queryFn: () => getStore({ farmId }),
  });
};

export const useStore = ({ farmId, queryConfig } = {}) => {
  return useQuery({
    ...getStoreQueryOptions(farmId),
    ...queryConfig,
  });
};
