import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getHarvests = (params = {}) => {
  return api.get(`/harvests`, { params });
};

export const getHarvestsQueryOptions = (params = {}) => {
  return queryOptions({
    queryKey: ['harvests', params],
    queryFn: () => getHarvests(params),
  });
};

export const useHarvests = ({ params = {}, queryConfig = {} } = {}) => {
  return useQuery({
    ...getHarvestsQueryOptions(params),
    ...queryConfig,
  });
};
