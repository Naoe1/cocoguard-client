import { describe, it, expect, beforeEach, vi } from 'vitest';
import { forwardFillMissingDates } from '../utils';

describe('forwardFillMissingDates', () => {
  let mockToday;

  beforeEach(() => {
    // Mock today's date to September 8, 2025 for consistent testing
    mockToday = new Date('2025-09-08T12:00:00.000Z');
    vi.setSystemTime(mockToday);
  });

  it('should return 15 days of data starting from 14 days ago', () => {
    const inputData = [
      { date: '2025-09-01', price: 100 },
      { date: '2025-09-05', price: 150 },
    ];

    const result = forwardFillMissingDates(inputData);

    expect(result).toHaveLength(15);
    expect(result[0].date).toBe('2025-08-25');
    expect(result[14].date).toBe('2025-09-08');
  });

  it('should forward fill prices for missing dates', () => {
    const inputData = [
      { date: '2025-08-26', price: 100 },
      { date: '2025-09-02', price: 150 },
    ];

    const result = forwardFillMissingDates(inputData);

    // Price should be 100 from Aug 26 onwards until Sep 2
    expect(result[1].price).toBe(100); // Aug 26
    expect(result[7].price).toBe(100); // Sep 1 (still using Aug 26 price)

    // Price should be 150 from Sep 2 onwards
    expect(result[8].price).toBe(150); // Sep 2
    expect(result[14].price).toBe(150); // Sep 8 (today)
  });

  it('should backward fill initial null values', () => {
    const inputData = [{ date: '2025-09-05', price: 200 }];

    const result = forwardFillMissingDates(inputData);

    // All dates before Sep 5 should be backward filled with 200
    expect(result[0].price).toBe(200); // Aug 25
    expect(result[10].price).toBe(200); // Sep 4
    expect(result[11].price).toBe(200); // Sep 5
    expect(result[14].price).toBe(200); // Sep 8
  });

  it('should handle empty input data', () => {
    const result = forwardFillMissingDates([]);

    expect(result).toHaveLength(15);
    // All prices should be null when no data is provided
    result.forEach((item) => {
      expect(item.price).toBeNull();
    });
  });

  it('should handle null/undefined input', () => {
    const resultNull = forwardFillMissingDates(null);
    const resultUndefined = forwardFillMissingDates(undefined);

    expect(resultNull).toHaveLength(15);
    expect(resultUndefined).toHaveLength(15);

    resultNull.forEach((item) => {
      expect(item.price).toBeNull();
    });

    resultUndefined.forEach((item) => {
      expect(item.price).toBeNull();
    });
  });

  it('should handle unsorted input data', () => {
    const inputData = [
      { date: '2025-09-05', price: 150 },
      { date: '2025-08-28', price: 100 },
      { date: '2025-09-01', price: 120 },
    ];

    const result = forwardFillMissingDates(inputData);

    // Should handle dates in chronological order regardless of input order
    expect(result[3].price).toBe(100); // Aug 28
    expect(result[7].price).toBe(120); // Sep 1
    expect(result[11].price).toBe(150); // Sep 5
    expect(result[14].price).toBe(150); // Sep 8
  });

  it('should handle data with dates outside the 15-day window', () => {
    const inputData = [
      { date: '2025-08-01', price: 50 }, // Before window
      { date: '2025-08-30', price: 100 },
      { date: '2025-09-15', price: 200 }, // After window
    ];

    const result = forwardFillMissingDates(inputData);

    expect(result).toHaveLength(15);
    // Should only use the price from Aug 30, ignoring dates outside window
    expect(result[5].price).toBe(100); // Aug 30
    expect(result[14].price).toBe(100); // Sep 8 (should not use Sep 15 price)
  });

  it('should handle multiple price changes within the window', () => {
    const inputData = [
      { date: '2025-08-26', price: 100 },
      { date: '2025-08-28', price: 110 },
      { date: '2025-09-01', price: 120 },
      { date: '2025-09-03', price: 130 },
      { date: '2025-09-06', price: 140 },
    ];

    const result = forwardFillMissingDates(inputData);

    expect(result[1].price).toBe(100); // Aug 26
    expect(result[3].price).toBe(110); // Aug 28
    expect(result[7].price).toBe(120); // Sep 1
    expect(result[9].price).toBe(130); // Sep 3
    expect(result[12].price).toBe(140); // Sep 6
    expect(result[14].price).toBe(140); // Sep 8
  });

  it('should handle same date multiple entries (should use latest)', () => {
    const inputData = [
      { date: '2025-09-01', price: 100 },
      { date: '2025-09-01', price: 150 }, // Same date, different price
    ];

    const result = forwardFillMissingDates(inputData);

    // Should use the latest price for the same date
    expect(result[7].price).toBe(150); // Sep 1
  });

  it('should preserve exact date format in output', () => {
    const inputData = [{ date: '2025-09-01', price: 100 }];
    const result = forwardFillMissingDates(inputData);

    result.forEach((item) => {
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof item.date).toBe('string');
    });
  });
});
