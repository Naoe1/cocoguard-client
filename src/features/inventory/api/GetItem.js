import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getItem = ({ itemId }) => {
  return api.get(`/inventory/${itemId}`);
};

export const getItemQueryOptions = (itemId) => {
  return queryOptions({
    queryKey: ['inventory', itemId],
    queryFn: () => getItem({ itemId }),
  });
};

export const useItem = ({ itemId, queryConfig } = {}) => {
  return useQuery({
    ...getItemQueryOptions(itemId),
    ...queryConfig,
  });
};
