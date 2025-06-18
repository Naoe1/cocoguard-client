import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getInventory = (params = {}) => {
  return api.get('/inventory', { params });
};

export const getInventoryQueryOptions = (params = {}) => {
  return queryOptions({
    queryKey: ['inventory', params],
    queryFn: () => getInventory(params),
  });
};

export const useInventory = ({ params = {}, queryConfig = {} } = {}) => {
  return useQuery({
    ...getInventoryQueryOptions(params),
    ...queryConfig,
  });
};
