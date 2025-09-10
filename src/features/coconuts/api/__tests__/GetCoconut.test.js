import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getCoconut, getCoconutQueryOptions, useCoconut } from '../GetCoconut';
import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('GetCoconut API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCoconut', () => {
    it('should call api.get with correct coconut ID', async () => {
      const coconutId = '123';
      const mockResponse = {
        data: {
          id: '123',
          treeCode: 'T001',
          status: 'Healthy',
          height: 15.5,
          plantingDate: '2023-01-15',
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await getCoconut({ coconutId });

      expect(api.get).toHaveBeenCalledWith('/coconuts/123');
      expect(result).toEqual(mockResponse);
    });

    it('should handle different ID formats', async () => {
      const mockResponse = { data: { id: '456', treeCode: 'T002' } };
      api.get.mockResolvedValue(mockResponse);

      // Test with string ID
      await getCoconut({ coconutId: '456' });
      expect(api.get).toHaveBeenCalledWith('/coconuts/456');

      // Test with number ID
      await getCoconut({ coconutId: 789 });
      expect(api.get).toHaveBeenCalledWith('/coconuts/789');
    });

    it('should handle API errors', async () => {
      const coconutId = '123';
      const mockError = new Error('Coconut not found');

      api.get.mockRejectedValue(mockError);

      await expect(getCoconut({ coconutId })).rejects.toThrow(
        'Coconut not found',
      );
      expect(api.get).toHaveBeenCalledWith('/coconuts/123');
    });

    it('should handle 404 errors', async () => {
      const coconutId = '999';
      const notFoundError = new Error('Not Found');
      notFoundError.response = { status: 404 };

      api.get.mockRejectedValue(notFoundError);

      await expect(getCoconut({ coconutId })).rejects.toThrow('Not Found');
    });
  });

  describe('getCoconutQueryOptions', () => {
    it('should return correct query options with coconut ID', () => {
      const coconutId = '123';
      const options = getCoconutQueryOptions(coconutId);

      expect(options).toHaveProperty('queryKey');
      expect(options).toHaveProperty('queryFn');
      expect(options.queryKey).toEqual(['coconuts', '123']);
      expect(typeof options.queryFn).toBe('function');
    });

    it('should have queryFn that calls getCoconut with correct ID', async () => {
      const coconutId = '456';
      const mockResponse = { data: { id: '456', treeCode: 'T002' } };
      api.get.mockResolvedValue(mockResponse);

      const options = getCoconutQueryOptions(coconutId);
      const result = await options.queryFn();

      expect(api.get).toHaveBeenCalledWith('/coconuts/456');
      expect(result).toEqual(mockResponse);
    });

    it('should create unique query keys for different coconut IDs', () => {
      const options1 = getCoconutQueryOptions('123');
      const options2 = getCoconutQueryOptions('456');

      expect(options1.queryKey).toEqual(['coconuts', '123']);
      expect(options2.queryKey).toEqual(['coconuts', '456']);
      expect(options1.queryKey).not.toEqual(options2.queryKey);
    });
  });
});
