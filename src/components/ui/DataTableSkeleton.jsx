import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
export const DataTableSkeleton = ({
  columns,
  rows = 5,
  showControls = true,
}) => {
  return (
    <div>
      {showControls && (
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-24" />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={`header-skeleton-${index}`} className="p-3">
                  <Skeleton className="h-5 w-3/4" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={`row-skeleton-${rowIndex}`}>
                {Array.from({ length: columns }).map((_, cellIndex) => (
                  <TableCell
                    key={`cell-skeleton-${rowIndex}-${cellIndex}`}
                    className="p-3"
                  >
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  );
};
