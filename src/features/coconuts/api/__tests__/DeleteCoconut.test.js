import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteCoconut } from '../DeleteCoconut';
import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    delete: vi.fn(),
  },
}));

vi.mock('../GetCoconuts', () => ({
  getCoconutsQueryOptions: () => ({
    queryKey: ['coconuts'],
  }),
}));

describe('DeleteCoconut API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deleteCoconut', () => {
    it('should call api.delete with correct coconut ID', async () => {
      const coconutId = '123';
      const mockResponse = {
        data: { message: 'Coconut deleted successfully' },
      };

      api.delete.mockResolvedValue(mockResponse);

      const result = await deleteCoconut(coconutId);

      expect(api.delete).toHaveBeenCalledWith('/coconuts/123');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const coconutId = '123';
      const mockError = new Error('Delete failed');

      api.delete.mockRejectedValue(mockError);

      await expect(deleteCoconut(coconutId)).rejects.toThrow('Delete failed');
      expect(api.delete).toHaveBeenCalledWith('/coconuts/123');
    });

    it('should handle string and number IDs', async () => {
      const mockResponse = { data: { message: 'Deleted' } };
      api.delete.mockResolvedValue(mockResponse);

      // Test with string ID
      await deleteCoconut('456');
      expect(api.delete).toHaveBeenCalledWith('/coconuts/456');

      // Test with number ID
      await deleteCoconut(789);
      expect(api.delete).toHaveBeenCalledWith('/coconuts/789');
    });
  });
});
