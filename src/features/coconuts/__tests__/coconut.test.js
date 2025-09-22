import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCoconut, createCoconutSchema } from '../api/CreateCoconut';
import { deleteCoconut } from '../api/DeleteCoconut';
import { getCoconuts } from '../api/GetCoconuts';
import { updateCoconut } from '../api/UpdateCoconut';
import { getCoconut } from '../api/GetCoconut';

import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe('coconut schema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
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

  it('should reject invalid data format', () => {
    const invalidData = {
      treeCode: 'T001',
      height: 'fifteen meters',
      status: 'Healthy',
    };

    const result = createCoconutSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require treeCode', () => {
    const invalidData = {
      plantingDate: new Date('2023-01-15'),
      height: 15.5,
      trunkDiameter: 30.2,
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
    expect(result.error.issues[0].message).toBe('Max length is 20 characters');
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

describe('createCoconut api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should call api.post with correct parameters', async () => {
    const mockData = {
      treeCode: 'T9282',
      status: 'Healthy',
      height: 15.5,
      trunkDiameter: 3,
    };
    const mockResponse = { data: { id: '123', ...mockData } };

    api.post.mockResolvedValue(mockResponse);

    const result = await createCoconut(mockData);

    expect(api.post).toHaveBeenCalledWith('/coconuts', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle post API errors', async () => {
    const mockData = { treeCode: 'T001', status: 'Healthy' };
    const mockError = new Error('Network error');

    api.post.mockRejectedValue(mockError);

    await expect(createCoconut(mockData)).rejects.toThrow('Network error');
    expect(api.post).toHaveBeenCalledWith('/coconuts', mockData);
  });

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

  it('should handle delete API errors', async () => {
    const coconutId = '123';
    const mockError = new Error('Delete failed');

    api.delete.mockRejectedValue(mockError);

    await expect(deleteCoconut(coconutId)).rejects.toThrow('Delete failed');
    expect(api.delete).toHaveBeenCalledWith('/coconuts/123');
  });

  it('should handle string and number IDs', async () => {
    const mockResponse = { data: { message: 'Deleted' } };
    api.delete.mockResolvedValue(mockResponse);

    await deleteCoconut('456');
    expect(api.delete).toHaveBeenCalledWith('/coconuts/456');

    await deleteCoconut(789);
    expect(api.delete).toHaveBeenCalledWith('/coconuts/789');
  });

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

  it('should handle get API errors', async () => {
    const mockError = new Error('Failed to fetch coconuts');

    api.get.mockRejectedValue(mockError);

    await expect(getCoconuts()).rejects.toThrow('Failed to fetch coconuts');
    expect(api.get).toHaveBeenCalledWith('/coconuts');
  });

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

  it('should handle patchAPI errors', async () => {
    const mockData = { treeCode: 'T001' };
    const coconutId = '123';
    const mockError = new Error('Network error');

    api.patch.mockRejectedValue(mockError);

    await expect(
      updateCoconut({ data: mockData, id: coconutId }),
    ).rejects.toThrow('Network error');

    expect(api.patch).toHaveBeenCalledWith('/coconuts/123', mockData);
  });

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

    await getCoconut({ coconutId: '456' });
    expect(api.get).toHaveBeenCalledWith('/coconuts/456');
    await getCoconut({ coconutId: 789 });
    expect(api.get).toHaveBeenCalledWith('/coconuts/789');
  });

  it('should handle specific get API errors', async () => {
    const coconutId = '123';
    const mockError = new Error('Coconut not found');

    api.get.mockRejectedValue(mockError);

    await expect(getCoconut({ coconutId })).rejects.toThrow(
      'Coconut not found',
    );
    expect(api.get).toHaveBeenCalledWith('/coconuts/123');
  });

  it('should handle specific get 404 errors', async () => {
    const coconutId = '999';
    const notFoundError = new Error('Not Found');
    notFoundError.response = { status: 404 };

    api.get.mockRejectedValue(notFoundError);

    await expect(getCoconut({ coconutId })).rejects.toThrow('Not Found');
  });
});
