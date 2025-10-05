import { useAuditEvents } from '../api/GetAuditEvents';
import { DataTable } from '@/components/ui/DataTable';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const KeyValueList = ({ obj }) => {
  const entries = Object.entries(obj);
  if (!entries.length) return <div className="text-xs text-slate-500">-</div>;
  return (
    <div className="border rounded-md divide-y">
      {entries.map(([k, v]) => (
        <div key={k} className="grid grid-cols-3 gap-2 p-2">
          <div className="text-xs font-medium text-slate-600 break-all col-span-1">
            {k}
          </div>
          <div className="col-span-2 text-xs text-slate-800 break-words">
            {typeof v === 'object' ? (
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(v, null, 2)}
              </pre>
            ) : (
              String(v)
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ChangesTable = ({ changes }) => {
  const rows = Object.entries(changes);
  if (!rows.length)
    return <div className="text-xs text-slate-500">No changes</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-md">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="text-left p-2 border-b">Field</th>
            <th className="text-left p-2 border-b">From</th>
            <th className="text-left p-2 border-b">To</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([field, diff]) => {
            const fromVal =
              diff && typeof diff === 'object' && 'from' in diff
                ? diff.from
                : undefined;
            const toVal =
              diff && typeof diff === 'object' && 'to' in diff
                ? diff.to
                : undefined;
            const renderVal = (val, style) =>
              typeof val === 'object' ? (
                <pre className={`whitespace-pre-wrap break-words ${style}`}>
                  {JSON.stringify(val, null, 2)}
                </pre>
              ) : (
                <span className={style}>
                  {val === undefined || val === null ? '—' : String(val)}
                </span>
              );
            return (
              <tr key={field} className="odd:bg-white even:bg-slate-50">
                <td className="p-2 align-top font-medium text-slate-700 border-b break-all">
                  {field}
                </td>
                <td className="p-2 align-top text-slate-500 border-b break-words">
                  {renderVal(fromVal, 'line-through decoration-slate-300')}
                </td>
                <td className="p-2 align-top text-emerald-700 border-b break-words">
                  {renderVal(toVal, 'font-semibold')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const AuditLogsView = () => {
  const { data, isLoading, isError } = useAuditEvents({});

  const events = data?.data?.audit_events ?? data?.data ?? [];

  const columns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    },
    columnHelper.accessor(
      (row) => `${row.actor_id.first_name} ${row.actor_id.last_name}`,
      {
        id: 'fullName',
        header: 'Full Name',
      },
    ),
    { accessorKey: 'actor_id.email', header: 'Email' },
    { accessorKey: 'action', header: 'Action' },
    { accessorKey: 'resource_type', header: 'Resource' },
    { accessorKey: 'resource_id', header: 'Resource ID' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-48 w-full items-center justify-center text-red-600">
        Error loading audit logs
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={events}
        expandable={{
          renderExpanded: ({ row }) => {
            const evt = row.original;
            const action = (evt.action || '').toLowerCase();
            if (action === 'create') {
              return (
                <div className="p-4 bg-white">
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Created Object
                  </div>
                  <KeyValueList obj={evt.next} />
                </div>
              );
            }
            if (action === 'delete') {
              return (
                <div className="p-4 bg-white">
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Deleted Object
                  </div>
                  <KeyValueList obj={evt.previous} />
                </div>
              );
            }
            if (action === 'update') {
              return (
                <div className="p-4 bg-white">
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Changes
                  </div>
                  <ChangesTable changes={evt.changes} />
                </div>
              );
            }
            return (
              <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white">
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Previous
                  </div>
                  <KeyValueList obj={evt.previous} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Changes
                  </div>
                  <ChangesTable changes={evt.changes} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Next
                  </div>
                  <KeyValueList obj={evt.next} />
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default AuditLogsView;
