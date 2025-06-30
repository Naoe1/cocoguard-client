import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getTreatments = (params = {}) => {
  return api.get(`/treatments`, { params });
};

export const getTreatmentsQueryOptions = (params = {}) => {
  return queryOptions({
    queryKey: ['treatments', params],
    queryFn: () => getTreatments(params),
  });
};

export const useTreatments = ({ params = {}, queryConfig = {} } = {}) => {
  return useQuery({
    ...getTreatmentsQueryOptions(params),
    ...queryConfig,
  });
};
