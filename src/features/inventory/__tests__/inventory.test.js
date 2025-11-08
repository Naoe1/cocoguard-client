import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createItem, createItemSchema } from '../api/CreateItem';
import { deleteItem } from '../api/DeleteItem';
import { getInventory } from '../api/GetInventory';
import { updateItem } from '../api/UpdateItem';
import { getItem } from '../api/GetItem';

import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Inventory schema', () => {
  it('accepts valid data', () => {
    const valid = {
      name: 'Coconut Oil',
      category: 'Processed Goods',
      stockQty: 100,
      amountPerUnit: 1,
      unit: 'Liters',
      stockPrice: 10.5,
      lowStockAlert: 10,
    };
    const res = createItemSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('requires name', () => {
    const res = createItemSchema.safeParse({
      category: 'Fertilizer',
      stockQty: 45,
      amountPerUnit: 100,
      unit: 'ML',
      stockPrice: 1200,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/required/i);
  });

  it('trims whitespace from name', () => {
    const res = createItemSchema.safeParse({
      name: '  Coconut Flakes  ',
      category: 'Processed Goods',
      stockQty: 50,
      amountPerUnit: 1,
      unit: 'kg',
    });
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Coconut Flakes');
  });

  it('limits name to 30 characters', () => {
    const res = createItemSchema.safeParse({
      name: 'a'.repeat(31),
      category: 'Fertilizer',
      stockQty: 45,
      amountPerUnit: 100,
      unit: 'ML',
      stockPrice: 1200,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /Name cannot exceed 30 characters/i,
    );
  });

  it('requires category', () => {
    const res = createItemSchema.safeParse({
      name: 'Copra',
      stockQty: 100,
      amountPerUnit: 1,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/required/i);
  });

  it('enforces stockQty greater than 1', () => {
    const res = createItemSchema.safeParse({
      name: 'Coconut Shake',
      category: 'Product',
      stockQty: 0,
      amountPerUnit: 1,
      unit: 'kg',
      stockPrice: 1200,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /This should be greater than 1/i,
    );
  });

  it('enforces stockQty less than 1000000', () => {
    const res = createItemSchema.safeParse({
      name: 'Copra',
      category: 'Product',
      stockQty: 1000001,
      amountPerUnit: 1,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /Exceeds maximum stock quantity/i,
    );
  });

  it('enforces amountPerUnit greater than 1', () => {
    const res = createItemSchema.safeParse({
      name: 'Copra',
      category: 'Product',
      stockQty: 50,
      amountPerUnit: 0,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /This should be greater than 1/i,
    );
  });

  it('enforces amountPerUnit less than 1000000', () => {
    const res = createItemSchema.safeParse({
      name: 'Copra',
      category: 'Product',
      stockQty: 50,
      amountPerUnit: 1000001,
      unit: 'kg',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /Exceeds maximum amount per unit/i,
    );
  });

  it('requires unit', () => {
    const res = createItemSchema.safeParse({
      name: 'Copra',
      category: 'Product',
      stockQty: 50,
      amountPerUnit: 1,
      // unit is missing
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/required/i);
  });

  it('rejects strings for stockQty that cannot be coerced to numbers', () => {
    const res = createItemSchema.safeParse({
      name: 'Tender Coconut',
      category: 'Fresh Produce',
      stockQty: 'not-a-number',
      amountPerUnit: 1,
      unit: 'pieces',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /Expected number, received nan/i,
    );
  });

  it('rejects strings for amountPerUnit that cannot be coerced to numbers', () => {
    const res = createItemSchema.safeParse({
      name: 'Coconut Chips',
      category: 'Snacks',
      stockQty: 50,
      amountPerUnit: 'not-a-number',
      unit: 'bags',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(
      /Expected number, received nan/i,
    );
  });

  it('allows optional fields to be null or undefined', () => {
    const res = createItemSchema.safeParse({
      name: 'Coconut Water',
      category: 'Beverage',
      stockQty: 150,
      amountPerUnit: 250,
      unit: 'ml',
      stockPrice: null,
    });
    expect(res.success).toBe(true);
    expect(res.data.stockPrice).toBeNull();
    expect(res.data.lowStockAlert).toBeUndefined();
  });
});

describe('inventory api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.post with correct parameters for createItem', async () => {
    const mockData = {
      name: 'Coconut Oil',
      category: 'Processed Goods',
      stockQty: 100,
      amountPerUnit: 1,
      unit: 'Liters',
    };
    const mockResponse = { data: { id: 'inv1', ...mockData } };
    api.post.mockResolvedValue(mockResponse);

    const result = await createItem(mockData);

    expect(api.post).toHaveBeenCalledWith('/inventory', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle post API errors for createItem', async () => {
    const mockData = { name: 'Coconut Oil', category: 'goods', stockQty: 10 };
    const mockError = new Error('Network error');
    api.post.mockRejectedValue(mockError);

    await expect(createItem(mockData)).rejects.toThrow('Network error');
    expect(api.post).toHaveBeenCalledWith('/inventory', mockData);
  });

  it('should call api.delete with correct inventory ID', async () => {
    const inventoryId = '123';
    const mockResponse = {
      data: { message: 'Inventory item deleted successfully' },
    };
    api.delete.mockResolvedValue(mockResponse);

    const result = await deleteItem(inventoryId);

    expect(api.delete).toHaveBeenCalledWith('/inventory/123');
    expect(result).toEqual(mockResponse);
  });

  it('should handle delete API errors', async () => {
    const inventoryId = 123;
    const mockError = new Error('Delete failed');
    api.delete.mockRejectedValue(mockError);

    await expect(deleteItem(inventoryId)).rejects.toThrow('Delete failed');
    expect(api.delete).toHaveBeenCalledWith('/inventory/123');
  });

  it('should call api.get with correct endpoint for getInventory', async () => {
    const mockResponse = {
      data: [
        { id: 1, name: 'Coconut Oil', stockQty: 100 },
        { id: 2, name: 'Copra', stockQty: 500 },
      ],
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getInventory();

    expect(api.get).toHaveBeenCalledWith('/inventory', {
      params: {},
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getInventory', async () => {
    const mockError = new Error('Failed to fetch inventory');
    api.get.mockRejectedValue(mockError);

    await expect(getInventory()).rejects.toThrow('Failed to fetch inventory');
    expect(api.get).toHaveBeenCalledWith('/inventory', {
      params: {},
    });
  });

  it('should call api.patch with correct parameters for updateItem', async () => {
    const mockData = { stockQty: 150 };
    const inventoryId = 'inv123';
    const mockResponse = { data: { id: inventoryId, ...mockData } };
    api.patch.mockResolvedValue(mockResponse);

    const result = await updateItem({ data: mockData, id: inventoryId });

    expect(api.patch).toHaveBeenCalledWith('/inventory/inv123', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle patch API errors for updateItem', async () => {
    const mockData = { stockQty: 150 };
    const inventoryId = 'inv123';
    const mockError = new Error('Network error');
    api.patch.mockRejectedValue(mockError);

    await expect(
      updateItem({ data: mockData, id: inventoryId }),
    ).rejects.toThrow('Network error');
    expect(api.patch).toHaveBeenCalledWith('/inventory/inv123', mockData);
  });

  it('should call api.get with correct inventory ID for getItem', async () => {
    const itemId = 123;
    const mockResponse = {
      data: {
        id: 123,
        name: 'Coconut Oil',
        stockQty: 100,
      },
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getItem({ itemId });

    expect(api.get).toHaveBeenCalledWith('/inventory/123');
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getItem', async () => {
    const itemId = 123;
    const mockError = new Error('Inventory item not found');
    api.get.mockRejectedValue(mockError);

    await expect(getItem({ itemId })).rejects.toThrow(
      'Inventory item not found',
    );
    expect(api.get).toHaveBeenCalledWith('/inventory/123');
  });
});
