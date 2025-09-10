import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { updateCoconut, useUpdateCoconut } from '../UpdateCoconut';
import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    patch: vi.fn(),
  },
}));

vi.mock('../GetCoconuts', () => ({
  getCoconutsQueryOptions: () => ({
    queryKey: ['coconuts'],
  }),
}));

describe('UpdateCoconut API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateCoconut', () => {
    it('should call api.patch with correct parameters', async () => {
      const mockData = {
        treeCode: 'T001',
        status: 'Healthy',
        height: 15.5,
      };
      const coconutId = '123';
      const mockResponse = { data: { id: coconutId, ...mockData } };

      api.patch.mockResolvedValue(mockResponse);

      const result = await updateCoconut({ data: mockData, id: coconutId });

      expect(api.patch).toHaveBeenCalledWith('/coconuts/123', mockData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockData = { treeCode: 'T001' };
      const coconutId = '123';
      const mockError = new Error('Network error');

      api.patch.mockRejectedValue(mockError);

      await expect(
        updateCoconut({ data: mockData, id: coconutId }),
      ).rejects.toThrow('Network error');

      expect(api.patch).toHaveBeenCalledWith('/coconuts/123', mockData);
    });
  });
});
