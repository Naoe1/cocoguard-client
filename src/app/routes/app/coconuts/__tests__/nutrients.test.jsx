import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import NutrientsRoutes from '../nutrient/Nutrient';
import { api } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth';

vi.mock('@/lib/apiClient', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  useAuth: vi.fn(() => ({
    auth: {
      user: { role: 'ADMIN' },
    },
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

const mockNutrientsData = {
  nutrients: [
    {
      id: 'n1',
      date_applied: '2024-04-01',
      tree: { id: 1, tree_code: 'COC-001' },
      product: 'Urea',
      amount: 5,
      unit: 'kg',
      application_method: 'Soil drench',
    },
    {
      id: 'n2',
      date_applied: '2024-04-05',
      tree: { id: 2, tree_code: 'COC-002' },
      product: 'NPK 16-16-16',
      amount: 2.5,
      unit: 'kg',
      application_method: 'Foliar spray',
    },
  ],
};

describe('Nutrients Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nutrient records', async () => {
    api.get.mockResolvedValueOnce({ data: mockNutrientsData });

    render(
      <TestWrapper>
        <NutrientsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Urea')).toBeInTheDocument();
    });

    expect(screen.getByText('NPK 16-16-16')).toBeInTheDocument();
    expect(screen.getByText('COC-001')).toBeInTheDocument();
    expect(screen.getByText('COC-002')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/nutrients', { params: {} });
  });

  it('should create a nutrient record', async () => {
    const newRecord = {
      id: 'n3',
      date_applied: '2024-04-10',
      tree: { id: 3, tree_code: 'COC-003' },
      product: 'Compost',
      amount: 3,
      unit: 'kg',
      application_method: 'Soil drench',
    };

    api.get.mockResolvedValueOnce({ data: mockNutrientsData });
    api.get.mockResolvedValueOnce({ data: { inventory: [] } });
    api.post.mockResolvedValueOnce({ data: newRecord });
    api.get.mockResolvedValueOnce({
      data: { nutrients: [...mockNutrientsData.nutrients, newRecord] },
    });

    render(
      <TestWrapper>
        <NutrientsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => expect(screen.getByText('Urea')).toBeInTheDocument());

    await userEvent.click(
      screen.getByRole('button', { name: /create nutrient record/i }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: /create nutrient record/i,
    });

    await userEvent.clear(within(drawer).getByLabelText(/tree code/i));
    await userEvent.type(
      within(drawer).getByLabelText(/tree code/i),
      'COC-003',
    );
    await userEvent.clear(within(drawer).getByLabelText(/product/i));
    await userEvent.type(within(drawer).getByLabelText(/product/i), 'Compost');
    await userEvent.clear(within(drawer).getByLabelText(/amount/i));
    await userEvent.type(within(drawer).getByLabelText(/amount/i), '3');
    await userEvent.clear(within(drawer).getByLabelText(/unit/i));
    await userEvent.type(within(drawer).getByLabelText(/unit/i), 'kg');
    await userEvent.clear(within(drawer).getByLabelText(/application method/i));
    await userEvent.type(
      within(drawer).getByLabelText(/application method/i),
      'Soil drench',
    );

    await userEvent.click(
      within(drawer).getByRole('button', { name: /submit/i }),
    );

    expect(api.post).toHaveBeenCalledWith('/nutrients', {
      treeCode: 'COC-003',
      dateApplied: expect.any(Date),
      product: 'Compost',
      amount: 3,
      unit: 'kg',
      applicationMethod: 'Soil drench',
      inventoryItemId: null,
    });

    await waitFor(() => {
      expect(screen.getByText('Compost')).toBeInTheDocument();
    });
  });

  it('should update a nutrient record', async () => {
    const updated = {
      ...mockNutrientsData.nutrients[0],
      amount: 10,
      product: 'Urea-Plus',
    };

    api.get.mockResolvedValueOnce({ data: mockNutrientsData });
    api.get.mockResolvedValueOnce({ data: { inventory: [] } });

    api.get.mockResolvedValueOnce({ data: mockNutrientsData.nutrients[0] });
    api.patch.mockResolvedValueOnce({ data: updated });
    api.get.mockResolvedValueOnce({
      data: { nutrients: [updated, mockNutrientsData.nutrients[1]] },
    });

    render(
      <TestWrapper>
        <NutrientsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => expect(screen.getByText('Urea')).toBeInTheDocument());

    const buttons = screen.getAllByRole('button');
    const dropdownButton = buttons.find(
      (btn) =>
        btn.getAttribute('aria-haspopup') === 'menu' &&
        btn.querySelector('svg.lucide-ellipsis'),
    );
    await userEvent.click(dropdownButton);

    const editItem = await screen.findByRole('menuitem', { name: /edit/i });
    await userEvent.click(editItem);

    const dialog = await screen.findByRole('alertdialog', {
      name: /edit nutrient record/i,
    });

    const amountInput = within(dialog).getByLabelText(/amount \*/i);
    const productInput = within(dialog).getByLabelText(/product \*/i);

    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '10');
    await userEvent.clear(productInput);
    await userEvent.type(productInput, 'Urea-Plus');

    await userEvent.click(
      within(dialog).getByRole('button', { name: /update nutrient record/i }),
    );

    expect(api.patch).toHaveBeenCalledWith('/nutrients/n1', {
      treeCode: 'COC-001',
      dateApplied: expect.any(Date),
      product: 'Urea-Plus',
      applicationMethod: 'Soil drench',
      amount: 10,
      unit: 'kg',
    });

    await waitFor(() => {
      expect(screen.getByText('Urea-Plus')).toBeInTheDocument();
    });
  });

  it('should delete a nutrient record', async () => {
    api.get.mockResolvedValueOnce({ data: mockNutrientsData });
    api.get.mockResolvedValueOnce({ data: { inventory: [] } });

    api.delete.mockResolvedValueOnce({ data: { success: true } });
    api.get.mockResolvedValueOnce({
      data: { nutrients: [mockNutrientsData.nutrients[1]] },
    });

    render(
      <TestWrapper>
        <NutrientsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => expect(screen.getByText('Urea')).toBeInTheDocument());

    const buttons = screen.getAllByRole('button');
    const dropdownButton = buttons.find(
      (btn) =>
        btn.getAttribute('aria-haspopup') === 'menu' &&
        btn.querySelector('svg.lucide-ellipsis'),
    );
    await userEvent.click(dropdownButton);

    const deleteItem = await screen.findByRole('menuitem', { name: /delete/i });
    await userEvent.click(deleteItem);

    const alert = await screen.findByRole('alertdialog');
    expect(within(alert).getByText(/are you sure/i)).toBeInTheDocument();

    await userEvent.click(
      within(alert).getByRole('button', { name: /delete/i }),
    );

    expect(api.delete).toHaveBeenCalledWith('/nutrients/n1');

    await waitFor(() => {
      expect(screen.queryByText('Urea')).not.toBeInTheDocument();
    });
  });

  it('should hide action buttons for STAFF role', async () => {
    vi.mocked(useAuth).mockReturnValue({
      auth: { user: { role: 'STAFF' } },
    });

    api.get.mockResolvedValueOnce({ data: mockNutrientsData });

    render(
      <TestWrapper>
        <NutrientsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => expect(screen.getByText('Urea')).toBeInTheDocument());

    const buttons = screen.queryAllByRole('button');
    const dropdownButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );
    expect(dropdownButtons).toHaveLength(0);
  });

  it('should create nutrient record using an inventory item (deduct flow)', async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    const inventoryItems = [
      { id: 11, name: 'FertiMix', total_available: 50, unit: 'kg' },
      { id: 12, name: 'GrowthBooster', total_available: 10, unit: 'L' },
    ];

    const newRecord = {
      id: 'n3',
      date_applied: '2024-04-12',
      tree: { id: 1, tree_code: 'COC-001' },
      product: 'FertiMix',
      amount: 5,
      unit: 'kg',
      application_method: 'Soil drench',
    };

    // 1 initial nutrients
    api.get.mockResolvedValueOnce({ data: mockNutrientsData });
    // 2 inventory fetch for fertilizer category
    api.get.mockResolvedValueOnce({ data: { inventory: inventoryItems } });
    // post create
    api.post.mockResolvedValueOnce({ data: newRecord });
    // refetch nutrients after mutation
    api.get.mockResolvedValueOnce({
      data: { nutrients: [...mockNutrientsData.nutrients, newRecord] },
    });
    // refetch inventory after mutation invalidation (simulate deducted quantity)
    api.get.mockResolvedValueOnce({
      data: {
        inventory: [
          { ...inventoryItems[0], total_available: 45 },
          inventoryItems[1],
        ],
      },
    });

    render(
      <TestWrapper>
        <NutrientsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => expect(screen.getByText('Urea')).toBeInTheDocument());

    await userEvent.click(
      screen.getByRole('button', { name: /create nutrient record/i }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: /create nutrient record/i,
    });

    const inventoryTrigger = within(drawer).getByRole('combobox', {
      name: /Subtract from Inventory/i,
    });

    await userEvent.click(inventoryTrigger);

    const fertiOption = await screen.findByRole('option', {
      name: /FertiMix/i,
    });
    await userEvent.click(fertiOption);

    const treeCodeInput = within(drawer).getByLabelText(/tree code/i);
    await userEvent.clear(treeCodeInput);
    await userEvent.type(treeCodeInput, 'COC-001');

    const amountInput = within(drawer).getByLabelText(/amount/i);
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '5');

    // Product + Unit should be auto-filled & disabled after inventory selection.
    // We assert they contain expected values. (Disabled inputs still visible)
    expect(within(drawer).getByLabelText(/product/i)).toHaveValue('FertiMix');
    expect(within(drawer).getByLabelText(/unit/i)).toHaveValue('kg');

    const methodInput = within(drawer).getByLabelText(/application method/i);
    await userEvent.clear(methodInput);
    await userEvent.type(methodInput, 'Soil drench');

    await userEvent.click(
      within(drawer).getByRole('button', { name: /submit/i }),
    );

    expect(api.post).toHaveBeenCalledWith(
      '/nutrients',
      expect.objectContaining({
        treeCode: 'COC-001',
        inventoryItemId: String(inventoryItems[0].id),
        product: 'FertiMix',
        amount: 5,
        unit: 'kg',
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('FertiMix')).toBeInTheDocument();
    });
  });
});
