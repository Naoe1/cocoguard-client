import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { getTreatmentsQueryOptions } from './GetTreatments';

export const updateTreatment = ({ data, id }) => {
  return api.patch(`/treatments/${id}`, data);
};

export const useUpdateTreatment = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTreatmentsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateTreatment,
  });
};
