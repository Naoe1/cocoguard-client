import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProductView } from '../components/ProductView';

vi.mock('../../../../lib/apiClient', () => {
  return {
    api: {
      get: vi.fn(),
    },
  };
});

vi.mock('../api/GetProduct', async () => {
  const actual = await vi.importActual('../api/GetProduct');
  return {
    ...actual,
    useProduct: vi.fn(),
  };
});

vi.mock('../context/CartContext', () => {
  return {
    useCart: () => ({ addToCart: vi.fn() }),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const { useProduct } = await import('../api/GetProduct');

describe('ProductView', () => {
  it('shows loading state', () => {
    useProduct.mockReturnValue({ isLoading: true });
    render(<ProductView productId="1" farmId="1" />);
    expect(screen.getByText(/Loading product details/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    useProduct.mockReturnValue({ isLoading: false, isError: true });
    render(<ProductView productId="1" farmId="1" />);
    expect(screen.getByText(/Error loading product/i)).toBeInTheDocument();
  });

  it('disables quantity input when out of stock', () => {
    useProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          id: 7,
          price: 10,
          amount_to_sell: 0,
          inventory: { name: 'Dried Coconut', amount_per_unit: 1, unit: 'kg' },
        },
      },
    });

    render(<ProductView productId="7" farmId="2" />);

    const qty = screen.getByLabelText(/Quantity/i);
    expect(qty).toBeDisabled();

    const addBtn = screen.getByRole('button', { name: /Add to Cart/i });
    expect(addBtn).toBeDisabled();
  });

  it('clamps quantity to available stock (max)', () => {
    useProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          id: 12,
          price: 25,
          amount_to_sell: 4,
          inventory: { name: 'Coconut Cream', amount_per_unit: 1, unit: 'L' },
        },
      },
    });

    render(<ProductView productId="12" farmId="4" />);

    const qty = screen.getByLabelText(/Quantity/i);
    expect(qty).toBeEnabled();

    fireEvent.change(qty, { target: { value: '10' } });
    expect(qty).toHaveValue(4);
  });

  it('clamps quantity to minimum of 1', () => {
    useProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          id: 11,
          price: 15,
          amount_to_sell: 10,
          inventory: { name: 'Coconut Milk', amount_per_unit: 1, unit: 'L' },
        },
      },
    });

    render(<ProductView productId="11" farmId="3" />);

    const qty = screen.getByLabelText(/Quantity/i);
    expect(qty).toBeEnabled();

    fireEvent.change(qty, { target: { value: '0' } });
    expect(qty).toHaveValue(1);

    fireEvent.change(qty, { target: { value: '-5' } });
    expect(qty).toHaveValue(1);
  });

  it('renders product and allows add to cart', () => {
    useProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          id: 3,
          price: 99,
          amount_to_sell: 5,
          inventory: { name: 'Coconut Sugar', amount_per_unit: 1, unit: 'kg' },
        },
      },
    });

    render(<ProductView productId="3" farmId="9" />);

    expect(screen.getByText(/Coconut Sugar/)).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: /Add to Cart/i });
    expect(addBtn).toBeEnabled();

    const qty = screen.getByLabelText(/Quantity/i);
    fireEvent.change(qty, { target: { value: '2' } });
    expect(qty).toHaveValue(2);
  });

  it('resets non-numeric or empty quantity to 1', () => {
    useProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          id: 13,
          price: 20,
          amount_to_sell: 10,
          inventory: { name: 'Coconut Water', amount_per_unit: 1, unit: 'L' },
        },
      },
    });

    render(<ProductView productId="13" farmId="3" />);

    const qty = screen.getByLabelText(/Quantity/i);
    expect(qty).toBeEnabled();

    fireEvent.change(qty, { target: { value: '' } });
    expect(qty).toHaveValue(1);

    fireEvent.change(qty, { target: { value: 'abc' } });
    expect(qty).toHaveValue(1);
  });
});
