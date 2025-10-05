import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const getAuditEvents = (params) => {
  return api.get('/audit-events', { params });
};

export const getAuditEventsQueryOptions = (params) => {
  return queryOptions({
    queryKey: ['audit-events', params ?? {}],
    queryFn: () => getAuditEvents(params),
  });
};

export const useAuditEvents = ({ queryConfig, params } = {}) => {
  return useQuery({
    ...getAuditEventsQueryOptions(params),
    ...queryConfig,
  });
};
