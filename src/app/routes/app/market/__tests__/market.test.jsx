import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { ProductsRouteAdmin } from '../Products';
import { SaleHistoryRoute } from '../SaleHistory';
import { MarketRouteAdmin } from '../Market';
import { api } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth';

vi.mock('@/lib/apiClient', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  useAuth: vi.fn(() => ({ auth: { user: { role: 'ADMIN' } } })),
}));

const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const mockProducts = {
  products: [
    {
      id: 'p1',
      inventory: {
        id: 'i10',
        name: 'Coconut',
        unit: 'kg',
        amount_per_unit: 1,
        stock_qty: 500,
      },
      description: 'Fresh coconut product',
      price: 50,
      amount_to_sell: 100,
      image: 'https://example.com/product.jpg',
    },
    {
      id: 'p2',
      inventory: {
        id: 'i11',
        name: 'Copra Pack',
        unit: 'kg',
        amount_per_unit: 5,
        stock_qty: 200,
      },
      description: '',
      price: 120,
      amount_to_sell: 50,
      image: 'https://example.com/img.jpg',
    },
  ],
};

const mockInventoryProducts = {
  inventory: [
    { id: 10, name: 'Coconut', amount_per_unit: 1, unit: 'kg', stock_qty: 500 },
    {
      id: 11,
      name: 'Copra Pack',
      amount_per_unit: 5,
      unit: 'kg',
      stock_qty: 200,
    },
    {
      id: 12,
      name: 'Oil Bottle',
      amount_per_unit: 1,
      unit: 'L',
      stock_qty: 90,
    },
  ],
};

const mockSalesHistory = {
  sales: [
    {
      order_id: 101,
      amount: 500,
      net_amount: 480,
      paypal_fee: 20,
      sale_items: [
        {
          id: 'si1',
          name: 'Coconut',
          unit_price: 50,
          quantity: 5,
          subtotal: 250,
        },
        {
          id: 'si2',
          name: 'Copra Pack',
          unit_price: 125,
          quantity: 2,
          subtotal: 250,
        },
      ],
    },
    {
      order_id: 102,
      amount: 120,
      net_amount: 115,
      paypal_fee: 5,
      sale_items: [
        {
          id: 'si3',
          name: 'Oil Bottle',
          unit_price: 60,
          quantity: 2,
          subtotal: 120,
        },
      ],
    },
  ],
};

const mockStats = {
  sales: {
    totalSales: 20000,
    totalOrders: 300,
    totalCustomers: 150,
    ordersLast7Days: 12,
    recentSales: [
      { date: '2025-09-20', sales: 1000 },
      { date: '2025-09-21', sales: 1200 },
    ],
  },
};

const mockCopraHistory = {
  copraPriceHistory: [
    { date: '2025-09-10', price: 40 },
    { date: '2025-09-11', price: 42 },
    { date: '2025-09-12', price: 41 },
  ],
  copraPricePrediction: [
    { date: '2025-09-27', price: 45 },
    { date: '2025-09-28', price: 46 },
  ],
  peakPrediction: { peak_price: 50, peak_date: '2025-11-05' },
  latestPriceData: { latest_price: 43 },
  region: 'Region X',
};

describe('Market Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({ auth: { user: { role: 'ADMIN' } } });
  });

  it('renders products list', async () => {
    api.get.mockResolvedValueOnce({ data: mockProducts });

    render(
      <TestWrapper>
        <ProductsRouteAdmin />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fresh coconut product/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/copra pack/i)).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/products');
  });

  it('creates a product', async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();

    api.get.mockResolvedValueOnce({ data: mockProducts });
    api.get.mockResolvedValueOnce({ data: mockInventoryProducts });

    const newProduct = {
      id: 'p3',
      inventory: {
        id: 12,
        name: 'Oil Bottle',
        amount_per_unit: 1,
        unit: 'L',
        stock_qty: 90,
      },
      description: 'Refined oil',
      price: 60,
      amount_to_sell: 40,
      image: 'https://example.com/product.jpg',
    };

    api.post.mockResolvedValueOnce({ data: newProduct });
    api.get.mockResolvedValueOnce({
      data: { products: [...mockProducts.products, newProduct] },
    });

    render(
      <TestWrapper>
        <ProductsRouteAdmin />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fresh coconut product/i)).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole('button', { name: /add product/i }));
    const drawer = await screen.findByRole('dialog', {
      name: /create product from inventory/i,
    });

    const invTrigger = within(drawer).getByRole('combobox', {
      name: /inventory product \*/i,
    });
    await userEvent.click(invTrigger);
    const oilOption = await screen.findByRole('option', {
      name: /oil bottle 1 l \(90 available\)/i,
    });
    await userEvent.click(oilOption);

    await userEvent.type(
      within(drawer).getByLabelText(/market description/i),
      'Refined oil',
    );
    await userEvent.type(
      within(drawer).getByLabelText(/market price \*/i),
      '60',
    );
    await userEvent.type(
      within(drawer).getByLabelText(/amount to sell \*/i),
      '40',
    );

    await userEvent.type(
      within(drawer).getByLabelText(/market image url/i),
      'https://example.com/product.jpg',
    );

    await userEvent.click(
      within(drawer).getByRole('button', { name: /submit/i }),
    );

    expect(api.post).toHaveBeenCalledWith(
      '/products',
      expect.objectContaining({
        inventoryItemId: String(12),
        description: 'Refined oil',
        price: 60,
        amountToSell: 40,
        image: 'https://example.com/product.jpg',
      }),
    );

    await waitFor(() =>
      expect(screen.getByText(/refined oil/i)).toBeInTheDocument(),
    );
  });

  it('updates a product', async () => {
    const target = mockProducts.products[0];
    const getProductResponse = {
      ...target,
      amount_to_sell: target.amount_to_sell,
      price: target.price,
    };
    const updated = { ...target, price: 55, amount_to_sell: 120 };

    api.get.mockResolvedValueOnce({ data: mockProducts });
    api.get.mockResolvedValueOnce({ data: getProductResponse });
    api.patch.mockResolvedValueOnce({ data: updated });
    api.get.mockResolvedValueOnce({
      data: { products: [updated, mockProducts.products[1]] },
    });
    api.get.mockResolvedValueOnce({ data: updated });

    render(
      <TestWrapper>
        <ProductsRouteAdmin />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fresh coconut product/i)).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole('button');
    const menuButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );
    await userEvent.click(menuButtons[0]);
    const editItem = await screen.findByRole('menuitem', { name: /edit/i });
    await userEvent.click(editItem);

    const dialog = await screen.findByRole('alertdialog', {
      name: /edit product/i,
    });
    const priceInput = within(dialog).getByLabelText(/price \*/i);
    const amountInput = within(dialog).getByLabelText(/amount to sell \*/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, '55');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '120');
    await userEvent.type(
      within(dialog).getByLabelText(/image url/i),
      'https://example.com/product.jpg',
    );

    await userEvent.click(
      within(dialog).getByRole('button', { name: /update product/i }),
    );

    expect(api.patch).toHaveBeenCalledWith(
      `/products/${target.id}`,
      expect.objectContaining({ price: 55, amountToSell: 120 }),
    );
  });

  it('deletes a product', async () => {
    api.get.mockResolvedValueOnce({ data: mockProducts });
    api.delete.mockResolvedValueOnce({ data: { success: true } });
    api.get.mockResolvedValueOnce({
      data: { products: [mockProducts.products[1]] },
    });

    render(
      <TestWrapper>
        <ProductsRouteAdmin />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fresh coconut product/i)).toBeInTheDocument(),
    );
    const buttons = screen.getAllByRole('button');
    const menuButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );
    await userEvent.click(menuButtons[0]);
    const deleteItem = await screen.findByRole('menuitem', { name: /delete/i });
    await userEvent.click(deleteItem);
    const alert = await screen.findByRole('alertdialog');
    await userEvent.click(
      within(alert).getByRole('button', { name: /delete/i }),
    );

    expect(api.delete).toHaveBeenCalledWith(
      `/products/${mockProducts.products[0].id}`,
    );
    await waitFor(() =>
      expect(
        screen.queryByText(/fresh coconut product/i),
      ).not.toBeInTheDocument(),
    );
  });

  it('hides action buttons for STAFF role', async () => {
    vi.mocked(useAuth).mockReturnValue({ auth: { user: { role: 'STAFF' } } });
    api.get.mockResolvedValueOnce({ data: mockProducts });

    render(
      <TestWrapper>
        <ProductsRouteAdmin />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fresh coconut product/i)).toBeInTheDocument(),
    );
    const buttons = screen.getAllByRole('button');
    const menuButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );
    expect(menuButtons.length).toBe(0);
  });

  it('renders error state on products fetch failure', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <ProductsRouteAdmin />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument(),
    );
  });

  it('renders sales history and expands row', async () => {
    api.get.mockResolvedValueOnce({ data: mockSalesHistory });

    render(
      <TestWrapper>
        <SaleHistoryRoute />
      </TestWrapper>,
    );

    await waitFor(() => expect(screen.getByText(/#101/)).toBeInTheDocument());
    const rows = screen.getAllByRole('row');
    const targetRow = rows.length > 1 ? rows[1] : rows[0];
    await userEvent.click(targetRow);

    await waitFor(() =>
      expect(screen.getByText(/order items:/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/coconut/i)).toBeInTheDocument();
  });

  it('renders market dashboard stats & charts', async () => {
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    api.get.mockResolvedValueOnce({ data: mockStats });
    api.get.mockResolvedValueOnce({ data: mockCopraHistory });

    render(
      <TestWrapper>
        <MarketRouteAdmin />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/total sales/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/current copra price/i)).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/products/stats');
    expect(api.get).toHaveBeenCalledWith('/products/copra/history');
  });
});
