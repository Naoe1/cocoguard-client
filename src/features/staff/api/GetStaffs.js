import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getStaffs = (params = {}) => {
  return api.get(`/staff`, { params });
};

export const getStaffsQueryOptions = (params = {}) => {
  return queryOptions({
    queryKey: ['staff', params],
    queryFn: () => getStaffs(params),
  });
};

export const useStaffs = ({ params = {}, queryConfig = {} } = {}) => {
  return useQuery({
    ...getStaffsQueryOptions(params),
    ...queryConfig,
  });
};
