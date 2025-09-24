import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createStaff, createStaffSchema } from '../api/CreateStaff';
import { deleteStaff } from '../api/DeleteStaff';
import { getStaffs } from '../api/GetStaffs';
import { updateStaff } from '../api/UpdateStaff';
import { getStaff } from '../api/GetStaff';

import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Staff schema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts valid data', () => {
    const valid = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'STAFF',
    };
    const res = createStaffSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('rejects empty firstName', () => {
    const res = createStaffSchema.safeParse({
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'STAFF',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('rejects empty lastName', () => {
    const res = createStaffSchema.safeParse({
      firstName: 'John',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'STAFF',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('rejects too long firstName', () => {
    const longFirstName = 'A'.repeat(101);
    const res = createStaffSchema.safeParse({
      firstName: longFirstName,
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'STAFF',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('First name is too long');
  });

  it('rejects too long lastName', () => {
    const longLastName = 'A'.repeat(101);
    const res = createStaffSchema.safeParse({
      firstName: 'John',
      lastName: longLastName,
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'STAFF',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Last name is too long');
  });

  it('rejects empty emails', () => {
    const res = createStaffSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      role: 'STAFF',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Required');
  });

  it('rejects invalid emails', () => {
    const res = createStaffSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      password: 'password123',
      role: 'STAFF',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Invalid email address');
  });

  it('rejects invalid roles', () => {
    const res = createStaffSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'NOT_A_REAL_ROLE',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Role is required');
  });

  it('requires password with minimum length', () => {
    const res = createStaffSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'short',
      role: 'STAFF',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe(
      'Password must be at least 8 characters long',
    );
  });

  it('requires a valid role', () => {
    const res = createStaffSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'INVALID_ROLE',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toBe('Role is required');
  });

  it('trims names', () => {
    const res = createStaffSchema.safeParse({
      firstName: '  John  ',
      lastName: '  Doe  ',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'ADMIN',
    });
    expect(res.success).toBe(true);
    expect(res.data.firstName).toBe('John');
    expect(res.data.lastName).toBe('Doe');
  });
});

describe('staff api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.post with correct parameters for createStaff', async () => {
    const mockData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
      role: 'ADMIN',
    };
    const mockResponse = { data: { id: 'staff1', ...mockData } };
    api.post.mockResolvedValue(mockResponse);

    const result = await createStaff(mockData);

    expect(api.post).toHaveBeenCalledWith('/staff', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle post API errors for createStaff', async () => {
    const mockData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
      role: 'ADMIN',
    };
    const mockError = new Error('Network error');
    api.post.mockRejectedValue(mockError);

    await expect(createStaff(mockData)).rejects.toThrow('Network error');
    expect(api.post).toHaveBeenCalledWith('/staff', mockData);
  });

  it('should call api.delete with correct staff ID', async () => {
    const staffId = '123';
    const mockResponse = {
      data: { message: 'Staff member deleted successfully' },
    };
    api.delete.mockResolvedValue(mockResponse);

    const result = await deleteStaff(staffId);

    expect(api.delete).toHaveBeenCalledWith('/staff/123');
    expect(result).toEqual(mockResponse);
  });

  it('should handle delete API errors', async () => {
    const staffId = 123;
    const mockError = new Error('Delete failed');
    api.delete.mockRejectedValue(mockError);

    await expect(deleteStaff(staffId)).rejects.toThrow('Delete failed');
    expect(api.delete).toHaveBeenCalledWith('/staff/123');
  });

  it('should call api.get with correct endpoint for getStaffs', async () => {
    const mockResponse = {
      data: [
        { id: 1, firstName: 'John' },
        { id: 2, firstName: 'Jane' },
      ],
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getStaffs();

    expect(api.get).toHaveBeenCalledWith('/staff', { params: {} });
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getStaffs', async () => {
    const mockError = new Error('Failed to fetch staff');
    api.get.mockRejectedValue(mockError);

    await expect(getStaffs()).rejects.toThrow('Failed to fetch staff');
    expect(api.get).toHaveBeenCalledWith('/staff', { params: {} });
  });

  it('should call api.patch with correct parameters for updateStaff', async () => {
    const mockData = { role: 'ADMIN' };
    const staffId = 'staff123';
    const mockResponse = { data: { id: staffId, ...mockData } };
    api.patch.mockResolvedValue(mockResponse);

    const result = await updateStaff({ data: mockData, id: staffId });

    expect(api.patch).toHaveBeenCalledWith('/staff/staff123', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle patch API errors for updateStaff', async () => {
    const mockData = { role: 'ADMIN' };
    const staffId = 'staff123';
    const mockError = new Error('Network error');
    api.patch.mockRejectedValue(mockError);

    await expect(updateStaff({ data: mockData, id: staffId })).rejects.toThrow(
      'Network error',
    );
    expect(api.patch).toHaveBeenCalledWith('/staff/staff123', mockData);
  });

  it('should call api.get with correct staff ID for getStaff', async () => {
    const staffId = 123;
    const mockResponse = {
      data: {
        id: 123,
        firstName: 'John',
        role: 'STAFF',
      },
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await getStaff({ staffId });

    expect(api.get).toHaveBeenCalledWith('/staff/123');
    expect(result).toEqual(mockResponse);
  });

  it('should handle get API errors for getStaff', async () => {
    const staffId = 123;
    const mockError = new Error('Staff member not found');
    api.get.mockRejectedValue(mockError);

    await expect(getStaff({ staffId })).rejects.toThrow(
      'Staff member not found',
    );
    expect(api.get).toHaveBeenCalledWith('/staff/123');
  });
});
