import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getStaff = ({ staffId }) => {
  return api.get(`/staff/${staffId}`);
};

export const getStaffQueryOptions = (staffId) => {
  return queryOptions({
    queryKey: ['staff', staffId],
    queryFn: () => getStaff({ staffId }),
  });
};

export const useStaff = ({ staffId, queryConfig } = {}) => {
  return useQuery({
    ...getStaffQueryOptions(staffId),
    ...queryConfig,
  });
};
