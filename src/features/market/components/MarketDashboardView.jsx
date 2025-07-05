import React from 'react';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'; // Import SummaryCard directly
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  BarChart,
  CalendarClock,
} from 'lucide-react';
import { SalesChartCard } from './SalesChartCard';
import { CopraPriceHistoryChartCard } from './CopraPriceHistoryChartCard';
import { CopraPricePredictionChartCard } from './CopraPricePredictionChartCard';
import { useSalesStats } from '../api/GetSalesStats';
import { useCopraPriceHistory } from '../api/GetPriceHistory';
import { forwardFillMissingDates } from '@/lib/utils';

const salesChartConfig = {
  sales: {
    label: 'Sales (₱)',
    color: 'hsl(142.1 76.2% 36.3%)',
  },
};

const copraPriceChartConfig = {
  price: {
    label: 'Price (₱/kg)',
    color: 'hsl(24.6 95% 53.1%)',
  },
};

export const MarketDashboardView = () => {
  const trendingUpIcon = (
    <TrendingUp className="h-4 w-4 text-muted-foreground" />
  );
  const barChartIcon = <BarChart className="h-4 w-4 text-muted-foreground" />;
  const calendarIcon = (
    <CalendarClock className="h-4 w-4 text-muted-foreground" />
  );
  const salesStatsQuery = useSalesStats();
  const salesStats = salesStatsQuery.data?.data.sales;
  const copraPriceHistoryQuery = useCopraPriceHistory();
  const copraPriceHistoryData =
    copraPriceHistoryQuery.data?.data.copraPriceHistory;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fifteenDaysAgo = new Date(today);
  fifteenDaysAgo.setDate(today.getDate() - 14);
  const dataFromLast15CalendarDays = copraPriceHistoryData?.filter((item) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate >= fifteenDaysAgo && itemDate <= today;
  });
  const sumOfPrices = (copraPriceHistoryData || [])?.reduce(
    (sum, item) => sum + item.price,
    0,
  );
  const meanPriceLast15CalendarDays =
    sumOfPrices / copraPriceHistoryData?.length;
  const dataFromLast15CalendarDaysFill = forwardFillMissingDates(
    dataFromLast15CalendarDays,
  );
  const copraPeakPrice = Math.max(
    ...(copraPriceHistoryData || [])?.map((d) => d.price),
  );

  const copraPricePredictionData =
    copraPriceHistoryQuery.data?.data.copraPricePrediction;

  const region = copraPriceHistoryQuery.data?.data.region;

  const copraPeakPricePrediction30 = Math.max(
    ...(copraPricePredictionData || [])?.map((d) => d.price),
  );

  const peakPricePredictionData =
    copraPriceHistoryQuery.data?.data.peakPrediction;

  const currentPrice = copraPriceHistoryQuery.data?.data.latestPriceData;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Sales"
          value={`₱${salesStats?.totalSales}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          change=""
          isLoading={salesStatsQuery.isLoading}
        />
        <SummaryCard
          title="Current Copra Price"
          value={`₱${currentPrice?.latest_price} / kg`}
          icon={trendingUpIcon}
          change={'Current price for ' + region}
          isLoading={copraPriceHistoryQuery.isLoading}
        />
        <SummaryCard
          title="Total Orders"
          value={salesStats?.totalOrders}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          change={`+${salesStats?.ordersLast7Days} this week`}
          isLoading={salesStatsQuery.isLoading}
        />
        <SummaryCard
          title="Total Customers"
          value={salesStats?.totalCustomers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          change=""
          isLoading={salesStatsQuery.isLoading}
        />
      </div>

      <SalesChartCard
        salesData={salesStats?.recentSales}
        salesChartConfig={salesChartConfig}
        isLoading={salesStatsQuery.isLoading}
      />
      <div className="w-full bg-muted/20 rounded-lg p-4 mb-2">
        <h2 className="text-2xl font-bold text-center">
          Market Data for {region || '...'}
        </h2>
        <p className="text-center text-muted-foreground">
          All prices and predictions below are specific to this region
        </p>
      </div>
      <div
        onClick={() => console.log(dataFromLast15CalendarDays)}
        className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 xl:gap-8"
      >
        <CopraPriceHistoryChartCard
          copraPriceHistoryData={dataFromLast15CalendarDaysFill}
          copraPriceChartConfig={copraPriceChartConfig}
          isLoading={copraPriceHistoryQuery.isLoading}
        />
        <CopraPricePredictionChartCard
          copraPricePredictionData={copraPricePredictionData?.slice(0, 15)}
          copraPriceChartConfig={copraPriceChartConfig}
          isLoading={copraPriceHistoryQuery.isLoading}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Peak Price (Last 30d)"
          value={`₱${copraPeakPrice}`}
          icon={trendingUpIcon}
          change="Highest price recorded"
          isLoading={copraPriceHistoryQuery.isLoading}
        />
        <SummaryCard
          title="Average Price (Last 30d)"
          value={`₱${meanPriceLast15CalendarDays?.toFixed(2)}`}
          icon={barChartIcon}
          change="Mean price recorded"
          isLoading={copraPriceHistoryQuery.isLoading}
        />
        <SummaryCard
          title="Peak Price (Next 30d Est.)"
          value={`₱${
            copraPricePredictionData?.length > 0
              ? copraPeakPricePrediction30?.toFixed(2)
              : 'Unavailable'
          }`}
          icon={trendingUpIcon}
          change="Highest predicted price"
          isLoading={copraPriceHistoryQuery.isLoading}
        />
        <SummaryCard
          title="Peak Price (Next 4mo Est.)"
          value={peakPricePredictionData?.peak_price.toFixed(2)}
          icon={calendarIcon}
          change={
            'Highest predicted price in ' + peakPricePredictionData?.peak_date
          }
          isLoading={copraPriceHistoryQuery.isLoading}
        />
      </div>
    </div>
  );
};
