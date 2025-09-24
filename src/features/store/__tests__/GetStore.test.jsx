import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StoreView } from '../components/StoreView';

vi.mock('../../../../lib/apiClient', () => {
  return {
    api: {
      get: vi.fn(),
    },
  };
});

vi.mock('../api/GetStore', async () => {
  const actual = await vi.importActual('../api/GetStore');
  return {
    ...actual,
    useStore: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const { useStore } = await import('../api/GetStore');

describe('StoreView', () => {
  it('renders error state when error', () => {
    useStore.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('boom'),
    });
    render(<StoreView farmId="123" />);
    expect(screen.getByText(/Error Loading Store/i)).toBeInTheDocument();
  });

  it('renders products when loaded', () => {
    useStore.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          products: [
            {
              id: 1,
              price: 10,
              amount_to_sell: 2,
              image: '',
              inventory: {
                name: 'Coconut Water',
                amount_per_unit: 1,
                unit: 'L',
              },
            },
            {
              id: 2,
              price: 5,
              amount_to_sell: 0,
              image: '',
              inventory: {
                name: 'Coconut Oil',
                amount_per_unit: 500,
                unit: 'ml',
              },
            },
          ],
        },
      },
    });

    render(<StoreView farmId="321" />);

    expect(screen.getByText(/Our Products/)).toBeInTheDocument();
    expect(screen.getByText(/Coconut Water/)).toBeInTheDocument();
    expect(screen.getByText(/Coconut Oil/)).toBeInTheDocument();
  });
});
