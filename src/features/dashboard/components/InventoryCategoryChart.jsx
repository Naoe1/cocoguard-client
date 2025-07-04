import * as React from 'react';
import { Pie, PieChart, Sector } from 'recharts';
import { Skeleton } from '@/shared/components/ui/skeleton';

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

const chartConfig = {
  value: {
    label: 'Quantity',
  },
  fungicide: {
    label: 'Fungicide',
    color: 'hsl(300 70% 50%)',
  },
  product: {
    label: 'Product',
    color: 'hsl(180 70% 50%)',
  },
  fertilizer: {
    label: 'Fertilizer',
    color: 'hsl(142.1 76.2% 36.3%)',
  },
  herbicide: {
    label: 'Herbicide',
    color: 'hsl(60 70% 50%)',
  },
  others: {
    label: 'Others',
    color: 'hsl(260 50% 60%)',
  },
  pesticide: {
    label: 'Pesticide',
    color: 'hsl(0 72.2% 50.6%)',
  },
  default: {
    label: 'Unknown',
    color: 'hsl(0 0% 70%)',
  },
};

export function InventoryCategoryChart({ inventoryCategoryData, isLoading }) {
  const id = 'pie-inventory-category';

  const chartData = React.useMemo(() => {
    if (!inventoryCategoryData) return [];
    return Object.entries(inventoryCategoryData)
      .map(([category, value]) => {
        const categoryKey = category.toLowerCase();
        const configEntry = chartConfig[categoryKey] || chartConfig.default;
        return {
          category: configEntry.label,
          value: value || 0,
          fill: `var(--color-${categoryKey}, ${configEntry.color})`,
        };
      })
      .filter((item) => item.value > 0);
  }, [inventoryCategoryData]);

  const [activeCategory, setActiveCategory] = React.useState(
    chartData.length > 0 ? chartData[0].category : null,
  );

  React.useEffect(() => {
    if (
      chartData.length > 0 &&
      !chartData.some((d) => d.category === activeCategory)
    ) {
      setActiveCategory(chartData[0].category);
    } else if (chartData.length === 0) {
      setActiveCategory(null);
    }
  }, [chartData, activeCategory]);

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.category === activeCategory),
    [activeCategory, chartData],
  );

  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="items-center pb-0">
          <Skeleton className="h-6 w-3/5 mb-1" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </CardContent>
        <CardContent className="flex flex-col gap-2 text-sm pt-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col h-full items-center justify-center">
        <CardHeader className="items-center pb-0">
          <CardTitle>Inventory by Category</CardTitle>
          <CardDescription>Distribution of inventory items</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">
            No inventory category data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-chart={id} className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory by Category</CardTitle>
        <CardDescription>Distribution of inventory items</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
              onMouseEnter={(_, index) => {
                if (chartData[index]) {
                  setActiveCategory(chartData[index].category);
                }
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex flex-col gap-2 text-sm pt-4">
        {activeIndex !== -1 && chartData[activeIndex] ? (
          <>
            <div className="flex items-center justify-between font-medium">
              <span>{activeCategory}</span>
              <span>
                {chartData[activeIndex].value.toFixed(2)} units (
                {totalValue > 0
                  ? ((chartData[activeIndex].value / totalValue) * 100).toFixed(
                      1,
                    )
                  : 0}
                %)
              </span>
            </div>
            <div className="leading-none text-muted-foreground">
              Showing details for {activeCategory}. Total units:{' '}
              {totalValue.toFixed(2)}
            </div>
          </>
        ) : (
          <div className="leading-none text-muted-foreground">
            Hover over a segment to see details. Total units:{' '}
            {totalValue.toFixed(2)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
