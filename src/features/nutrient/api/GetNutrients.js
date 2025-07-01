import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getNutrients = (params = {}) => {
  return api.get(`/nutrients`, { params });
};

export const getNutrientsQueryOptions = (params = {}) => {
  return queryOptions({
    queryKey: ['nutrients', params],
    queryFn: () => getNutrients(params),
  });
};

export const useNutrients = ({ params = {}, queryConfig = {} } = {}) => {
  return useQuery({
    ...getNutrientsQueryOptions(params),
    ...queryConfig,
  });
};
