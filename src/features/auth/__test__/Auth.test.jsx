import { describe, it, expect } from 'vitest';
import {
  loginInputSchema,
  registerInputSchema,
  forgotPasswordInputSchema,
  updatePasswordInputSchema,
} from '@/lib/auth';

describe('Register schema', () => {
  const baseValid = {
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan@example.com',
    password: 'password123',
    paypal_email: 'paypal@example.com',
    street: '123 Road',
    barangay: 'Central',
    city: 'Metro',
    province: 'Province',
    region: 'NCR',
    postal_code: '1234',
  };

  it('accepts valid data', () => {
    const res = registerInputSchema.safeParse(baseValid);
    expect(res.success).toBe(true);
  });

  it('requires required fields', () => {
    const { firstName, ...rest } = baseValid;
    const res = registerInputSchema.safeParse({ ...rest, firstName: '' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/Required|is required/i);
  });

  it('rejects password < 8', () => {
    const res = registerInputSchema.safeParse({
      ...baseValid,
      password: '123',
    });
    expect(res.success).toBe(false);
    expect(
      res.error.issues.find((i) => /Minimum 8 characters/i.test(i.message)),
    ).toBeTruthy();
  });

  it('rejects invalid email', () => {
    const res = registerInputSchema.safeParse({
      ...baseValid,
      email: 'not-an-email',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/email/i);
  });

  it('rejects invalid paypal email', () => {
    const res = registerInputSchema.safeParse({
      ...baseValid,
      paypal_email: 'wrong',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/paypal/i);
  });

  it('rejects firstName > 40 characters', () => {
    const res = registerInputSchema.safeParse({
      ...baseValid,
      firstName: 'x'.repeat(41),
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/too long/i);
  });

  it('enforces postal code digits only', () => {
    const res = registerInputSchema.safeParse({
      ...baseValid,
      postal_code: '12A4',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/digits/i);
  });

  it('enforces postal code must be exactly 4 digits', () => {
    const short = registerInputSchema.safeParse({
      ...baseValid,
      postal_code: '123',
    });
    expect(short.success).toBe(false);
    expect(short.error.issues[0].message).toMatch(/4 digits/i);

    const long = registerInputSchema.safeParse({
      ...baseValid,
      postal_code: '12345',
    });
    expect(long.success).toBe(false);
    expect(long.error.issues[0].message).toMatch(/4 digits/i);
  });
});

describe('Login schema', () => {
  it('accepts valid data', () => {
    const valid = { email: 'user@example.com', password: 'secret123' };
    const res = loginInputSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('requires email', () => {
    const res = loginInputSchema.safeParse({ password: 'secret123' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/Required/i);
  });

  it('requires password (non-empty)', () => {
    const res = loginInputSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/enter your password/i);
  });

  it('rejects invalid email format', () => {
    const res = loginInputSchema.safeParse({
      email: 'invalid-email',
      password: 'secret123',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/email/i);
  });

  it('rejects email longer than 30 characters (excluding domain check)', () => {
    const longLocal = 'averyveryveryverylongemailnamepart';
    const res = loginInputSchema.safeParse({
      email: longLocal + '@example.com',
      password: 'secret123',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/Too long/i);
  });

  it('trims whitespace around email before validation if handled by form layer (schema itself does not trim)', () => {
    const res = loginInputSchema.safeParse({
      email: '  user@example.com  ',
      password: 'secret123',
    });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/email/i);
  });

  it('allows minimal valid password length of 1 (schema only checks non-empty)', () => {
    const res = loginInputSchema.safeParse({
      email: 'user@example.com',
      password: 'a',
    });
    expect(res.success).toBe(true);
  });
});

describe('Forgot password schema', () => {
  it('accepts valid email', () => {
    const res = forgotPasswordInputSchema.safeParse({
      email: 'user@example.com',
    });
    expect(res.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const res = forgotPasswordInputSchema.safeParse({ email: 'bad' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/invalid email/i);
  });

  it('rejects missing email', () => {
    const res = forgotPasswordInputSchema.safeParse({});
    expect(res.success).toBe(false);
    expect(res.error.issues[0].message).toMatch(/Required/i);
  });
});

describe('Update password schema', () => {
  it('accepts valid matching passwords', () => {
    const res = updatePasswordInputSchema.safeParse({
      password: 'newStrong123',
      confirmPassword: 'newStrong123',
    });
    expect(res.success).toBe(true);
  });

  it('rejects password shorter than 8', () => {
    const res = updatePasswordInputSchema.safeParse({
      password: '123',
      confirmPassword: '123',
    });
    expect(res.success).toBe(false);
    expect(
      res.error.issues.find((i) => /at least 8 characters/i.test(i.message)),
    ).toBeTruthy();
  });

  it("rejects when passwords don't match", () => {
    const res = updatePasswordInputSchema.safeParse({
      password: 'password123',
      confirmPassword: 'password124',
    });
    expect(res.success).toBe(false);
    expect(
      res.error.issues.find((i) => /passwords don't match/i.test(i.message)),
    ).toBeTruthy();
  });
});
