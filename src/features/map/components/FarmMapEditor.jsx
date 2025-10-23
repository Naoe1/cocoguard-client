import React, { useMemo, useState, useCallback } from 'react';
import { useSaveLayout } from '../api/SaveLayout';
import Farm3D from './FarmMap.jsx';
import FarmPlanner2D from './FarmPlanner2D.jsx';
import { Button } from '@/shared/components/ui/button';

export default function FarmMapEditor() {
  const bounds = useMemo(
    () => ({ minX: -9.5, maxX: 9.5, minZ: -9.5, maxZ: 9.5 }),
    [],
  );

  const [layout, setLayout] = useState([]);

  const handleRemove = useCallback(
    (index) => {
      setLayout((prev) => prev.filter((_, i) => i !== index));
    },
    [setLayout],
  );

  const { mutate: save, isPending, isSuccess, isError } = useSaveLayout({});

  const handleSave = useCallback(() => {
    const payload = {
      layout: layout.map(({ x, z, coconut }) => ({
        x,
        z,
        coconut_id: coconut?.id ?? null,
      })),
    };
    save(payload);
  }, [layout, save]);

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 md:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold md:text-lg">
            Farm layout planner
          </h2>
        </div>
        <div className="w-full">
          <FarmPlanner2D
            layout={layout}
            setLayout={setLayout}
            bounds={bounds}
          />
          <div className="mt-2 flex gap-1">
            <Button variant="outline" onClick={() => setLayout([])}>
              Clear
            </Button>
            <Button type="button" onClick={handleSave} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save layout'}
            </Button>
          </div>
          {isSuccess && <span className="text-xs text-green-600">Saved</span>}
          {isError && (
            <span className="text-xs text-red-600">Failed to save</span>
          )}
        </div>
      </div>
      <div className="px-4 md:px-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold md:text-lg">3D preview</h2>
        </div>
        <div className="min-h-[400px]">
          <Farm3D layout={layout} onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
}
