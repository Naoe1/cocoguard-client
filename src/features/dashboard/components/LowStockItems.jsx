import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { AlertTriangle, Package } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const LowStockItems = ({ lowStockItems = [], isLoading }) => {
  const filteredItems = lowStockItems.filter(
    (item) => item.total_available <= item.low_stock_alert,
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Low Stock Items
        </CardTitle>
        <CardDescription>Items needing reordering soon.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading && (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="grid gap-1 flex-grow">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="grid gap-1 flex-grow">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </>
        )}

        {!isLoading &&
          filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  Threshold: {item.low_stock_alert} {item.unit}
                </p>
              </div>
              <Badge variant="destructive">
                {item.total_available} {item.unit} Left
              </Badge>
            </div>
          ))}

        {!isLoading && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-4">
            <Package className="h-8 w-8 mb-2 text-green-500" />
            <p className="text-sm">All inventory levels are above threshold.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
