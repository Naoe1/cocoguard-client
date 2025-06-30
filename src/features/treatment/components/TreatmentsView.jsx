import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Trash, Edit, X } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { TableActions } from '@/components/ui/TableActions';
import { useTreatments } from '../api/GetTreatments';
import { CreateTreatment } from './CreateTreatment';
import { DeleteTreatment } from './DeleteTreatment';
import { UpdateTreatment } from './UpdateTreatment';
import { useAuth } from '@/lib/auth';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

const actions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit,
    renderDialog: ({ data, onClose }) => (
      <AlertDialogContent>
        <AlertDialogHeader className="relative">
          <Button
            variant="ghost"
            className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full"
            onClick={onClose}
          >
            <X />
            <span className="sr-only">Close</span>
          </Button>
          <AlertDialogTitle>Edit Treatment</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to this treatment's data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UpdateTreatment treatmentId={data.id} closeForm={onClose} />
      </AlertDialogContent>
    ),
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash,
    renderDialog: ({ data, onClose }) => (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the treatment record for tree
            <span className="font-bold"> {data?.tree?.tree_code} </span>
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
          <DeleteTreatment treatmentId={data.id} closeForm={onClose} />
        </AlertDialogFooter>
      </AlertDialogContent>
    ),
  },
];

export const TreatmentsView = ({ queryParams }) => {
  const { auth } = useAuth();
  const baseColumns = [
    {
      accessorKey: 'date_applied',
      header: 'Date Applied',
    },
    {
      id: 'applied_to',
      header: 'Applied To',
      accessorFn: (row) => {
        return row.tree?.tree_code || '';
      },
      cell: ({ row }) => {
        const treeId = row.original.tree?.id;
        const treeCode = row.original.tree?.tree_code;
        return (
          <Link
            to={`/app/coconuts/${treeId}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {treeCode}
          </Link>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'product',
      header: 'Product',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        return `${row.original.amount} ${row.original.unit || ''}`;
      },
    },
    {
      accessorKey: 'end_date',
      header: 'End Date',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return <TableActions row={row} actions={actions} />;
      },
    },
  ];

  const columns =
    auth?.user?.role === 'STAFF'
      ? baseColumns.filter((col) => col.id !== 'actions')
      : baseColumns;

  const treatmentsQuery = useTreatments({ params: queryParams });

  if (treatmentsQuery.isLoading) {
    return <DataTableSkeleton columns={4} rows={8} />;
  }

  let treatments = treatmentsQuery?.data?.data?.treatments || [];

  return (
    <DataTable
      columns={columns}
      data={treatments}
      CreateResource={CreateTreatment}
    />
  );
};
