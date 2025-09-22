import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/components/ui/toggle-group';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const processHarvestData = (data = []) => {
  if (!Array.isArray(data)) {
    console.error('Invalid harvest data provided:', data);
    return [];
  }
  const aggregatedData = data.reduce((acc, harvest) => {
    if (!harvest?.harvest_date || harvest.total_weight == null) {
      return acc;
    }
    const dateStr = harvest.harvest_date.split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = { date: dateStr, totalWeight: 0 };
    }
    acc[dateStr].totalWeight += harvest.total_weight;
    return acc;
  }, {});

  return Object.values(aggregatedData).sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
};

const chartConfig = {
  totalWeight: {
    label: 'Total Weight (kg)',
    color: 'hsl(129 52% 69%)',
  },
};

export const YieldChartView = ({ harvestData, isLoading }) => {
  const [timeRange, setTimeRange] = React.useState('90d');

  const processedData = React.useMemo(
    () => processHarvestData(harvestData),
    [harvestData],
  );

  const filteredData = React.useMemo(() => {
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    startDate.setHours(0, 0, 0, 0);

    return processedData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  }, [processedData, timeRange]);

  const totalYield = React.useMemo(
    () =>
      filteredData.reduce((sum, item) => sum + item.totalWeight, 0).toFixed(1),
    [filteredData],
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/5 mb-1" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent className="pb-4">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative pb-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Harvest Yield Over Time</CardTitle>
            <CardDescription>
              Total yield (
              {timeRange === '90d'
                ? 'last 3 months'
                : timeRange === '30d'
                ? 'last 30 days'
                : 'last 7 days'}
              ): {totalYield} kg
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => value && setTimeRange(value)}
              variant="outline"
              className="@[767px]/card:flex hidden"
              size="sm"
            >
              <ToggleGroupItem value="90d" className="h-8 px-2.5">
                3m
              </ToggleGroupItem>
              <ToggleGroupItem value="30d" className="h-8 px-2.5">
                30d
              </ToggleGroupItem>
              <ToggleGroupItem value="7d" className="h-8 px-2.5">
                7d
              </ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={timeRange}
              onValueChange={(value) => value && setTimeRange(value)}
            >
              <SelectTrigger
                className="@[767px]/card:hidden flex w-[100px] h-9"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={filteredData}
            margin={{ left: 0, right: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillHarvest" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalWeight)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalWeight)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />{' '}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
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
              tickFormatter={(value) => `${value} kg`}
              width={50}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  formatter={(value, name, props) => [
                    `${value.toFixed(1)} kg`,
                    chartConfig[props.dataKey]?.label || 'Weight',
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="totalWeight"
              type="monotone"
              fill="url(#fillHarvest)"
              stroke="var(--color-totalWeight)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
