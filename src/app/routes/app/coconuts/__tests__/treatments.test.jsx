import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import TreatmentRoutes from '../treatment/Treatment';
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

const mockTreatmentsData = {
  treatments: [
    {
      id: 't1',
      date_applied: '2024-05-01',
      end_date: '2024-05-10',
      tree: { id: 1, tree_code: 'COC-001' },
      type: 'Pesticide',
      product: 'Neem Oil',
      amount: 2,
      unit: 'L',
    },
    {
      id: 't2',
      date_applied: '2024-05-03',
      end_date: '',
      tree: { id: 2, tree_code: 'COC-002' },
      type: 'Fungicide',
      product: 'Copper Sulfate',
      amount: 1,
      unit: 'kg',
    },
  ],
};

describe('Treatments Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render treatment records', async () => {
    api.get.mockResolvedValueOnce({ data: mockTreatmentsData });

    render(
      <TestWrapper>
        <TreatmentRoutes />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText('Neem Oil')).toBeInTheDocument(),
    );

    expect(screen.getByText('Copper Sulfate')).toBeInTheDocument();
    expect(screen.getByText('COC-001')).toBeInTheDocument();
    expect(screen.getByText('COC-002')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/treatments', { params: {} });
  });

  it('should create a treatment', async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    const newRecord = {
      id: 't3',
      date_applied: '2024-05-08',
      end_date: '2024-05-12',
      tree: { id: 3, tree_code: 'COC-003' },
      type: 'Others',
      product: 'Glyphosate',
      amount: 3,
      unit: 'L',
    };

    api.get.mockResolvedValueOnce({ data: mockTreatmentsData });
    api.get.mockResolvedValueOnce({
      data: {
        inventory: [],
      },
    });
    api.post.mockResolvedValueOnce({ data: newRecord });
    api.get.mockResolvedValueOnce({
      data: { treatments: [...mockTreatmentsData.treatments, newRecord] },
    });

    render(
      <TestWrapper>
        <TreatmentRoutes />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText('Neem Oil')).toBeInTheDocument(),
    );

    await userEvent.click(
      screen.getByRole('button', { name: /create treatment/i }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: /create treatment/i,
    });

    await userEvent.clear(within(drawer).getByLabelText(/tree code/i));
    await userEvent.type(
      within(drawer).getByLabelText(/tree code/i),
      'COC-003',
    );

    await userEvent.clear(within(drawer).getByLabelText(/end date/i));
    await userEvent.type(
      within(drawer).getByLabelText(/end date/i),
      '2027-05-12',
    );

    await userEvent.clear(within(drawer).getByLabelText(/product/i));
    await userEvent.type(
      within(drawer).getByLabelText(/product/i),
      'Glyphosate',
    );

    await userEvent.clear(within(drawer).getByLabelText(/amount used/i));
    await userEvent.type(within(drawer).getByLabelText(/amount used/i), '3');

    await userEvent.clear(within(drawer).getByLabelText(/unit/i));
    await userEvent.type(within(drawer).getByLabelText(/unit/i), 'L');

    await userEvent.click(
      within(drawer).getByRole('button', { name: /submit/i }),
    );

    expect(api.post).toHaveBeenCalledWith(
      '/treatments',
      expect.objectContaining({
        treeCode: 'COC-003',
        type: 'Others',
        product: 'Glyphosate',
        amount: 3,
        unit: 'L',
        endDate: expect.any(Date),
        dateApplied: expect.any(Date),
        inventoryItemId: null,
      }),
    );

    await waitFor(() =>
      expect(screen.getByText('Glyphosate')).toBeInTheDocument(),
    );
  });

  it('should update a treatment', async () => {
    const updated = {
      ...mockTreatmentsData.treatments[0],
      amount: 5,
      product: 'Neem Oil X',
    };

    api.get.mockResolvedValueOnce({ data: mockTreatmentsData });
    api.get.mockResolvedValueOnce({ data: { inventory: [] } });
    api.get.mockResolvedValueOnce({ data: mockTreatmentsData.treatments[0] });
    api.patch.mockResolvedValueOnce({ data: updated });
    api.get.mockResolvedValueOnce({
      data: { treatments: [updated, mockTreatmentsData.treatments[1]] },
    });

    render(
      <TestWrapper>
        <TreatmentRoutes />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText('Neem Oil')).toBeInTheDocument(),
    );

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
      name: /edit treatment/i,
    });

    const amountInput = within(dialog).getByLabelText(/amount used/i);
    const productInput = within(dialog).getByLabelText(/product \*/i);

    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '5');
    await userEvent.clear(productInput);
    await userEvent.type(productInput, 'Neem Oil X');

    await userEvent.click(
      within(dialog).getByRole('button', { name: /update treatment/i }),
    );

    expect(api.patch).toHaveBeenCalledWith(
      '/treatments/t1',
      expect.objectContaining({
        treeCode: 'COC-001',
        product: 'Neem Oil X',
        amount: 5,
      }),
    );

    await waitFor(() =>
      expect(screen.getByText('Neem Oil X')).toBeInTheDocument(),
    );
  });

  it('should delete a treatment', async () => {
    api.get.mockResolvedValueOnce({ data: mockTreatmentsData });
    api.get.mockResolvedValueOnce({ data: { inventory: [] } });
    api.delete.mockResolvedValueOnce({ data: { success: true } });
    api.get.mockResolvedValueOnce({
      data: { treatments: [mockTreatmentsData.treatments[1]] },
    });

    render(
      <TestWrapper>
        <TreatmentRoutes />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText('Neem Oil')).toBeInTheDocument(),
    );

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

    expect(api.delete).toHaveBeenCalledWith('/treatments/t1');
    await waitFor(() =>
      expect(screen.queryByText('Neem Oil')).not.toBeInTheDocument(),
    );
  });

  it('should hide action buttons for STAFF role', async () => {
    vi.mocked(useAuth).mockReturnValue({ auth: { user: { role: 'STAFF' } } });

    api.get.mockResolvedValueOnce({ data: mockTreatmentsData });

    render(
      <TestWrapper>
        <TreatmentRoutes />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText('Neem Oil')).toBeInTheDocument(),
    );

    expect(
      screen.queryByRole('button', { name: /open menu/i }),
    ).not.toBeInTheDocument();
  });

  it('should create a treatment using inventory item (deduct flow)', async () => {
    const inventoryItems = [
      { id: 21, name: 'BugAway', total_available: 20, unit: 'L' },
      { id: 22, name: 'Fungikill', total_available: 8, unit: 'kg' },
    ];

    const newRecord = {
      id: 't3',
      date_applied: '2024-05-15',
      end_date: '',
      tree: { id: 1, tree_code: 'COC-001' },
      type: 'Pesticide',
      product: 'BugAway',
      amount: 4,
      unit: 'L',
    };

    api.get.mockResolvedValueOnce({ data: mockTreatmentsData });
    api.get.mockResolvedValueOnce({ data: { inventory: [] } });
    api.get.mockResolvedValueOnce({ data: { inventory: inventoryItems } });

    api.post.mockResolvedValueOnce({ data: newRecord });
    api.get.mockResolvedValueOnce({
      data: { treatments: [...mockTreatmentsData.treatments, newRecord] },
    });
    api.get.mockResolvedValueOnce({
      data: {
        inventory: [
          { ...inventoryItems[0], total_available: 16 },
          inventoryItems[1],
        ],
      },
    });

    render(
      <TestWrapper>
        <TreatmentRoutes />
      </TestWrapper>,
    );

    await waitFor(() =>
      expect(screen.getByText('Neem Oil')).toBeInTheDocument(),
    );

    await userEvent.click(
      screen.getByRole('button', { name: /create treatment/i }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: /create treatment/i,
    });

    const typeTrigger = within(drawer).getByRole('combobox', {
      name: /treatment type/i,
    });
    await userEvent.click(typeTrigger);
    const pesticideOption = await screen.findByRole('option', {
      name: /pesticide/i,
    });
    await userEvent.click(pesticideOption);

    const invTrigger = within(drawer).getByRole('combobox', {
      name: /subtract from/i,
    });
    await userEvent.click(invTrigger);
    const bugAwayOption = await screen.findByRole('option', {
      name: /bugaway \(20 l left\)/i,
    });
    await userEvent.click(bugAwayOption);

    const treeCodeInput = within(drawer).getByLabelText(/tree code/i);
    await userEvent.clear(treeCodeInput);
    await userEvent.type(treeCodeInput, 'COC-001');

    const amountInput = within(drawer).getByLabelText(/amount used/i);
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '4');

    expect(within(drawer).getByLabelText(/product \*/i)).toHaveValue('BugAway');
    expect(within(drawer).getByLabelText(/unit \*/i)).toHaveValue('L');

    await userEvent.click(
      within(drawer).getByRole('button', { name: /submit/i }),
    );

    expect(api.post).toHaveBeenCalledWith(
      '/treatments',
      expect.objectContaining({
        treeCode: 'COC-001',
        type: 'Pesticide',
        inventoryItemId: String(inventoryItems[0].id),
        product: 'BugAway',
        amount: 4,
        unit: 'L',
      }),
    );

    await waitFor(() =>
      expect(screen.getByText('BugAway')).toBeInTheDocument(),
    );
  });
});
