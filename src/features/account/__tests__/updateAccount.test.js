import { describe, it, expect, vi, beforeEach } from 'vitest';

import { updateAccount, updateAccountSchema } from '../api/UpdateAccount';

import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe('UpdateAccount schema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseValid = {
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    street: '123 Coconut St',
    barangay: 'Baryo Uno',
    city: 'Cococity',
    province: 'Laguna',
    region: 'Region IV-A',
    postal_code: '4027',
    paypal_email: 'paypal@email.com',
  };

  it('accepts valid data', () => {
    const res = updateAccountSchema.safeParse(baseValid);
    expect(res.success).toBe(true);
  });

  it('requires non-empty firstName', () => {
    const res = updateAccountSchema.safeParse({ ...baseValid, firstName: '' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('First name is required');
  });

  it('requires non-empty lastName', () => {
    const res = updateAccountSchema.safeParse({ ...baseValid, lastName: '' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Last name is required');
  });

  it('requires non-empty street', () => {
    const res = updateAccountSchema.safeParse({ ...baseValid, street: '' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Street address is required');
  });

  it('requires non-empty barangay', () => {
    const res = updateAccountSchema.safeParse({ ...baseValid, barangay: '' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Barangay is required');
  });

  it('requires non-empty city', () => {
    const res = updateAccountSchema.safeParse({ ...baseValid, city: '' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('City/Municipality is required');
  });

  it('requires non-empty province', () => {
    const res = updateAccountSchema.safeParse({ ...baseValid, province: '' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Province is required');
  });

  it('requires non-empty region', () => {
    const res = updateAccountSchema.safeParse({ ...baseValid, region: '' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Region is required');
  });

  it('requires non-empty postal_code', () => {
    const res = updateAccountSchema.safeParse({
      ...baseValid,
      postal_code: '',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Postal code is required');
  });

  it('rejects firstName over 40 characters', () => {
    const long = 'a'.repeat(41);
    const res = updateAccountSchema.safeParse({
      ...baseValid,
      firstName: long,
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('First name too long');
  });

  it('rejects lastName over 40 characters', () => {
    const long = 'a'.repeat(41);
    const res = updateAccountSchema.safeParse({ ...baseValid, lastName: long });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Last name too long');
  });

  it('rejects street over 100 characters', () => {
    const long = 'a'.repeat(101);
    const res = updateAccountSchema.safeParse({ ...baseValid, street: long });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Street address too long');
  });

  it('rejects barangay over 30 characters', () => {
    const long = 'a'.repeat(31);
    const res = updateAccountSchema.safeParse({ ...baseValid, barangay: long });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Barangay too long');
  });

  it('rejects city over 30 characters', () => {
    const long = 'a'.repeat(31);
    const res = updateAccountSchema.safeParse({ ...baseValid, city: long });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('City/Municipality too long');
  });

  it('rejects province over 30 characters', () => {
    const long = 'a'.repeat(31);
    const res = updateAccountSchema.safeParse({ ...baseValid, province: long });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Province too long');
  });

  it('rejects region over 30 characters', () => {
    const long = 'a'.repeat(31);
    const res = updateAccountSchema.safeParse({ ...baseValid, region: long });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Region too long');
  });

  it('rejects postal_code with non-digits', () => {
    const res = updateAccountSchema.safeParse({
      ...baseValid,
      postal_code: '40A7',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe(
      'Postal code must contain only digits',
    );
  });

  it('rejects postal_code shorter than 4', () => {
    const res = updateAccountSchema.safeParse({
      ...baseValid,
      postal_code: '123',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe(
      'Postal code must be exactly 4 digits',
    );
  });

  it('rejects postal_code longer than 4', () => {
    const res = updateAccountSchema.safeParse({
      ...baseValid,
      postal_code: '12345',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe(
      'Postal code must be exactly 4 digits',
    );
  });
});

describe('update account api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.patch with correct parameters', async () => {
    const data = {
      firstName: 'Maria',
      lastName: 'Santos',
      street: '456 Palm Ave',
      barangay: 'Baryo Dos',
      city: 'Coco Town',
      province: 'Quezon',
      region: 'Region IV-A',
      postal_code: '4301',
    };

    const mockResponse = { data: { id: 'acct1', ...data } };
    api.patch.mockResolvedValue(mockResponse);

    const result = await updateAccount(data);

    expect(api.patch).toHaveBeenCalledWith('/auth/update-profile', data);
    expect(result).toEqual(mockResponse);
  });

  it('should handle patch API errors', async () => {
    const data = {
      firstName: 'Maria',
      lastName: 'Santos',
      street: '456 Palm Ave',
      barangay: 'Baryo Dos',
      city: 'Coco Town',
      province: 'Quezon',
      region: 'Region IV-A',
      postal_code: '4301',
    };

    const mockError = new Error('Network error');
    api.patch.mockRejectedValue(mockError);

    await expect(updateAccount(data)).rejects.toThrow('Network error');
    expect(api.patch).toHaveBeenCalledWith('/auth/update-profile', data);
  });
});
