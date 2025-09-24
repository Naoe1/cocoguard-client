import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import React from 'react';
import { CheckDiseaseDialog } from '../components/CheckDiseaseDialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/src/lib/apiClient', () => ({ api: { post: vi.fn() } }));

vi.mock('../api/CheckDisease', async () => {
  const actual = await vi.importActual('../api/CheckDisease');
  return { ...actual, useCheckDisease: vi.fn() };
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const { useCheckDisease } = await import('../api/CheckDisease');

const renderWithQuery = (ui) => {
  const qc = new QueryClient();
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
};

const mockUseCheckDisease = (payload) => {
  useCheckDisease.mockImplementation(({ mutationConfig }) => ({
    isPending: false,
    isError: false,
    isSuccess: true,
    mutate: () => mutationConfig?.onSuccess?.({ data: payload }),
    reset: vi.fn(),
  }));
};

const SAMPLE_EMPTY_PREDICTIONS = {
  inference_id: '1cb8d510-ef9c-4d65-8c3c-237683946078',
  time: 0.29913056199984567,
  image: { width: 1000, height: 562 },
  predictions: [],
};

describe('CheckDiseaseDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders dialog content when open', () => {
    mockUseCheckDisease({ predictions: [] });

    renderWithQuery(
      <CheckDiseaseDialog
        open={true}
        onOpenChange={() => {}}
        TriggerButton={null}
        id={123}
      />,
    );

    expect(screen.getByText(/Check Coconut Tree Disease/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Image/i })).toBeEnabled();
  });

  it('selects an image and runs check disease showing predictions', async () => {
    mockUseCheckDisease({
      predictions: [
        {
          class: 'blight',
          confidence: 0.91,
          x: 10,
          y: 10,
          width: 5,
          height: 5,
        },
      ],
    });

    renderWithQuery(
      <CheckDiseaseDialog
        open={true}
        onOpenChange={() => {}}
        TriggerButton={null}
        id={7}
      />,
    );

    const file = new File(['x'], 'leaf.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    await screen.findByRole('button', { name: /Change Image/i });
    fireEvent.click(screen.getByRole('button', { name: /Check Disease/i }));

    await waitFor(() => {
      expect(screen.getByText(/Predictions:/i)).toBeInTheDocument();
      expect(screen.getByText(/blight/i)).toBeInTheDocument();
    });
  });

  it('shows no diseases detected on empty predictions', async () => {
    mockUseCheckDisease({ predictions: [] });

    renderWithQuery(
      <CheckDiseaseDialog
        open={true}
        onOpenChange={() => {}}
        TriggerButton={null}
        id={7}
      />,
    );

    const file = new File(['x'], 'leaf.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    await screen.findByRole('button', { name: /Change Image/i });
    fireEvent.click(screen.getByRole('button', { name: /Check Disease/i }));

    await waitFor(() => {
      expect(screen.getByText(/No diseases detected/i)).toBeInTheDocument();
    });
  });

  it('handles the exact sample API response shape (empty predictions)', async () => {
    mockUseCheckDisease(SAMPLE_EMPTY_PREDICTIONS);

    renderWithQuery(
      <CheckDiseaseDialog
        open={true}
        onOpenChange={() => {}}
        TriggerButton={null}
        id={7}
      />,
    );

    const file = new File(['x'], 'leaf.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    await screen.findByRole('button', { name: /Change Image/i });
    fireEvent.click(screen.getByRole('button', { name: /Check Disease/i }));

    await waitFor(() => {
      expect(screen.getByText(/No diseases detected/i)).toBeInTheDocument();
    });
  });

  it('rejects invalid files', async () => {
    mockUseCheckDisease({ predictions: [] });

    renderWithQuery(
      <CheckDiseaseDialog
        open={true}
        onOpenChange={() => {}}
        TriggerButton={null}
        id={42}
      />,
    );

    const invalidFile = new File(['hello'], 'notes.txt', {
      type: 'text/plain',
    });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [invalidFile] } });

    const { toast } = await import('sonner');
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    expect(
      screen.queryByRole('button', { name: /Change Image/i }),
    ).not.toBeInTheDocument();
  });
});
