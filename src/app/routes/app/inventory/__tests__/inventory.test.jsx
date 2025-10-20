import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import InventoryRoute from '../Inventory';
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
  useAuth: vi.fn(() => ({
    auth: { user: { role: 'ADMIN' } },
  })),
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

const mockInventory = {
  inventory: [
    {
      id: 'i1',
      name: 'Coconut',
      category: 'Product',
      stock_qty: 100,
      amount_per_unit: 1,
      total_available: 100,
      unit: 'pcs',
      stock_price: 10,
      low_stock_alert: 10,
    },
    {
      id: 'i2',
      name: 'Copra',
      category: 'Product',
      stock_qty: 50,
      amount_per_unit: 1,
      total_available: 50,
      unit: 'kg',
      stock_price: 25,
      low_stock_alert: 5,
    },
    {
      id: 'i3',
      name: 'Fertilizer A',
      category: 'Fertilizer',
      stock_qty: 20,
      amount_per_unit: 2,
      total_available: 40,
      unit: 'kg',
      stock_price: 100,
      low_stock_alert: 2,
    },
  ],
};

describe('Inventory Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders inventory list', async () => {
    api.get.mockResolvedValueOnce({ data: mockInventory });

    render(
      <TestWrapper>
        <InventoryRoute />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/coconut/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/copra/i)).toBeInTheDocument();
    expect(screen.getByText(/fertilizer a/i)).toBeInTheDocument();
  });

  it('creates a new inventory item', async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();

    const newItem = {
      id: 'i4',
      name: 'Herbicide X',
      category: 'Herbicide',
      stock_qty: 10,
      amount_per_unit: 5,
      total_available: 50,
      unit: 'L',
      stock_price: 200,
      low_stock_alert: 2,
    };

    api.get.mockResolvedValueOnce({ data: mockInventory });
    api.post.mockResolvedValueOnce({ data: newItem });
    api.get.mockResolvedValueOnce({
      data: { inventory: [...mockInventory.inventory, newItem] },
    });

    render(
      <TestWrapper>
        <InventoryRoute />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/coconut/i)).toBeInTheDocument(),
    );

    await userEvent.click(
      screen.getByRole('button', { name: /create inventory item/i }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: /create inventory item/i,
    });

    await userEvent.clear(within(drawer).getByLabelText(/name \*/i));
    await userEvent.type(
      within(drawer).getByLabelText(/name \*/i),
      'Herbicide X',
    );

    const categoryTrigger = within(drawer).getByRole('combobox', {
      name: /category \*/i,
    });
    await userEvent.click(categoryTrigger);
    const herbicideOption = await screen.findByRole('option', {
      name: /herbicide/i,
    });
    await userEvent.click(herbicideOption);

    await userEvent.clear(within(drawer).getByLabelText(/stock quantity \*/i));
    await userEvent.type(
      within(drawer).getByLabelText(/stock quantity \*/i),
      '10',
    );

    await userEvent.clear(
      within(drawer).getByLabelText(/amount per stock \*/i),
    );
    await userEvent.type(
      within(drawer).getByLabelText(/amount per stock \*/i),
      '5',
    );

    await userEvent.clear(within(drawer).getByLabelText(/unit/i));
    await userEvent.type(within(drawer).getByLabelText(/unit/i), 'L');

    await userEvent.clear(within(drawer).getByLabelText(/price per stock/i));
    await userEvent.type(
      within(drawer).getByLabelText(/price per stock/i),
      '200',
    );

    await userEvent.click(
      within(drawer).getByRole('button', { name: /submit/i }),
    );

    expect(api.post).toHaveBeenCalledWith(
      '/inventory',
      expect.objectContaining({
        name: 'Herbicide X',
        category: 'Herbicide',
        stockQty: 10,
        amountPerUnit: 5,
        unit: 'L',
        stockPrice: 200,
      }),
    );

    await waitFor(() =>
      expect(screen.getByText(/herbicide x/i)).toBeInTheDocument(),
    );
  });

  it('updates an existing inventory item', async () => {
    const updated = {
      ...mockInventory.inventory[2],
      stock_qty: 30,
      amount_per_unit: 3,
      total_available: 90,
      stock_price: 120,
    };

    api.get.mockResolvedValueOnce({ data: mockInventory });
    api.get.mockResolvedValueOnce({ data: mockInventory.inventory[2] });
    api.patch.mockResolvedValueOnce({ data: updated });
    api.get.mockResolvedValueOnce({
      data: {
        inventory: [
          mockInventory.inventory[0],
          mockInventory.inventory[1],
          updated,
        ],
      },
    });

    render(
      <TestWrapper>
        <InventoryRoute />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fertilizer a/i)).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole('button');
    const menuButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );

    await userEvent.click(menuButtons[3]);
    const editItem = await screen.findByRole('menuitem', { name: /edit/i });
    await userEvent.click(editItem);

    const dialog = await screen.findByRole('alertdialog', {
      name: /edit inventory item/i,
    });

    const stockQtyInput = within(dialog).getByLabelText(/stock quantity \*/i);
    const amountPerStockInput =
      within(dialog).getByLabelText(/amount per stock \*/i);
    const priceInput = within(dialog).getByLabelText(/stock price \(₱\)/i);

    await userEvent.clear(stockQtyInput);
    await userEvent.type(stockQtyInput, '30');
    await userEvent.clear(amountPerStockInput);
    await userEvent.type(amountPerStockInput, '3');
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, '120');

    await userEvent.click(
      within(dialog).getByRole('button', { name: /update inventory item/i }),
    );

    expect(api.patch).toHaveBeenCalledWith(
      `/inventory/${mockInventory.inventory[2].id}`,
      expect.objectContaining({
        stockQty: 30,
        amountPerUnit: 3,
        stockPrice: 120,
      }),
    );

    await waitFor(() =>
      expect(api.get).toHaveBeenLastCalledWith('/inventory', { params: {} }),
    );
  });

  it('deletes a inventory item', async () => {
    const remaining = {
      inventory: [mockInventory.inventory[0], mockInventory.inventory[1]],
    };

    api.get.mockResolvedValueOnce({ data: mockInventory });
    api.delete.mockResolvedValueOnce({ data: { success: true } });
    api.get.mockResolvedValueOnce({ data: remaining });

    render(
      <TestWrapper>
        <InventoryRoute />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fertilizer a/i)).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole('button');
    const menuButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );
    await userEvent.click(menuButtons[3]);
    const deleteItem = await screen.findByRole('menuitem', { name: /delete/i });
    await userEvent.click(deleteItem);
    const alert = await screen.findByRole('alertdialog');
    await userEvent.click(
      within(alert).getByRole('button', { name: /delete/i }),
    );

    expect(api.delete).toHaveBeenCalledWith('/inventory/i3');

    await waitFor(() =>
      expect(screen.queryByText(/fertilizer a/i)).not.toBeInTheDocument(),
    );
  });

  it('adjusts stock quantity via Adjust Stock action', async () => {
    const target = mockInventory.inventory[2];
    const adjusted = {
      ...target,
      stock_qty: target.stock_qty + 5,
      total_available: (target.stock_qty + 5) * target.amount_per_unit,
    };

    api.get.mockResolvedValueOnce({ data: mockInventory });
    api.get.mockResolvedValueOnce({ data: target });
    api.patch.mockResolvedValueOnce({ data: adjusted });
    api.get.mockResolvedValueOnce({
      data: {
        inventory: [
          mockInventory.inventory[0],
          mockInventory.inventory[1],
          adjusted,
        ],
      },
    });

    render(
      <TestWrapper>
        <InventoryRoute />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fertilizer a/i)).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole('button');
    const menuButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );
    await userEvent.click(menuButtons[3]);
    const adjustItem = await screen.findByRole('menuitem', {
      name: /adjust stock/i,
    });
    await userEvent.click(adjustItem);

    const dialog = await screen.findByRole('alertdialog', {
      name: /adjust stock quantity/i,
    });
    const quantityInput = within(dialog).getByLabelText(/quantity to adjust/i);
    await userEvent.type(quantityInput, '5');
    await userEvent.click(within(dialog).getByRole('button', { name: /add/i }));

    expect(api.patch).toHaveBeenCalledWith(
      `/inventory/${target.id}`,
      expect.objectContaining({ stockQty: String(target.stock_qty + 5) }),
    );
  });

  it('adjusts amount per unit via Adjust Amount/Unit action', async () => {
    const target = mockInventory.inventory[2];
    const adjusted = {
      ...target,
      amount_per_unit: target.amount_per_unit + 1,
      total_available: target.total_available + 1,
    };

    api.get.mockResolvedValueOnce({ data: mockInventory });
    api.patch.mockResolvedValueOnce({ data: adjusted });
    api.get.mockResolvedValueOnce({
      data: {
        inventory: [
          mockInventory.inventory[0],
          mockInventory.inventory[1],
          adjusted,
        ],
      },
    });

    render(
      <TestWrapper>
        <InventoryRoute />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/fertilizer a/i)).toBeInTheDocument(),
    );
    const buttons = screen.getAllByRole('button');
    const menuButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );
    await userEvent.click(menuButtons[3]);
    const adjustAmountItem = await screen.findByRole('menuitem', {
      name: /adjust amount\/unit/i,
    });
    await userEvent.click(adjustAmountItem);

    const dialog = await screen.findByRole('alertdialog', {
      name: /adjust amount per unit/i,
    });
    const amountInput = within(dialog).getByLabelText(/amount to adjust/i);
    await userEvent.type(amountInput, '1');
    await userEvent.click(
      within(dialog).getByRole('button', { name: /increase/i }),
    );

    expect(api.patch).toHaveBeenCalledWith(
      `/inventory/${target.id}`,
      expect.objectContaining({
        totalAvailable: '51',
      }),
    );
  });

  it('hides action buttons for STAFF role', async () => {
    vi.mocked(useAuth).mockReturnValue({ auth: { user: { role: 'STAFF' } } });
    api.get.mockResolvedValueOnce({ data: mockInventory });

    render(
      <TestWrapper>
        <InventoryRoute />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText(/coconut/i)).toBeInTheDocument(),
    );
    expect(
      screen.queryByRole('button', { name: /open menu/i }),
    ).not.toBeInTheDocument();
  });

  it('handles inventory fetch error (shows skeleton first)', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <InventoryRoute />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(
        screen.queryByText(/coconut/i) || screen.queryByText(/fertilizer a/i),
      ).not.toBeInTheDocument(),
    );
  });
});
