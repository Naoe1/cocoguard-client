import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export const checkDisease = (formData) => {
  return api.post('/coconuts/check-disease', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const useCheckDisease = ({ mutationConfig } = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: checkDisease,
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    ...restConfig,
  });
};
