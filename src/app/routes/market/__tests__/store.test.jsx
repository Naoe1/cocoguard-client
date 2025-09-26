import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { StoreView } from '@/features/store/components/StoreView';
import { ProductView } from '@/features/store/components/ProductView';
import { CartView } from '@/features/store/components/CartView';
import { CartProvider } from '@/features/store/context/CartContext';
import { api } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  api: {
    get: vi.fn(),
  },
}));

// Mock toast to silence output
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

// Mock PaypalPayment to avoid needing PayPalScriptProvider context
vi.mock('@/lib/PaypalPayment.jsx', () => ({
  PaypalPayment: ({ cartItems }) => (
    <div data-testid="paypal-mock">PayPal Mock ({cartItems.length} items)</div>
  ),
}));

const TestWrapper = ({ initialEntries = ['/market/1'], children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <CartProvider>
          <Routes>{children}</Routes>
        </CartProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const mockStoreData = {
  products: [
    {
      id: 'p1',
      inventory: {
        id: 'i1',
        name: 'Coconut Butter',
        unit: 'kg',
        amount_per_unit: 1,
      },
      price: 50,
      amount_to_sell: 10,
      description: 'Rich coconut butter',
      image: '',
    },
    {
      id: 'p2',
      inventory: {
        id: 'i2',
        name: 'Copra Pack',
        unit: 'kg',
        amount_per_unit: 5,
      },
      price: 120,
      amount_to_sell: 0,
      description: '',
      image: 'https://example.com/copra.jpg',
    },
  ],
};

const mockProductDetail = {
  id: 'p1',
  inventory: {
    id: 'i1',
    name: 'Coconut Butter',
    unit: 'kg',
    amount_per_unit: 1,
  },
  price: 50,
  amount_to_sell: 10,
  description: 'Fresh coconut butter description',
  image: '',
};

describe('Store Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const store = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    });
  });

  it('renders store product listing', async () => {
    api.get.mockResolvedValueOnce({ data: mockStoreData });

    render(
      <TestWrapper>
        <Route path="/market/:marketId" element={<StoreView farmId={1} />} />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/welcome to/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/coconut butter/i)).toBeInTheDocument();
    expect(screen.getByText(/copra pack/i)).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/market/1');
  });

  it('navigates to product detail and displays info', async () => {
    api.get.mockResolvedValueOnce({ data: mockStoreData });
    api.get.mockResolvedValueOnce({ data: mockProductDetail });

    render(
      <TestWrapper>
        <Route path="/market/:marketId" element={<StoreView farmId={1} />} />
        <Route
          path="/market/:marketId/:productId"
          element={<ProductView productId="p1" farmId={1} />}
        />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/coconut butter/i)).toBeInTheDocument(),
    );
    const productCard = screen.getAllByText(/coconut butter/i)[0];
    await userEvent.click(
      productCard.closest('div[class*="Card"]') || productCard,
    );

    await waitFor(() =>
      expect(
        screen.getByText(/fresh coconut butter description/i),
      ).toBeInTheDocument(),
    );
    expect(api.get).toHaveBeenCalledWith('/market/1');
    expect(api.get).toHaveBeenCalledWith('/market/1/p1');
  });

  it('adds product to cart from product detail and updates cart totals', async () => {
    api.get.mockResolvedValueOnce({ data: mockStoreData });
    api.get.mockResolvedValueOnce({ data: mockProductDetail });

    render(
      <TestWrapper>
        <Route path="/market/:marketId" element={<StoreView farmId={1} />} />
        <Route
          path="/market/:marketId/:productId"
          element={<ProductView productId="p1" farmId={1} />}
        />
        <Route path="/market/:marketId/cart" element={<CartView />} />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/coconut butter/i)).toBeInTheDocument(),
    );
    const productCard = screen.getAllByText(/coconut butter/i)[0];
    await userEvent.click(
      productCard.closest('div[class*="Card"]') || productCard,
    );

    await waitFor(() =>
      expect(
        screen.getByText(/fresh coconut butter description/i),
      ).toBeInTheDocument(),
    );
    const addBtn = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(addBtn);

    const buyNowBtn = screen.getByRole('button', { name: /buy it now/i });
    await userEvent.click(buyNowBtn);

    await waitFor(() =>
      expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/coconut butter/i)).toBeInTheDocument();
    const qtyInput = screen.getByDisplayValue('2');
    expect(qtyInput).toBeInTheDocument();
    expect(screen.getAllByText(/₱50\.00/).length).toBeGreaterThan(0);
  });

  it('updates quantity, removes item, and clears cart', async () => {
    api.get.mockResolvedValueOnce({ data: mockStoreData });
    api.get.mockResolvedValueOnce({ data: mockProductDetail });

    render(
      <TestWrapper>
        <Route path="/market/:marketId" element={<StoreView farmId={1} />} />
        <Route
          path="/market/:marketId/:productId"
          element={<ProductView productId="p1" farmId={1} />}
        />
        <Route path="/market/:marketId/cart" element={<CartView />} />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/coconut butter/i)).toBeInTheDocument(),
    );
    const productCard = screen.getAllByText(/coconut butter/i)[0];
    await userEvent.click(
      productCard.closest('div[class*="Card"]') || productCard,
    );
    await waitFor(() =>
      expect(
        screen.getByText(/fresh coconut butter description/i),
      ).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    await userEvent.click(screen.getByRole('button', { name: /buy it now/i }));
    await waitFor(() =>
      expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument(),
    );

    const qtyInput = screen.getByDisplayValue('2');
    await userEvent.clear(qtyInput);
    await userEvent.type(qtyInput, '10');
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', { name: /remove item/i });
    await userEvent.click(removeBtn);
    await waitFor(() =>
      expect(screen.queryByText(/coconut butter/i)).not.toBeInTheDocument(),
    );
  });

  it('shows 404 style error for store not found', async () => {
    const error = new Error('Not found');
    error.response = { status: 404 };
    api.get.mockRejectedValueOnce(error);

    render(
      <TestWrapper>
        <Route path="/market/:marketId" element={<StoreView farmId={1} />} />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/store not found/i)).toBeInTheDocument(),
    );
  });

  it('shows generic error state for non-404 errors', async () => {
    const error = new Error('Internal server error');
    error.response = { status: 500 };
    api.get.mockRejectedValueOnce(error);

    render(
      <TestWrapper>
        <Route path="/market/:marketId" element={<StoreView farmId={1} />} />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/error loading store/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
  });

  it('shows empty state when no products returned', async () => {
    api.get.mockResolvedValueOnce({ data: { products: [] } });

    render(
      <TestWrapper>
        <Route path="/market/:marketId" element={<StoreView farmId={1} />} />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(
        screen.getByText(/no products available yet/i),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/check back later for new products/i),
    ).toBeInTheDocument();
  });
});
