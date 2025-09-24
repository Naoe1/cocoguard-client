import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createNutrient, createNutrientSchema } from '../api/CreateNutrient';
import { deleteNutrient } from '../api/DeleteNutrient';
import { getNutrients } from '../api/GetNutrients';
import { updateNutrient } from '../api/UpdateNutrient';
import { getNutrient } from '../api/GetNutrient';

import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Nutrient schema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts valid data', () => {
    const valid = {
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
    };
    const res = createNutrientSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('requires treeCode', () => {
    const res = createNutrientSchema.safeParse({
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('rejects treeCode over 50 characters', () => {
    const longTreeCode = 'T'.repeat(51);
    const res = createNutrientSchema.safeParse({
      treeCode: longTreeCode,
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Too long');
  });

  it('rejects product over 50 characters', () => {
    const longProduct = 'F'.repeat(51);
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: longProduct,
      amount: 10,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Too long');
  });

  it('rejects amount above 100000', () => {
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 100001,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Too large');
  });

  it('rejects unit over 20 characters', () => {
    const longUnit = 'k'.repeat(21);
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: longUnit,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Too long');
  });

  it('rejects applicationMethod over 20 characters', () => {
    const longMethod = 'S'.repeat(21);
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
      applicationMethod: longMethod,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Too long');
  });

  it('accepts valid applicationMethod', () => {
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
      applicationMethod: 'Spraying',
    });
    expect(res.success).toBe(true);
    expect(res.data.applicationMethod).toBe('Spraying');
  });

  it('accepts valid inventoryItemId', () => {
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
      inventoryItemId: 'inv123',
    });
    expect(res.success).toBe(true);
    expect(res.data.inventoryItemId).toBe('inv123');
  });

  it('trims whitespace in inputs', () => {
    const dataWithSpaces = {
      treeCode: '  T001  ',
      dateApplied: new Date(),
      product: '  Fertilizer A  ',
      amount: 10,
      unit: '  kg  ',
    };
    const res = createNutrientSchema.safeParse(dataWithSpaces);
    expect(res.success).toBe(true);
    expect(res.data.treeCode).toBe('T001');
    expect(res.data.product).toBe('Fertilizer A');
    expect(res.data.unit).toBe('kg');
  });

  it('requires dateApplied', () => {
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Please enter a valid date');
  });

  it('rejects future dates for dateApplied', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: futureDate,
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe(
      'Applied date cannot be in the future',
    );
  });

  it('requires product', () => {
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      amount: 10,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('requires amount greater than 0', () => {
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 0,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('This should be greater than 1');
  });

  it('requires unit', () => {
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('allows optional fields to be null or undefined', () => {
    const res = createNutrientSchema.safeParse({
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
      applicationMethod: null,
      inventoryItemId: undefined,
    });
    expect(res.success).toBe(true);
    expect(res.data.applicationMethod).toBeNull();
    expect(res.data.inventoryItemId).toBeUndefined();
  });
});

describe('nutrient api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.post with correct parameters for createNutrient', async () => {
    const mockData = {
      treeCode: 'T001',
      dateApplied: new Date(),
      product: 'Fertilizer A',
      amount: 10,
      unit: 'kg',
    };
    const mockResponse = { data: { id: 'nut1', ...mockData } };
    api.post.mockResolvedValue(mockResponse);

    const result = await createNutrient(mockData);

    expect(api.post).toHaveBeenCalledWith('/nutrients', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle post API errors for createNutrient', async () => {
    const mockData = {
      treeCode: 'T001',
      product: 'Fertilizer',
      amount: 5,
      unit: 'g',
    };
    const mockError = new Error('Network error');
    api.post.mockRejectedValue(mockError);

    await expect(createNutrient(mockData)).rejects.toThrow('Network error');
    expect(api.post).toHaveBeenCalledWith('/nutrients', mockData);
  });

  it('should call api.delete with correct nutrient ID', async () => {
    const nutrientId = '123';
    const mockResponse = {
      data: { message: 'Nutrient record deleted successfully' },
    };
    api.delete.mockResolvedValue(mockResponse);

    const result = await deleteNutrient(nutrientId);

    expect(api.delete).toHaveBeenCalledWith('/nutrients/123');
    expect(result).toEqual(mockResponse);
  });

  it('should handle delete API errors', async () => {
    const nutrientId = 123;
    const mockError = new Error('Delete failed');
    api.delete.mockRejectedValue(mockError);

    await expect(deleteNutrient(nutrientId)).rejects.toThrow('Delete failed');
    expect(api.delete).toHaveBeenCalledWith('/nutrients/123');
  });

  it('should call api.get with correct endpoint for getNutrients', async () => {
    const mockResponse = {
      data: [
        { id: 1, product: 'Fertilizer A', amount: 10 },
        { id: 2, product: 'Fertilizer B', amount: 20 },
      ],
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getNutrients();

    expect(api.get).toHaveBeenCalledWith('/nutrients', {
      params: {},
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getNutrients', async () => {
    const mockError = new Error('Failed to fetch nutrient records');
    api.get.mockRejectedValue(mockError);

    await expect(getNutrients()).rejects.toThrow(
      'Failed to fetch nutrient records',
    );
    expect(api.get).toHaveBeenCalledWith('/nutrients', {
      params: {},
    });
  });

  it('should call api.patch with correct parameters for updateNutrient', async () => {
    const mockData = { amount: 15 };
    const nutrientId = 'nut123';
    const mockResponse = { data: { id: nutrientId, ...mockData } };
    api.patch.mockResolvedValue(mockResponse);

    const result = await updateNutrient({ data: mockData, id: nutrientId });

    expect(api.patch).toHaveBeenCalledWith('/nutrients/nut123', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle patch API errors for updateNutrient', async () => {
    const mockData = { amount: 15 };
    const nutrientId = 'nut123';
    const mockError = new Error('Network error');
    api.patch.mockRejectedValue(mockError);

    await expect(
      updateNutrient({ data: mockData, id: nutrientId }),
    ).rejects.toThrow('Network error');
    expect(api.patch).toHaveBeenCalledWith('/nutrients/nut123', mockData);
  });

  it('should call api.get with correct nutrient ID for getNutrient', async () => {
    const nutrientId = 123;
    const mockResponse = {
      data: {
        id: 123,
        product: 'Fertilizer A',
        amount: 10,
      },
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getNutrient({ nutrientId });

    expect(api.get).toHaveBeenCalledWith('/nutrients/123');
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getNutrient', async () => {
    const nutrientId = 123;
    const mockError = new Error('Nutrient record not found');
    api.get.mockRejectedValue(mockError);

    await expect(getNutrient({ nutrientId })).rejects.toThrow(
      'Nutrient record not found',
    );
    expect(api.get).toHaveBeenCalledWith('/nutrients/123');
  });
});
