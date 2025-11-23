import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { useCoconuts } from '@/features/coconuts/api/GetCoconuts';

// 2D planner for tree layout. Uses SVG to display a square plot corresponding
// to the 3D terrain bounds. Clicking adds a tree at that position.
// Props:
// - layout: Array<{x:number, z:number, coconut?:object}>
// - setLayout: (next:Array) => void
// - bounds: { minX, maxX, minZ, maxZ }
// - size: number (px)
export default function FarmPlanner2D({
  layout,
  setLayout,
  bounds,
  size = 320,
}) {
  const svgRef = useRef(null);
  const w = size;
  const h = size;

  const { minX, maxX, minZ, maxZ } = bounds;
  const worldWidth = maxX - minX;
  const worldHeight = maxZ - minZ;

  // Backend coconuts for selection
  const { data, isLoading, isError } = useCoconuts({});
  const coconutList = useMemo(() => data?.data?.coconuts ?? [], [data]);
  const [selectedId, setSelectedId] = useState('');

  // Pre-populate layout with any coconuts that already have saved coordinates
  useEffect(() => {
    if (!coconutList.length) return;
    setLayout((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const existingIds = new Set(
        next
          .map((t) => (t?.coconut?.id != null ? String(t.coconut.id) : null))
          .filter(Boolean),
      );
      let changed = false;
      const clamp = (val, min, max) =>
        typeof val === 'number' ? Math.max(min, Math.min(max, val)) : undefined;
      for (const c of coconutList) {
        const hasCoord =
          c?.coord &&
          typeof c.coord.x === 'number' &&
          typeof c.coord.z === 'number';
        if (!hasCoord) continue;
        const idStr = String(c.id);
        if (existingIds.has(idStr)) continue;
        const x = clamp(c.coord.x, minX, maxX);
        const z = clamp(c.coord.z, minZ, maxZ);
        if (typeof x === 'number' && typeof z === 'number') {
          next.push({ x, z, coconut: c });
          existingIds.add(idStr);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [coconutList, minX, maxX, minZ, maxZ, setLayout]);

  // Default-select the first available tree when data loads (and whenever layout changes)
  useEffect(() => {
    if (!coconutList.length) return;
    // If there is a valid, not-yet-used selection, keep it
    if (selectedId) {
      const exists = coconutList.some(
        (c) => String(c.id) === String(selectedId),
      );
      const used = (layout || []).some(
        (t) => String(t?.coconut?.id) === String(selectedId),
      );
      if (exists && !used) return;
    }
    const usedIds = new Set(
      (layout || [])
        .map((t) => (t?.coconut?.id != null ? String(t.coconut.id) : null))
        .filter(Boolean),
    );
    const first = coconutList.find((c) => !usedIds.has(String(c.id)));
    if (first) setSelectedId(String(first.id));
  }, [coconutList, layout]);

  const [notice, setNotice] = useState('');
  // Track which coconuts are already used and whether all are placed
  const usedIds = useMemo(
    () =>
      new Set(
        (layout || [])
          .map((t) => (t?.coconut?.id != null ? String(t.coconut.id) : null))
          .filter(Boolean),
      ),
    [layout],
  );
  const allPlaced = useMemo(
    () =>
      coconutList.length > 0 &&
      coconutList.every((c) => usedIds.has(String(c.id))),
    [coconutList, usedIds],
  );
  const onClick = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // Convert pixel to world (x,z) with X inversion so left in 2D matches left in 3D
    const x = maxX - (px / w) * worldWidth;
    const z = maxZ - (py / h) * worldHeight; // invert Y to Z
    // Prevent adding if nothing selectable remains or nothing selected
    if (allPlaced || !selectedId) {
      setNotice(
        allPlaced ? 'All selected trees placed' : 'Select a tree first',
      );
      setTimeout(() => setNotice(''), 1500);
      return;
    }
    const chosen = coconutList.find((c) => String(c.id) === String(selectedId));
    // Prevent duplicates: if this coconut id is already placed, ignore the click
    if (
      chosen &&
      (layout || []).some((t) => String(t?.coconut?.id) === String(chosen.id))
    ) {
      setNotice('That tree is already placed');
      setTimeout(() => setNotice(''), 1500);
      return;
    }
    const next = [...(layout || []), { x, z, coconut: chosen }];
    setLayout(next);
    // Auto-select the next available tree to speed placement
    if (chosen) {
      const usedIds = new Set(
        next
          .map((t) => (t?.coconut?.id != null ? String(t.coconut.id) : null))
          .filter(Boolean),
      );
      const startIdx = coconutList.findIndex(
        (c) => String(c.id) === String(chosen.id),
      );
      let nextSelect = '';
      if (startIdx !== -1) {
        // Try forward from current selection
        for (let i = startIdx + 1; i < coconutList.length; i++) {
          const cand = coconutList[i];
          if (!usedIds.has(String(cand.id))) {
            nextSelect = String(cand.id);
            break;
          }
        }
        // If none ahead, wrap around
        if (!nextSelect) {
          for (let i = 0; i <= startIdx; i++) {
            const cand = coconutList[i];
            if (!usedIds.has(String(cand.id))) {
              nextSelect = String(cand.id);
              break;
            }
          }
        }
      }
      if (nextSelect) {
        setSelectedId(nextSelect);
      } else {
        setSelectedId('');
        setNotice('All selected trees placed');
        setTimeout(() => setNotice(''), 1500);
      }
    }
  };

  const viewTrees = useMemo(() => layout || [], [layout]);

  // Helpers to map world (x,z) to svg pixel (cx, cy)
  const toPx = (x, z) => {
    // Invert X to match onClick mapping (world maxX at left edge)
    const cx = ((maxX - x) / worldWidth) * w;
    const cy = ((maxZ - z) / worldHeight) * h;
    return [cx, cy];
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-base font-semibold">2D Farm Planner</div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-muted-foreground">Choose tree:</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={isLoading || isError}
          className="min-w-[220px] rounded-md border bg-background px-2.5 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          <option value="">
            {isLoading
              ? 'Loading trees...'
              : isError
              ? 'Failed to load'
              : '— Select a tree —'}
          </option>
          {coconutList.map((c) => {
            const used = (layout || []).some(
              (t) => String(t?.coconut?.id) === String(c.id),
            );
            return (
              <option key={c.id} value={c.id} disabled={used}>
                {c.tree_seq ?? c.tree_code ?? `Tree ${c.id}`}{' '}
                {c.status ? `• ${c.status}` : ''}
              </option>
            );
          })}
        </select>
      </div>
      {!isLoading ? (
        <svg
          ref={svgRef}
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          onClick={onClick}
          className={`${
            !selectedId || allPlaced ? 'cursor-not-allowed' : 'cursor-crosshair'
          } touch-none rounded-lg border bg-muted shadow-sm`}
        >
          <defs>
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M 32 0 L 0 0 0 32`}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width={w} height={h} fill="url(#grid)" />

          <line
            x1={w / 2}
            y1={0}
            x2={w / 2}
            y2={h}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <line
            x1={0}
            y1={h / 2}
            x2={w}
            y2={h / 2}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          {viewTrees.map((t, i) => {
            const [cx, cy] = toPx(t.x, t.z);
            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="#2f855a"
                  stroke="#22543d"
                  strokeWidth="1"
                />
                <text x={cx + 8} y={cy - 8} fontSize={11} fill="#334155">
                  {t?.coconut?.tree_seq ?? i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      ) : (
        <div
          style={{ width: w, height: h }}
          className="flex items-center justify-center rounded-lg border bg-muted/50 text-sm text-muted-foreground animate-pulse"
        >
          Loading 2D map…
        </div>
      )}
      {notice && <span className="text-destructive">{notice}</span>}
    </div>
  );
}
