import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const saveLayout = (payload) => {
  return api.post('/coconuts/layout', payload);
};

export const useSaveLayout = ({ mutationConfig } = {}) => {
  return useMutation({
    mutationFn: saveLayout,
    ...mutationConfig,
  });
};
