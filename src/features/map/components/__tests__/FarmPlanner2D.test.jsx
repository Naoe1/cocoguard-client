import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import FarmPlanner2D from '../FarmPlanner2D.jsx';

const mockCoconutsRef = { coconuts: [] };
vi.mock('../../../coconuts/api/GetCoconuts.js', () => ({
  useCoconuts: () => ({
    data: { data: { coconuts: mockCoconutsRef.coconuts } },
    isLoading: false,
    isError: false,
  }),
}));

function renderWithRQ(ui) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

function TestHarness({ coconuts = [], size = 320 }) {
  mockCoconutsRef.coconuts = coconuts;
  const [layout, setLayout] = useState([]);
  const bounds = { minX: -9.5, maxX: 9.5, minZ: -9.5, maxZ: 9.5 };
  return (
    <FarmPlanner2D
      layout={layout}
      setLayout={setLayout}
      bounds={bounds}
      size={size}
    />
  );
}

const mockGetBBox = (el, size) => {
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: size,
    bottom: size,
    width: size,
    height: size,
    toJSON: () => ({}),
  });
};

describe('FarmPlanner2D', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    mockCoconutsRef.coconuts = [];
    vi.restoreAllMocks();
  });

  it('pre-populates layout from coconuts with coords', () => {
    const coconuts = [
      { id: 1, tree_seq: 'A1', coord: { x: 0, z: 0 } },
      { id: 2, tree_seq: 'B2' },
    ];

    renderWithRQ(<TestHarness coconuts={coconuts} size={300} />);

    const circles = document.querySelectorAll('circle');
    expect(circles.length).toBe(1);
    const labels = screen.getAllByText(/A1/);
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it('adds a tree on click when a coconut is selected', () => {
    const size = 300;
    const coconuts = [
      { id: 10, tree_seq: 'T-10' },
      { id: 11, tree_seq: 'T-11' },
    ];

    renderWithRQ(<TestHarness coconuts={coconuts} size={size} />);

    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
    mockGetBBox(svg, size);

    fireEvent.click(svg, { clientX: size / 2, clientY: size / 2 });

    const circles = document.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThanOrEqual(1);

    const t10Labels = screen.getAllByText(/T-10/);
    expect(t10Labels.length).toBeGreaterThanOrEqual(1);
  });

  it('shows a notice and prevents placement when all trees placed', () => {
    const size = 240;
    const coconuts = [{ id: 5, tree_seq: 'ONE' }];

    renderWithRQ(<TestHarness coconuts={coconuts} size={size} />);

    const svg = document.querySelector('svg');
    mockGetBBox(svg, size);

    fireEvent.click(svg, { clientX: size / 2, clientY: size / 2 });
    const oneLabels = screen.getAllByText(/ONE/);
    expect(oneLabels.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(svg, { clientX: size / 3, clientY: size / 3 });
    expect(screen.getByText(/All selected trees placed/i)).toBeInTheDocument();
  });
});
