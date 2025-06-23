import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getHarvest = ({ harvestId }) => {
  return api.get(`/harvests/${harvestId}`);
};

export const getHarvestQueryOptions = (harvestId) => {
  return queryOptions({
    queryKey: ['harvests', harvestId],
    queryFn: () => getHarvest({ harvestId }),
  });
};

export const useHarvest = ({ harvestId, queryConfig }) => {
  return useQuery({
    ...getHarvestQueryOptions(harvestId),
    ...queryConfig,
  });
};
