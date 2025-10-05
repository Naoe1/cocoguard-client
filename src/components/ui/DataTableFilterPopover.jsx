import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Filter } from 'lucide-react';

export const DataTableFilterPopover = ({
  filters,
  activeFilters,
  setActiveFilters,
}) => {
  const hasActiveFilters = React.useMemo(
    () =>
      Object.values(activeFilters).some((v) =>
        Array.isArray(v) ? v.length > 0 : v != null && v !== '',
      ),
    [activeFilters],
  );

  const clearAllFilters = () => setActiveFilters({});

  if (!filters?.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {Object.values(activeFilters).reduce((acc, v) => {
                const count = Array.isArray(v) ? v.length : v ? 1 : 0;
                return acc + count;
              }, 0)}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          Filters
          {hasActiveFilters && (
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={clearAllFilters}
            >
              Clear all
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {filters.map((f) => (
          <div key={f.id} className="px-1 py-1.5">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              {f.label}
            </div>

            {f.type === 'multi-select' && (
              <div className="max-h-48 overflow-auto pr-1">
                {(f.options || []).map((opt) => {
                  const selected = Array.isArray(activeFilters[f.id])
                    ? activeFilters[f.id].includes(opt.value)
                    : false;
                  return (
                    <DropdownMenuCheckboxItem
                      key={String(opt.value)}
                      checked={selected}
                      onCheckedChange={(checked) => {
                        setActiveFilters((prev) => {
                          const current = Array.isArray(prev[f.id])
                            ? prev[f.id]
                            : [];
                          let next = checked
                            ? [...current, opt.value]
                            : current.filter((v) => v !== opt.value);
                          return { ...prev, [f.id]: next };
                        });
                      }}
                      className="capitalize"
                    >
                      {opt.label ?? String(opt.value)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </div>
            )}

            {f.type === 'select' && (
              <DropdownMenuRadioGroup
                value={String(activeFilters[f.id] ?? '')}
                onValueChange={(val) =>
                  setActiveFilters((prev) => ({
                    ...prev,
                    [f.id]: val === '' ? undefined : val,
                  }))
                }
              >
                <DropdownMenuRadioItem value="">Any</DropdownMenuRadioItem>
                {(f.options || []).map((opt) => (
                  <DropdownMenuRadioItem
                    key={String(opt.value)}
                    value={String(opt.value)}
                    className="capitalize"
                  >
                    {opt.label ?? String(opt.value)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            )}

            {f.type === 'text' && (
              <input
                type="text"
                className="w-full px-2 py-1 mt-1 border rounded-md text-sm"
                placeholder={`Filter ${f.label.toLowerCase()}`}
                value={String(activeFilters[f.id] ?? '')}
                onChange={(e) =>
                  setActiveFilters((prev) => ({
                    ...prev,
                    [f.id]: e.target.value,
                  }))
                }
              />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
