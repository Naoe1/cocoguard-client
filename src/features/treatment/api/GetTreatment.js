import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getTreatment = ({ treatmentId }) => {
  return api.get(`/treatments/${treatmentId}`);
};

export const getTreatmentQueryOptions = (treatmentId) => {
  return queryOptions({
    queryKey: ['treatments', treatmentId],
    queryFn: () => getTreatment({ treatmentId }),
  });
};

export const useTreatment = ({ treatmentId, queryConfig } = {}) => {
  return useQuery({
    ...getTreatmentQueryOptions(treatmentId),
    ...queryConfig,
  });
};
