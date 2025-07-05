import React from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const CopraPriceHistoryChartCard = ({
  copraPriceHistoryData,
  copraPriceChartConfig,
  isLoading,
}) => {
  // useMemo will prevent re-sorting if copraPriceHistoryData hasn't changed.
  const sortedChartData = React.useMemo(() => {
    if (!copraPriceHistoryData || copraPriceHistoryData.length === 0) {
      return []; // Return empty array if no data or data is empty
    }
    // Create a shallow copy before sorting to avoid mutating the prop
    return [...copraPriceHistoryData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [copraPriceHistoryData]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Copra Price History (Last 15 Days)</CardTitle>
        <CardDescription>Daily copra price per kilogram.</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer
            config={copraPriceChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              data={sortedChartData}
              margin={{ left: 0, right: 12, top: 5, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    day: 'numeric',
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={['dataMin - 0.5', 'dataMax + 0.5']} // Dynamic domain with padding
                tickFormatter={(value) => `₱${value.toFixed(1)}`}
              />
              <Tooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value) => `₱${value.toFixed(2)}`}
                  />
                }
              />
              <Line
                dataKey="price"
                type="monotone"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
