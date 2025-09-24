import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createTreatment, createTreatmentSchema } from '../api/CreateTreatment';
import { deleteTreatment } from '../api/DeleteTreatment';
import { getTreatments } from '../api/GetTreatments';
import { updateTreatment } from '../api/UpdateTreatment';
import { getTreatment } from '../api/GetTreatment';

import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Treatment schema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseValidData = {
    treeCode: 'T001',
    dateApplied: new Date(),
    type: 'Pesticide',
    product: 'Pest-Away',
    amount: 5,
    unit: 'ml',
  };

  it('accepts valid data', () => {
    const res = createTreatmentSchema.safeParse(baseValidData);
    expect(res.success).toBe(true);
  });

  it('requires treeCode', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      treeCode: '',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('trims treeCode', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      treeCode: '  T002  ',
    });
    expect(res.success).toBe(true);
    expect(res.data.treeCode).toBe('T002');
  });

  it('rejects treeCode longer than 40 characters', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      treeCode: 'a'.repeat(41),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Too long');
  });

  it('requires dateApplied', () => {
    const { dateApplied, ...rest } = baseValidData;
    const res = createTreatmentSchema.safeParse(rest);
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Please enter a valid date');
  });

  it('rejects invalid dateApplied', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      dateApplied: 'not-a-date',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Please enter a valid date');
  });

  it('rejects future dates for dateApplied', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      dateApplied: futureDate,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe(
      'Applied date cannot be in the future',
    );
  });

  it('requires a valid type', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      type: 'InvalidType',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toContain('Invalid enum value');
  });

  it('requires product', () => {
    const { product, ...rest } = baseValidData;
    const res = createTreatmentSchema.safeParse(rest);
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('rejects product name longer than 50 characters', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      product: 'a'.repeat(51),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Product name is too long');
  });

  it('allows optional endDate to be undefined', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      endDate: undefined,
    });
    expect(res.success).toBe(true);
  });

  it('allows optional endDate to be null', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      endDate: null,
    });
    expect(res.success).toBe(true);
  });

  it('rejects invalid endDate format', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      endDate: 'invalid-date',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Invalid date format');
  });

  it('allows optional amount to be null', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      amount: null,
    });
    expect(res.success).toBe(true);
    expect(res.data.amount).toBeNull();
  });

  it('rejects non-positive amount', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      amount: 0,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Must be greater than 0');
  });

  it('rejects amount greater than 100000', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      amount: 100001,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Amount is too large');
  });

  it('rejects invalid number string for amount', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      amount: 'abc',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Amount must be a number');
  });

  it('requires unit', () => {
    const { unit, ...rest } = baseValidData;
    const res = createTreatmentSchema.safeParse(rest);
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('rejects unit longer than 10 characters', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      unit: 'a'.repeat(11),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Unit is too long');
  });

  it('trims unit', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      unit: '  kg  ',
    });
    expect(res.success).toBe(true);
    expect(res.data.unit).toBe('kg');
  });

  it('allows optional inventoryItemId', () => {
    const res = createTreatmentSchema.safeParse({
      ...baseValidData,
      inventoryItemId: undefined,
    });
    expect(res.success).toBe(true);
    expect(res.data.inventoryItemId).toBeUndefined();
  });
});

describe('treatment api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.post with correct parameters for createTreatment', async () => {
    const mockData = {
      treeCode: 'T002',
      dateApplied: new Date(),
      type: 'Herbicide',
      product: 'Weed-B-Gone',
      amount: 15,
      unit: 'L',
    };
    const mockResponse = { data: { id: 'treat1', ...mockData } };
    api.post.mockResolvedValue(mockResponse);

    const result = await createTreatment(mockData);

    expect(api.post).toHaveBeenCalledWith('/treatments', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle post API errors for createTreatment', async () => {
    const mockData = {
      treeCode: 'T002',
      product: 'Weed-B-Gone',
      amount: 15,
      unit: 'L',
    };
    const mockError = new Error('Network error');
    api.post.mockRejectedValue(mockError);

    await expect(createTreatment(mockData)).rejects.toThrow('Network error');
    expect(api.post).toHaveBeenCalledWith('/treatments', mockData);
  });

  it('should call api.delete with correct treatment ID', async () => {
    const treatmentId = '456';
    const mockResponse = {
      data: { message: 'Treatment record deleted successfully' },
    };
    api.delete.mockResolvedValue(mockResponse);

    const result = await deleteTreatment(treatmentId);

    expect(api.delete).toHaveBeenCalledWith('/treatments/456');
    expect(result).toEqual(mockResponse);
  });

  it('should handle delete API errors', async () => {
    const treatmentId = 456;
    const mockError = new Error('Delete failed');
    api.delete.mockRejectedValue(mockError);

    await expect(deleteTreatment(treatmentId)).rejects.toThrow('Delete failed');
    expect(api.delete).toHaveBeenCalledWith('/treatments/456');
  });

  it('should call api.get with correct endpoint for getTreatments', async () => {
    const mockResponse = {
      data: [
        { id: 1, product: 'Pest-Away', amount: 5 },
        { id: 2, product: 'Fungi-Stop', amount: 10 },
      ],
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getTreatments();

    expect(api.get).toHaveBeenCalledWith('/treatments', {
      params: {},
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getTreatments', async () => {
    const mockError = new Error('Failed to fetch treatment records');
    api.get.mockRejectedValue(mockError);

    await expect(getTreatments()).rejects.toThrow(
      'Failed to fetch treatment records',
    );
    expect(api.get).toHaveBeenCalledWith('/treatments', {
      params: {},
    });
  });

  it('should call api.patch with correct parameters for updateTreatment', async () => {
    const mockData = { amount: 20 };
    const treatmentId = 'treat123';
    const mockResponse = { data: { id: treatmentId, ...mockData } };
    api.patch.mockResolvedValue(mockResponse);

    const result = await updateTreatment({ data: mockData, id: treatmentId });

    expect(api.patch).toHaveBeenCalledWith('/treatments/treat123', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle patch API errors for updateTreatment', async () => {
    const mockData = { amount: 20 };
    const treatmentId = 'treat123';
    const mockError = new Error('Network error');
    api.patch.mockRejectedValue(mockError);

    await expect(
      updateTreatment({ data: mockData, id: treatmentId }),
    ).rejects.toThrow('Network error');
    expect(api.patch).toHaveBeenCalledWith('/treatments/treat123', mockData);
  });

  it('should call api.get with correct treatment ID for getTreatment', async () => {
    const treatmentId = 789;
    const mockResponse = {
      data: {
        id: 789,
        product: 'Weed-B-Gone',
        amount: 15,
      },
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getTreatment({ treatmentId });

    expect(api.get).toHaveBeenCalledWith('/treatments/789');
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getTreatment', async () => {
    const treatmentId = 789;
    const mockError = new Error('Treatment record not found');
    api.get.mockRejectedValue(mockError);

    await expect(getTreatment({ treatmentId })).rejects.toThrow(
      'Treatment record not found',
    );
    expect(api.get).toHaveBeenCalledWith('/treatments/789');
  });
});
