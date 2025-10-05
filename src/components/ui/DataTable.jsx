import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { DataTablePagination } from '@/components/ui/DataTablePagination';
import { ChevronRight, ChevronDown, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { DataTableFilterPopover } from './DataTableFilterPopover';

export const DataTable = ({
  columns,
  data,
  CreateResource,
  expandable,
  filters = [],
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [expanded, setExpanded] = useState({});
  const [activeFilters, setActiveFilters] = useState({});

  const filteredData = React.useMemo(() => {
    if (!filters?.length) return data;
    return data?.filter((row) =>
      filters.every((f) => {
        const val = activeFilters[f.id];
        if (!val || (Array.isArray(val) && val.length === 0)) return true;
        const rowVal = row?.[f.id];
        if (f.type === 'multi-select') return val.includes(rowVal);
        if (f.type === 'select') return rowVal === val;
        if (f.type === 'text')
          return String(rowVal ?? '')
            .toLowerCase()
            .includes(String(val).toLowerCase());
        return true;
      }),
    );
  }, [data, filters, activeFilters]);

  const tableColumns = expandable
    ? [
        {
          id: 'expand',
          header: '',
          cell: ({ row }) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ),
        },
        ...columns,
      ]
    : columns;

  const table = useReactTable({
    data: filteredData ?? [],
    columns: tableColumns,
    state: { globalFilter, expanded },
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const hasActiveFilters = Object.values(activeFilters).some((v) =>
    Array.isArray(v) ? v.length > 0 : v != null && v !== '',
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full sm:max-w-sm px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <DataTableFilterPopover
              filters={filters}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1">
              {filters.map((f) => {
                const val = activeFilters[f.id];
                const values = Array.isArray(val) ? val : val ? [val] : [];
                return values.map((v) => (
                  <Badge
                    key={`${f.id}-${String(v)}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <span className="capitalize">{f.label}:</span>
                    <span className="capitalize">{String(v)}</span>
                    <button
                      className="ml-1 rounded hover:bg-muted/60"
                      onClick={() =>
                        setActiveFilters((prev) => {
                          if (Array.isArray(prev[f.id])) {
                            const next = prev[f.id].filter((x) => x !== v);
                            return { ...prev, [f.id]: next };
                          }
                          return { ...prev, [f.id]: undefined };
                        })
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ));
              })}
            </div>
          )}
        </div>
        {CreateResource && (
          <div className="sm:shrink-0">
            <CreateResource />
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <button
                        className="ml-2 inline-block"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.column.getIsSorted() === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    className={
                      expandable ? 'cursor-pointer hover:bg-gray-50' : ''
                    }
                    onClick={() => expandable && row.toggleExpanded()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandable && row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={tableColumns.length} className="p-0">
                        {expandable.renderExpanded({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};
