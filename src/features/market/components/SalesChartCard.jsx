import React from 'react';
import {
  Area,
  AreaChart,
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

export const SalesChartCard = ({ salesData, salesChartConfig, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales This Month</CardTitle>
        <CardDescription>
          Total sales revenue over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ChartContainer
            config={salesChartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart
              data={salesData}
              margin={{ left: 12, right: 12, top: 20, bottom: 3 }}
            >
              <defs>
                <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="created_at"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `₱${value / 1000}k`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                cursor={false}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) =>
                      `₱${value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                }
              />
              <Area
                dataKey="net_amount"
                type="monotone"
                fill="url(#fillSales)"
                stroke="var(--color-sales)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
