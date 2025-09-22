import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createHarvest, createHarvestSchema } from '../api/CreateHarvest';
import { deleteHarvest } from '../api/DeleteHarvest';
import { getHarvests } from '../api/GetHarvests';
import { updateHarvest } from '../api/UpdateHarvest';
import { getHarvest } from '../api/GetHarvest';

import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Harvest schema', () => {
  it('accepts valid data', () => {
    const valid = {
      treeCode: 'T001',
      coconutCount: 10,
      totalWeight: 20,
      harvestDate: new Date('2024-01-02'),
    };
    const res = createHarvestSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('requires treeCode', () => {
    const res = createHarvestSchema.safeParse({
      coconutCount: 1,
      totalWeight: 1,
      harvestDate: new Date(),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/Required/i);
  });

  it('trims whitespace from treeCode', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: '  T001  ',
      coconutCount: 10,
      totalWeight: 20,
      harvestDate: new Date('2024-01-02'),
    });
    expect(res.success).toBe(true);
    expect(res.data.treeCode).toBe('T001');
  });

  it('limits treeCode to 20 characters', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: 'ThisTreeCodeIsTooLongForTheSystem',
      coconutCount: 10,
      totalWeight: 20,
      harvestDate: new Date('2024-01-02'),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/Max length is 20 characters/i);
  });

  it('coerces string numbers to numbers', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: 'T-1',
      coconutCount: '5',
      totalWeight: '7.5',
      harvestDate: '2024-01-03',
    });
    expect(res.success).toBe(true);
    expect(res.data.coconutCount).toBe(5);
    expect(res.data.totalWeight).toBe(7.5);
  });

  it('enforces positive coconut count', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: 'T-1',
      coconutCount: 0,
      totalWeight: 5,
      harvestDate: new Date(),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/enter valid count/i);
  });

  it('enforces positive weight', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: 'T-1',
      coconutCount: 5,
      totalWeight: -2,
      harvestDate: new Date(),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/enter valid weight/i);
  });

  it('rejects dates more than 50 years from now', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 60);
    const res = createHarvestSchema.safeParse({
      treeCode: 'T-1',
      coconutCount: 5,
      totalWeight: 5,
      harvestDate: future,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/within last 100 years/i);
  });

  it('rejects dates older than 100 years', () => {
    const past = new Date();
    past.setFullYear(past.getFullYear() - 120);
    const res = createHarvestSchema.safeParse({
      treeCode: 'T-1',
      coconutCount: 5,
      totalWeight: 5,
      harvestDate: past,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/within last 100 years/i);
  });

  it('rejects invalid date formats', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: 'T-1',
      coconutCount: 5,
      totalWeight: 5,
      harvestDate: 'not-a-date',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/invalid date/i);
  });

  it('enforces maximum coconut count of 1000', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: 'T001',
      coconutCount: 1001,
      totalWeight: 2000,
      harvestDate: new Date(),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /Coconut count cannot exceed 1000/i,
    );
  });

  it('enforces integer coconut count', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: 'T001',
      coconutCount: 5.5,
      totalWeight: 20,
      harvestDate: new Date(),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/must be an integer/i);
  });

  it('enforces maximum total weight of 5000', () => {
    const res = createHarvestSchema.safeParse({
      treeCode: 'T001',
      coconutCount: 500,
      totalWeight: 5001,
      harvestDate: new Date(),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /Total weight cannot exceed 5000/i,
    );
  });
});

describe('harvest api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.post with correct parameters for createHarvest', async () => {
    const mockData = {
      treeCode: 'T001',
      coconutCount: 10,
      totalWeight: 20,
      harvestDate: new Date('2024-01-02'),
    };
    const mockResponse = { data: { id: 'h1', ...mockData } };
    api.post.mockResolvedValue(mockResponse);

    const result = await createHarvest(mockData);

    expect(api.post).toHaveBeenCalledWith('/harvests', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle post API errors for createHarvest', async () => {
    const mockData = { treeCode: 'T001', coconutCount: 10 };
    const mockError = new Error('Network error');
    api.post.mockRejectedValue(mockError);

    await expect(createHarvest(mockData)).rejects.toThrow('Network error');
    expect(api.post).toHaveBeenCalledWith('/harvests', mockData);
  });

  it('should call api.delete with correct harvest ID', async () => {
    const harvestId = 'h123';
    const mockResponse = {
      data: { message: 'Harvest deleted successfully' },
    };
    api.delete.mockResolvedValue(mockResponse);

    const result = await deleteHarvest(harvestId);

    expect(api.delete).toHaveBeenCalledWith('/harvests/h123');
    expect(result).toEqual(mockResponse);
  });

  it('should handle delete API errors', async () => {
    const harvestId = 'h123';
    const mockError = new Error('Delete failed');
    api.delete.mockRejectedValue(mockError);

    await expect(deleteHarvest(harvestId)).rejects.toThrow('Delete failed');
    expect(api.delete).toHaveBeenCalledWith('/harvests/h123');
  });

  it('should call api.get with correct endpoint for getHarvests', async () => {
    const mockResponse = {
      data: [
        { id: 'h1', treeCode: 'T001', coconutCount: 10 },
        { id: 'h2', treeCode: 'T002', coconutCount: 15 },
      ],
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getHarvests();

    expect(api.get).toHaveBeenCalledWith('/harvests', {
      params: {},
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getHarvests', async () => {
    const mockError = new Error('Failed to fetch harvests');
    api.get.mockRejectedValue(mockError);

    await expect(getHarvests()).rejects.toThrow('Failed to fetch harvests');
  });

  it('should call api.patch with correct parameters for updateHarvest', async () => {
    const mockData = { coconutCount: 12 };
    const harvestId = 'h123';
    const mockResponse = { data: { id: harvestId, ...mockData } };
    api.patch.mockResolvedValue(mockResponse);

    const result = await updateHarvest({ data: mockData, id: harvestId });

    expect(api.patch).toHaveBeenCalledWith('/harvests/h123', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle patch API errors for updateHarvest', async () => {
    const mockData = { coconutCount: 12 };
    const harvestId = 'h123';
    const mockError = new Error('Network error');
    api.patch.mockRejectedValue(mockError);

    await expect(
      updateHarvest({ data: mockData, id: harvestId }),
    ).rejects.toThrow('Network error');
    expect(api.patch).toHaveBeenCalledWith('/harvests/h123', mockData);
  });

  it('should call api.get with correct harvest ID for getHarvest', async () => {
    const harvestId = 'h123';
    const mockResponse = {
      data: {
        id: 'h123',
        treeCode: 'T001',
        coconutCount: 10,
      },
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getHarvest({ harvestId });

    expect(api.get).toHaveBeenCalledWith('/harvests/h123');
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getHarvest', async () => {
    const harvestId = 'h123';
    const mockError = new Error('Harvest not found');
    api.get.mockRejectedValue(mockError);

    await expect(getHarvest({ harvestId })).rejects.toThrow(
      'Harvest not found',
    );
    expect(api.get).toHaveBeenCalledWith('/harvests/h123');
  });
});
