import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCoconut, createCoconutSchema } from '../CreateCoconut';
import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock('../GetCoconuts', () => ({
  getCoconutsQueryOptions: () => ({
    queryKey: ['coconuts'],
  }),
}));

describe('CreateCoconut API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCoconutSchema', () => {
    it('should validate valid coconut data', () => {
      const validData = {
        treeCode: 'T001',
        plantingDate: new Date('2023-01-15'),
        height: 15.5,
        trunkDiameter: 30.2,
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should require treeCode', () => {
      const invalidData = {
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Required');
    });

    it('should validate treeCode length', () => {
      const invalidData = {
        treeCode: 'T'.repeat(21), // Too long
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe(
        'Max length is 20 characters',
      );
    });

    it('should trim treeCode whitespace', () => {
      const data = {
        treeCode: '  T001  ',
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.treeCode).toBe('T001');
    });

    it('should validate status enum', () => {
      const invalidData = {
        treeCode: 'T001',
        status: 'Unknown',
      };

      const result = createCoconutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Invalid enum value');
    });

    it('should validate positive height', () => {
      const invalidData = {
        treeCode: 'T001',
        height: -5,
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe(
        'Height must be a positive number',
      );
    });

    it('should validate positive trunk diameter', () => {
      const invalidData = {
        treeCode: 'T001',
        trunkDiameter: 0,
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe(
        'Trunk diameter must be a positive number',
      );
    });

    it('should validate planting date range', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 60); // Too far in future

      const invalidData = {
        treeCode: 'T001',
        plantingDate: futureDate,
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain(
        'Date must be within last 100 years',
      );
    });

    it('should allow optional fields to be undefined', () => {
      const minimalData = {
        treeCode: 'T001',
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should coerce string numbers to numbers', () => {
      const data = {
        treeCode: 'T001',
        height: '15.5',
        trunkDiameter: '30.2',
        status: 'Healthy',
      };

      const result = createCoconutSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.height).toBe(15.5);
      expect(result.data.trunkDiameter).toBe(30.2);
    });
  });

  describe('createCoconut', () => {
    it('should call api.post with correct parameters', async () => {
      const mockData = {
        treeCode: 'T001',
        status: 'Healthy',
        height: 15.5,
      };
      const mockResponse = { data: { id: '123', ...mockData } };

      api.post.mockResolvedValue(mockResponse);

      const result = await createCoconut(mockData);

      expect(api.post).toHaveBeenCalledWith('/coconuts', mockData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockData = { treeCode: 'T001', status: 'Healthy' };
      const mockError = new Error('Network error');

      api.post.mockRejectedValue(mockError);

      await expect(createCoconut(mockData)).rejects.toThrow('Network error');
      expect(api.post).toHaveBeenCalledWith('/coconuts', mockData);
    });
  });
});
