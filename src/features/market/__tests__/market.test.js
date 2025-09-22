import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProduct, createProductSchema } from '../api/CreateProduct';
import { deleteProduct } from '../api/DeleteProduct';
import { getProducts } from '../api/GetProducts';
import { updateProduct } from '../api/UpdateProduct';
import { getProduct } from '../api/GetProduct';
import { getCopraPriceHistory } from '../api/GetPriceHistory';
import { getSalesHistory } from '../api/GetSalesHistory';
import { getSalesStats } from '../api/GetSalesStats';

import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe('product schema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should validate valid product data', () => {
    const validData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 100,
      description: 'A fine product',
    };

    const result = createProductSchema.safeParse(validData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validData);
  });

  it('should reject invalid data format', () => {
    const invalidData = {
      inventoryItemId: '123',
      price: 'ten dollars',
      amountToSell: 100,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require inventoryItemId', () => {
    const invalidData = {
      price: 10.99,
      amountToSell: 100,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Required');
  });

  it('should validate maximum length of inventoryItemId', () => {
    const invalidData = {
      inventoryItemId: '12345678901234567890123456789012345678901234567890123',
      price: 10.99,
      amountToSell: 100,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('ID seems too long');
  });

  it('should validate maximum length of description', () => {
    const longDescription = 'a'.repeat(301);
    const invalidData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 100,
      description: longDescription,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Max length is 300 characters');
  });

  it('should validate positive price', () => {
    const invalidData = {
      inventoryItemId: '123',
      price: -5,
      amountToSell: 100,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Price must be positive');
  });

  it('should validate maximum price limit', () => {
    const invalidData = {
      inventoryItemId: '123',
      price: 1500000,
      amountToSell: 100,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Price seems too high');
  });

  it('should validate non-negative amountToSell', () => {
    const invalidData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: -1,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Amount cannot be negative');
  });

  it('should validate maximum amountToSell', () => {
    const invalidData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 1500000,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Amount seems too high');
  });

  it('should validate URLs', () => {
    const invalidData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 100,
      image: 'invalid-url',
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Please enter a valid URL');
  });

  it('should accept valid URLs', () => {
    const validData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 100,
      image: 'https://example.com/product',
    };

    const result = createProductSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate integer amountToSell', () => {
    const invalidData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 10.5,
    };

    const result = createProductSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      'Amount must be a whole number',
    );
  });

  it('should allow optional fields to be undefined', () => {
    const minimalData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 100,
    };

    const result = createProductSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('should coerce string numbers to numbers', () => {
    const data = {
      inventoryItemId: '123',
      price: '10.99',
      amountToSell: '100',
    };

    const result = createProductSchema.safeParse(data);
    expect(result.success).toBe(true);
    expect(result.data.price).toBe(10.99);
    expect(result.data.amountToSell).toBe(100);
  });
});

describe('market api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should call api.post with correct parameters for createProduct', async () => {
    const mockData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 100,
    };
    const mockResponse = { data: { id: 'prod-123', ...mockData } };

    api.post.mockResolvedValue(mockResponse);

    const result = await createProduct(mockData);

    expect(api.post).toHaveBeenCalledWith('/products', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle post API errors for createProduct', async () => {
    const mockData = {
      inventoryItemId: '123',
      price: 10.99,
      amountToSell: 100,
    };
    const mockError = new Error('Network error');

    api.post.mockRejectedValue(mockError);

    await expect(createProduct(mockData)).rejects.toThrow('Network error');
    expect(api.post).toHaveBeenCalledWith('/products', mockData);
  });

  it('should call api.delete with correct product ID', async () => {
    const productId = 'prod-123';
    const mockResponse = {
      data: { message: 'Product deleted successfully' },
    };

    api.delete.mockResolvedValue(mockResponse);

    const result = await deleteProduct(productId);

    expect(api.delete).toHaveBeenCalledWith(`/products/${productId}`);
    expect(result).toEqual(mockResponse);
  });

  it('should handle delete API errors', async () => {
    const productId = 'prod-123';
    const mockError = new Error('Delete failed');

    api.delete.mockRejectedValue(mockError);

    await expect(deleteProduct(productId)).rejects.toThrow('Delete failed');
    expect(api.delete).toHaveBeenCalledWith(`/products/${productId}`);
  });

  it('should call api.get with correct endpoint for getProducts', async () => {
    const mockResponse = {
      data: [
        { id: 'prod-1', name: 'Product 1' },
        { id: 'prod-2', name: 'Product 2' },
      ],
    };

    api.get.mockResolvedValue(mockResponse);

    const result = await getProducts();

    expect(api.get).toHaveBeenCalledWith('/products');
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getProducts', async () => {
    const mockError = new Error('Failed to fetch products');

    api.get.mockRejectedValue(mockError);

    await expect(getProducts()).rejects.toThrow('Failed to fetch products');
    expect(api.get).toHaveBeenCalledWith('/products');
  });

  it('should call api.patch with correct parameters for updateProduct', async () => {
    const mockData = { price: 12.99 };
    const productId = 'prod-123';
    const mockResponse = { data: { id: productId, ...mockData } };

    api.patch.mockResolvedValue(mockResponse);

    const result = await updateProduct({ data: mockData, id: productId });

    expect(api.patch).toHaveBeenCalledWith(`/products/${productId}`, mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle patch API errors for updateProduct', async () => {
    const mockData = { price: 12.99 };
    const productId = 'prod-123';
    const mockError = new Error('Network error');

    api.patch.mockRejectedValue(mockError);

    await expect(
      updateProduct({ data: mockData, id: productId }),
    ).rejects.toThrow('Network error');

    expect(api.patch).toHaveBeenCalledWith(`/products/${productId}`, mockData);
  });

  it('should call api.get with correct product ID for getProduct', async () => {
    const productId = 'prod-123';
    const mockResponse = {
      data: {
        id: 'prod-123',
        name: 'A Product',
        price: 10.99,
      },
    };

    api.get.mockResolvedValue(mockResponse);

    const result = await getProduct({ productId });

    expect(api.get).toHaveBeenCalledWith(`/products/${productId}`);
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getProduct', async () => {
    const productId = 'prod-123';
    const mockError = new Error('Product not found');

    api.get.mockRejectedValue(mockError);

    await expect(getProduct({ productId })).rejects.toThrow(
      'Product not found',
    );
    expect(api.get).toHaveBeenCalledWith(`/products/${productId}`);
  });

  it('should call api.get for getPriceHistory', async () => {
    const mockResponse = { data: [{ date: '2024-01-01', price: 1.5 }] };
    api.get.mockResolvedValue(mockResponse);
    const result = await getCopraPriceHistory();
    expect(api.get).toHaveBeenCalledWith('/products/copra/history');
    expect(result).toEqual(mockResponse);
  });

  it('should call api.get for getSalesHistory', async () => {
    const mockResponse = { data: [{ date: '2024-01-01', sales: 100 }] };
    api.get.mockResolvedValue(mockResponse);
    const result = await getSalesHistory();
    expect(api.get).toHaveBeenCalledWith('/products/sale-history');
    expect(result).toEqual(mockResponse);
  });

  it('should call api.get for getSalesStats', async () => {
    const mockResponse = { data: { totalSales: 5000 } };
    api.get.mockResolvedValue(mockResponse);
    const result = await getSalesStats();
    expect(api.get).toHaveBeenCalledWith('/products/stats');
    expect(result).toEqual(mockResponse);
  });
});
