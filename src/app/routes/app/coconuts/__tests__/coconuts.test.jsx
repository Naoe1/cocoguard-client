import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

import CoconutsRoutes from '../Coconuts';
import { api } from '@/lib/apiClient';
import userEvent from '@testing-library/user-event';

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
      user: {
        role: 'ADMIN',
      },
    },
  })),
}));

const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const mockCoconutsData = {
  coconuts: [
    {
      id: 1,
      tree_code: 'COC-001',
      planting_date: '2023-01-15',
      status: 'Healthy',
      harvest: [
        {
          harvest_date: '2024-03-20',
          total_weight: 25.5,
        },
      ],
    },
    {
      id: 2,
      tree_code: 'COC-002',
      planting_date: '2023-02-10',
      status: 'Diseased',
      harvest: [
        {
          harvest_date: '2024-03-18',
          total_weight: 18.2,
        },
      ],
    },
  ],
};

describe('Coconuts Integration Tests', () => {
  it('should render coconuts ', async () => {
    api.get.mockResolvedValueOnce({ data: mockCoconutsData });

    render(
      <TestWrapper>
        <CoconutsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

    expect(screen.getByText('COC-001')).toBeInTheDocument();
    expect(screen.getByText('COC-002')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/coconuts');
  });

  it('should create a coconut ', async () => {
    const newCoconut = {
      id: 3,
      tree_code: 'COC-003',
      planting_date: '2023-03-01',
      height: 12.5,
      trunk_diameter: 28.4,
      status: 'Young',
      harvest: [],
    };

    api.get.mockResolvedValueOnce({ data: mockCoconutsData });
    api.post.mockResolvedValueOnce({ data: newCoconut });
    api.get.mockResolvedValueOnce({
      data: { coconuts: [...mockCoconutsData.coconuts, newCoconut] },
    });

    render(
      <TestWrapper>
        <CoconutsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /Create coconut/i }),
    );

    const drawer = await screen.findByRole('dialog', {
      name: /create coconut/i,
    });

    await userEvent.type(
      within(drawer).getByLabelText(/Tree Code/i),
      'COC-003',
    );
    await userEvent.type(within(drawer).getByLabelText(/Height/i), '12.5');
    await userEvent.type(
      within(drawer).getByLabelText(/Trunk Diameter/i),
      '28.4',
    );

    await userEvent.click(
      within(drawer).getByRole('button', { name: /Submit/i }),
    );

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    expect(api.post).toHaveBeenCalledWith('/coconuts', {
      treeCode: 'COC-003',
      plantingDate: expect.any(Date),
      height: 12.5,
      trunkDiameter: 28.4,
      status: 'Healthy',
    });

    await waitFor(() => {
      expect(screen.getByText('COC-003')).toBeInTheDocument();
    });
  });

  it('should update a coconut', async () => {
    const updatedCoconut = {
      id: 1,
      tree_code: 'COC-001-UPDATED',
      planting_date: '2023-01-15',
      height: 15.2,
      trunk_diameter: 32.1,
      status: 'Healthy',
      harvest: [
        {
          harvest_date: '2024-03-20',
          total_weight: 25.5,
        },
      ],
    };

    api.get.mockResolvedValueOnce({ data: mockCoconutsData });
    api.get.mockResolvedValueOnce({ data: mockCoconutsData.coconuts[0] });
    api.put.mockResolvedValueOnce({ data: updatedCoconut });
    api.get.mockResolvedValueOnce({
      data: {
        coconuts: [updatedCoconut, mockCoconutsData.coconuts[1]],
      },
    });

    render(
      <TestWrapper>
        <CoconutsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

    const actionButtons = screen.getAllByRole('button');
    const dropdownButton = actionButtons.find(
      (button) =>
        button.getAttribute('aria-haspopup') === 'menu' &&
        button.querySelector('svg.lucide-ellipsis'),
    );

    await userEvent.click(dropdownButton);

    const editButton = await screen.findByRole('menuitem', { name: /edit/i });
    await userEvent.click(editButton);

    const dialog = await screen.findByRole('alertdialog', {
      name: /edit COC-001/i,
    });

    const treeCodeInput = within(dialog).getByLabelText(/Tree Code/i);
    const heightInput = within(dialog).getByLabelText(/Height/i);
    const trunkDiameterInput = within(dialog).getByLabelText(/Trunk Diameter/i);

    await userEvent.clear(treeCodeInput);
    await userEvent.type(treeCodeInput, 'COC-001-UPDATED');

    await userEvent.clear(heightInput);
    await userEvent.type(heightInput, '15.2');

    await userEvent.clear(trunkDiameterInput);
    await userEvent.type(trunkDiameterInput, '32.1');

    const submitButton = within(dialog).getByRole('button', {
      name: /submit/i,
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('COC-001-UPDATED')).toBeInTheDocument();
    });

    expect(screen.queryByText('COC-001')).not.toBeInTheDocument();
  });

  it('should delete a coconut', async () => {
    api.get.mockResolvedValueOnce({ data: mockCoconutsData });
    api.delete.mockResolvedValueOnce({ data: { success: true } });
    api.get.mockResolvedValueOnce({
      data: {
        coconuts: [mockCoconutsData.coconuts[1]],
      },
    });

    render(
      <TestWrapper>
        <CoconutsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

    const actionButtons = screen.getAllByRole('button');
    const dropdownButton = actionButtons.find(
      (button) =>
        button.getAttribute('aria-haspopup') === 'menu' &&
        button.querySelector('svg.lucide-ellipsis'),
    );

    await userEvent.click(dropdownButton);

    const deleteButton = await screen.findByRole('menuitem', {
      name: /delete/i,
    });
    await userEvent.click(deleteButton);

    const dialog = await screen.findByRole('alertdialog');

    expect(within(dialog).getByText(/are you sure/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/COC-001/)).toBeInTheDocument();

    const confirmDeleteButton = within(dialog).getByRole('button', {
      name: /delete/i,
    });
    await userEvent.click(confirmDeleteButton);

    expect(api.delete).toHaveBeenCalledWith('/coconuts/1');

    await waitFor(() => {
      expect(screen.queryByText('COC-001')).not.toBeInTheDocument();
    });

    expect(screen.getByText('COC-002')).toBeInTheDocument();
  });

  it('should display error message when API fails', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <CoconutsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong!')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/coconuts');
  });

  it('should show action buttons for ADMIN role', async () => {
    api.get.mockResolvedValueOnce({ data: mockCoconutsData });

    render(
      <TestWrapper>
        <CoconutsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    const dropdownButtons = buttons.filter(
      (button) =>
        button.getAttribute('aria-haspopup') === 'menu' &&
        button.querySelector('svg.lucide-ellipsis'),
    );
    expect(dropdownButtons.length).toBeGreaterThan(0);
  });

  it('should hide action buttons for STAFF role', async () => {
    vi.mocked(useAuth).mockReturnValue({
      auth: {
        user: {
          role: 'STAFF',
        },
      },
    });

    api.get.mockResolvedValueOnce({ data: mockCoconutsData });

    render(
      <TestWrapper>
        <CoconutsRoutes />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('COC-001')).toBeInTheDocument();
    });
    const buttons = screen.queryAllByRole('button');
    const dropdownButtons = buttons.filter(
      (button) => button.getAttribute('aria-haspopup') === 'menu',
    );
    expect(dropdownButtons).toHaveLength(0);
  });
});
