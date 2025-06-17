import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getCoconuts = () => {
  return api.get('/coconuts');
};

export const getCoconutsQueryOptions = () => {
  return queryOptions({
    queryKey: ['coconuts'],
    queryFn: getCoconuts,
  });
};

export const useCoconuts = ({ queryConfig }) => {
  return useQuery({
    ...getCoconutsQueryOptions(),
    ...queryConfig,
  });
};
