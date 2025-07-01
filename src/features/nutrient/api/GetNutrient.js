import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getNutrient = ({ nutrientId }) => {
  return api.get(`/nutrients/${nutrientId}`);
};

export const getNutrientQueryOptions = (nutrientId) => {
  return queryOptions({
    queryKey: ['nutrients', nutrientId],
    queryFn: () => getNutrient({ nutrientId }),
  });
};

export const useNutrient = ({ nutrientId, queryConfig } = {}) => {
  return useQuery({
    ...getNutrientQueryOptions(nutrientId),
    ...queryConfig,
  });
};
