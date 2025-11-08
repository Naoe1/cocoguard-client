import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import HarvestsRoutes from '../harvest/Harvests';
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
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const mockHarvestsData = {
  harvests: [
    {
      id: 'h1',
      trace_number: 'ABCDEFG',
      harvest_date: '2024-03-20T00:00:00.000Z',
      tree: { id: 1, tree_code: 'COC-001' },
      total_weight: 25.5,
      coconut_count: 10,
      added_to_inventory: false,
      estimated_value: 1000.25,
    },
    {
      id: 'h2',
      trace_number: 'HIJKLMN',
      harvest_date: '2024-03-18T00:00:00.000Z',
      tree: { id: 2, tree_code: 'COC-002' },
      total_weight: 18.2,
      coconut_count: 7,
      added_to_inventory: true,
      estimated_value: 750.0,
    },
  ],
};

describe('Harvests Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render harvests', async () => {
    api.get.mockResolvedValueOnce({ data: mockHarvestsData });

    render(
      <TestWrapper>
        <HarvestsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(mockHarvestsData.harvests[0].trace_number),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(mockHarvestsData.harvests[1].trace_number),
    ).toBeInTheDocument();
    expect(screen.getByText('COC-001')).toBeInTheDocument();
    expect(screen.getByText('COC-002')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/harvests', { params: {} });
  });

  it('should create a harvest', async () => {
    const newHarvest = {
      id: 'h3',
      trace_number: 'NEWTRACE',
      harvest_date: '2024-03-22T00:00:00.000Z',
      tree: { id: 3, tree_code: 'COC-003' },
      total_weight: 30,
      coconut_count: 12,
      added_to_inventory: false,
      estimated_value: 1200,
    };

    api.get.mockResolvedValueOnce({ data: mockHarvestsData });
    api.post.mockResolvedValueOnce({ data: newHarvest });
    api.get.mockResolvedValueOnce({
      data: { harvests: [...mockHarvestsData.harvests, newHarvest] },
    });

    render(
      <TestWrapper>
        <HarvestsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /create harvest/i }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: /create harvest/i,
    });

    await userEvent.clear(within(drawer).getByLabelText(/tree nickname/i));
    await userEvent.type(
      within(drawer).getByLabelText(/tree nickname/i),
      'COC-003',
    );
    await userEvent.clear(within(drawer).getByLabelText(/number of coconuts/i));
    await userEvent.type(
      within(drawer).getByLabelText(/number of coconuts/i),
      '12',
    );
    await userEvent.clear(within(drawer).getByLabelText(/total weight/i));
    await userEvent.type(within(drawer).getByLabelText(/total weight/i), '30');

    await userEvent.click(
      within(drawer).getByRole('button', { name: /submit/i }),
    );

    expect(api.post).toHaveBeenCalledWith('/harvests', {
      treeCode: 'COC-003',
      harvestDate: expect.any(Date),
      coconutCount: 12,
      totalWeight: 30,
    });

    await waitFor(() => {
      expect(screen.getByText('COC-003')).toBeInTheDocument();
    });
  });

  it('should update a harvest', async () => {
    const updated = {
      ...mockHarvestsData.harvests[0],
      coconut_count: 20,
      total_weight: 40,
    };

    api.get.mockResolvedValueOnce({ data: mockHarvestsData });
    api.get.mockResolvedValueOnce({ data: mockHarvestsData.harvests[0] });
    api.patch.mockResolvedValueOnce({ data: updated });
    api.get.mockResolvedValueOnce({
      data: { harvests: [updated, mockHarvestsData.harvests[1]] },
    });

    render(
      <TestWrapper>
        <HarvestsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

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
      name: /edit/i,
    });

    const coconutCountInput =
      within(dialog).getByLabelText(/coconut nut count/i);
    const weightInput = within(dialog).getByLabelText(
      /quantity collected \(kg\)/i,
    );

    await userEvent.clear(coconutCountInput);
    await userEvent.type(coconutCountInput, '20');
    await userEvent.clear(weightInput);
    await userEvent.type(weightInput, '40');

    await userEvent.click(
      within(dialog).getByRole('button', { name: /update harvest/i }),
    );

    expect(api.patch).toHaveBeenCalledWith('/harvests/h1', {
      treeCode: 'COC-001',
      harvestDate: expect.any(Date),
      coconutCount: 20,
      totalWeight: 40,
    });

    await waitFor(() => {
      expect(screen.getByText('40')).toBeInTheDocument();
    });
  });

  it('should delete a harvest', async () => {
    api.get.mockResolvedValueOnce({ data: mockHarvestsData });
    api.delete.mockResolvedValueOnce({ data: { success: true } });
    api.get.mockResolvedValueOnce({
      data: { harvests: [mockHarvestsData.harvests[1]] },
    });

    render(
      <TestWrapper>
        <HarvestsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

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

    expect(api.delete).toHaveBeenCalledWith('/harvests/h1');

    await waitFor(() => {
      expect(screen.queryByText('COC-001')).not.toBeInTheDocument();
    });
    expect(screen.getByText('COC-002')).toBeInTheDocument();
  });

  it('should hide action buttons for STAFF role', async () => {
    vi.mocked(useAuth).mockReturnValue({
      auth: { user: { role: 'STAFF' } },
    });

    api.get.mockResolvedValueOnce({ data: mockHarvestsData });

    render(
      <TestWrapper>
        <HarvestsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

    const buttons = screen.queryAllByRole('button');
    const dropdownButtons = buttons.filter(
      (b) => b.getAttribute('aria-haspopup') === 'menu',
    );
    expect(dropdownButtons).toHaveLength(0);
  });

  it('should show an error if tree does not exist', async () => {
    api.get.mockResolvedValueOnce({ data: mockHarvestsData });

    render(
      <TestWrapper>
        <HarvestsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /create harvest/i }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: /create harvest/i,
    });

    await userEvent.clear(within(drawer).getByLabelText(/tree nickname/i));
    await userEvent.type(
      within(drawer).getByLabelText(/tree nickname/i),
      'INVALID',
    );
    await userEvent.clear(within(drawer).getByLabelText(/number of coconuts/i));
    await userEvent.type(
      within(drawer).getByLabelText(/number of coconuts/i),
      '12',
    );
    await userEvent.clear(within(drawer).getByLabelText(/total weight/i));
    await userEvent.type(within(drawer).getByLabelText(/total weight/i), '30');

    const error = {
      response: {
        data: {
          validationError: {
            field: 'treeCode',
            message: 'Tree not found',
          },
        },
      },
    };
    api.post.mockRejectedValueOnce(error);

    await userEvent.click(
      within(drawer).getByRole('button', { name: /submit/i }),
    );

    expect(api.post).toHaveBeenCalledWith('/harvests', {
      treeCode: 'INVALID',
      harvestDate: expect.any(Date),
      coconutCount: 12,
      totalWeight: 30,
    });

    await waitFor(() => {
      expect(screen.getByText(/tree not found/i)).toBeInTheDocument();
    });
  });
});
