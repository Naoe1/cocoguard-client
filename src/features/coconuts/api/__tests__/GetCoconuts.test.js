import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  getCoconuts,
  getCoconutsQueryOptions,
  useCoconuts,
} from '../GetCoconuts';
import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('GetCoconuts API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCoconuts', () => {
    it('should call api.get with correct endpoint', async () => {
      const mockResponse = {
        data: [
          { id: '1', treeCode: 'T001', status: 'Healthy' },
          { id: '2', treeCode: 'T002', status: 'Diseased' },
        ],
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await getCoconuts();

      expect(api.get).toHaveBeenCalledWith('/coconuts');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch coconuts');

      api.get.mockRejectedValue(mockError);

      await expect(getCoconuts()).rejects.toThrow('Failed to fetch coconuts');
      expect(api.get).toHaveBeenCalledWith('/coconuts');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';

      api.get.mockRejectedValue(networkError);

      await expect(getCoconuts()).rejects.toThrow('Network Error');
    });
  });

  describe('getCoconutsQueryOptions', () => {
    it('should return correct query options', () => {
      const options = getCoconutsQueryOptions();

      expect(options).toHaveProperty('queryKey');
      expect(options).toHaveProperty('queryFn');
      expect(options.queryKey).toEqual(['coconuts']);
      expect(typeof options.queryFn).toBe('function');
    });

    it('should have queryFn that calls getCoconuts', async () => {
      const mockResponse = { data: [] };
      api.get.mockResolvedValue(mockResponse);

      const options = getCoconutsQueryOptions();
      const result = await options.queryFn();

      expect(api.get).toHaveBeenCalledWith('/coconuts');
      expect(result).toEqual(mockResponse);
    });
  });
});
