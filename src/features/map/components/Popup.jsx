import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

export function Popup({ tree, onClose, onRemove }) {
  if (!tree) return null;
  const { index, position, coconut } = tree;
  const info = coconut
    ? {
        nickname: coconut.tree_code ?? '—',
        title: coconut.tree_seq ?? coconut.tree_code ?? `Tree #${index}`,
        status: coconut.status ?? '—',
        plantingDate: coconut.planting_date
          ? new Date(coconut.planting_date).toISOString().split('T')[0]
          : '—',
        lastHarvestDate:
          Array.isArray(coconut.harvest) && coconut.harvest[0]?.harvest_date
            ? new Date(coconut.harvest[0].harvest_date)
                .toISOString()
                .split('T')[0]
            : '—',
        lastHarvestWeight:
          Array.isArray(coconut.harvest) &&
          coconut.harvest[0]?.total_weight != null
            ? coconut.harvest[0].total_weight
            : '—',
      }
    : {
        nickname: '—',
        title: `Tree #${index}`,
        status: 'Good',
        plantingDate: '—',
        lastHarvestDate: '—',
        lastHarvestWeight: '—',
      };
  return (
    <div
      className="pointer-events-none absolute inset-0 grid place-items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="pointer-events-auto w-full max-w-sm rounded-lg border bg-card p-4 text-card-foreground shadow-xl md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-blue-600 hover:text-blue-800">
            <Link to={`/app/coconuts/${tree.coconut.id}`}>{info.title}</Link>
          </h3>
          <button
            onClick={onClose}
            title="Close"
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ✕
          </button>
        </div>
        <div className="mt-2 text-sm leading-6">
          <div>
            <span className="font-semibold">Nickname:</span> {info.nickname}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {info.status}
          </div>
          <div>
            <span className="font-semibold">Planted:</span> {info.plantingDate}
          </div>
          <div>
            <span className="font-semibold">Last harvest:</span>{' '}
            {info.lastHarvestDate}
          </div>
          <div>
            <span className="font-semibold">Last harvest (kg):</span>{' '}
            {info.lastHarvestWeight}
          </div>
          <div>
            <span className="font-semibold">Coords:</span>{' '}
            {position.map((n) => n.toFixed(2)).join(', ')}
          </div>
        </div>
        {onRemove && (
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => {
                onRemove(index);
                onClose?.();
              }}
              variant="destructive"
            >
              Remove tree
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
