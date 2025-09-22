import { render, screen } from '@testing-library/react';
import { Trees } from 'lucide-react';
import { InventoryCategoryChart } from '../components/InventoryCategoryChart';
import { LowStockItems } from '../components/LowStockItems';
import { SummaryCard } from '../components/SummaryCard';
import {
  YieldChartView,
  processHarvestData,
} from '../components/YieldChartView';

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 800,
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 400,
  });
  if (!SVGElement.prototype.getBBox) {
    SVGElement.prototype.getBBox = () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 20,
    });
  }
});

describe('InventoryCategoryChart', () => {
  it('renders skeletons when loading', () => {
    render(<InventoryCategoryChart isLoading inventoryCategoryData={{}} />);
    expect(screen.queryByText('Inventory by Category')).not.toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(
      <InventoryCategoryChart isLoading={false} inventoryCategoryData={{}} />,
    );
    expect(screen.getByText('Inventory by Category')).toBeInTheDocument();
    expect(
      screen.getByText('No inventory category data available.'),
    ).toBeInTheDocument();
  });

  it('renders chart and details when data is present', async () => {
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    const data = { Fertilizer: 30, Herbicide: 10, UnknownType: 5 };
    render(
      <InventoryCategoryChart isLoading={false} inventoryCategoryData={data} />,
    );

    expect(screen.getByText('Inventory by Category')).toBeInTheDocument();
    expect(screen.getByText(/Total units:\s*45.00/i)).toBeInTheDocument();
  });
});

describe('LowStockItems', () => {
  const sampleItems = [
    {
      id: 1,
      name: 'Urea',
      unit: 'kg',
      low_stock_alert: 20,
      total_available: 10,
    },
    {
      id: 2,
      name: 'Pesticide',
      unit: 'L',
      low_stock_alert: 5,
      total_available: 8,
    },
    {
      id: 3,
      name: 'Herbicide',
      unit: 'L',
      low_stock_alert: 15,
      total_available: 15,
    },
  ];

  it('shows skeletons when loading', () => {
    render(<LowStockItems isLoading lowStockItems={sampleItems} />);
    expect(screen.getByText('Low Stock Items')).toBeInTheDocument();
    expect(screen.queryByText('Urea')).toBeNull();
  });

  it('renders only items at or below threshold', () => {
    render(<LowStockItems isLoading={false} lowStockItems={sampleItems} />);
    expect(screen.getByText('Urea')).toBeInTheDocument();
    expect(screen.getByText('Herbicide')).toBeInTheDocument();
    expect(screen.queryByText('Pesticide')).toBeNull();

    expect(screen.getByText(/10 kg Left/i)).toBeInTheDocument();
    expect(screen.getByText(/15 L Left/i)).toBeInTheDocument();
  });

  it('renders empty state when no low stock items', () => {
    render(
      <LowStockItems
        isLoading={false}
        lowStockItems={[
          {
            id: 99,
            name: 'Water',
            unit: 'L',
            low_stock_alert: 5,
            total_available: 100,
          },
        ]}
      />,
    );
    expect(
      screen.getByText('All inventory levels are above threshold.'),
    ).toBeInTheDocument();
  });
});

describe('SummaryCard', () => {
  it('renders skeleton when loading', () => {
    render(
      <SummaryCard
        title="My Title"
        value={123}
        change="+2 since last"
        isLoading
      />,
    );
    expect(screen.queryByText('My Title')).toBeNull();
    expect(screen.queryByText('123')).toBeNull();
  });

  it('renders title, value and change when not loading', () => {
    render(
      <SummaryCard
        title="Total Items"
        value={456}
        change="+10 new"
        icon={<Trees aria-label="trees-icon" />}
        isLoading={false}
      />,
    );

    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getByText('+10 new')).toBeInTheDocument();
    expect(screen.getByLabelText('trees-icon')).toBeInTheDocument();
  });
});

describe('processHarvestData', () => {
  it('returns empty array for invalid input', () => {
    expect(processHarvestData(null)).toEqual([]);
    expect(processHarvestData({})).toEqual([]);
  });

  it('aggregates weights per date and sorts by date', () => {
    const input = [
      { harvest_date: '2025-01-02T10:00:00Z', total_weight: 10 },
      { harvest_date: '2025-01-01T12:00:00Z', total_weight: 5 },
      { harvest_date: '2025-01-02T08:00:00Z', total_weight: 2.5 },
      { harvest_date: '2025-01-03T00:00:00Z', total_weight: 20 },
      // invalid entries ignored
      { harvest_date: null, total_weight: 3 },
      { harvest_date: '2025-01-01T12:00:00Z', total_weight: null },
    ];

    const out = processHarvestData(input);
    expect(out).toEqual([
      { date: '2025-01-01', totalWeight: 5 },
      { date: '2025-01-02', totalWeight: 12.5 },
      { date: '2025-01-03', totalWeight: 20 },
    ]);
  });
});

describe('YieldChartView', () => {
  it('shows loading skeleton when isLoading', () => {
    render(<YieldChartView isLoading harvestData={[]} />);
    expect(screen.queryByText(/Yield|Harvest/i)).toBeNull();
  });

  it('renders with given harvest data', () => {
    const harvestData = [
      { date: '2025-01-01', weight: 100 },
      { date: '2025-01-15', weight: 50 },
    ];
    render(<YieldChartView isLoading={false} harvestData={harvestData} />);

    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
