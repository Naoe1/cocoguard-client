import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { z } from 'zod';
import { getHarvestsQueryOptions } from './GetHarvests';
export const createHarvestSchema = z.object({
  treeCode: z.string().min(1, { message: 'Tree ID is required' }).trim(),
  coconutCount: z.coerce.number().min(1, { message: 'Enter valid count' }),
  totalWeight: z.coerce.number().min(1, { message: 'Enter valid weight' }),
  harvestDate: z.coerce
    .date({ errorMap: () => ({ message: 'Invalid date format' }) })
    .refine(
      (date) => {
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 100);
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 50);
        return date >= minDate && date <= maxDate;
      },
      {
        message:
          'Date must be within last 100 years and not more than 50 years in future',
      },
    ),
});

export const createHarvest = (data) => {
  return api.post('/harvests', data);
};

export const useCreateHarvest = ({ mutationConfig } = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getHarvestsQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['coconuts', 'stats'],
      });
      queryClient.invalidateQueries({
        queryKey: ['harvest', 'stats'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createHarvest,
  });
};
