import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getAccount = () => {
  return api.get(`/auth/me`);
};

export const getAccountQueryOptions = () => {
  return queryOptions({
    queryKey: ['auth', 'me'],
    queryFn: getAccount,
  });
};

export const useAccount = ({ queryConfig }) => {
  return useQuery({
    ...getAccountQueryOptions(),
    ...queryConfig,
  });
};
