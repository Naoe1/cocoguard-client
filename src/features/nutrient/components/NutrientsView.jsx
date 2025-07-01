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
import { useNutrients } from '../api/GetNutrients';
import { CreateNutrient } from './CreateNutrient';
import { DeleteNutrient } from './DeleteNutrient';
import { UpdateNutrient } from './UpdateNutrient';
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
          <AlertDialogTitle>Edit Nutrient Record</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to this nutrient record's data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UpdateNutrient nutrientId={data.id} closeForm={onClose} />
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
            This will permanently delete the nutrient record for tree
            <span className="font-bold"> {data?.tree?.tree_code} </span>
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
          <DeleteNutrient nutrientId={data.id} closeForm={onClose} />
        </AlertDialogFooter>
      </AlertDialogContent>
    ),
  },
];

export const NutrientsView = ({ queryParams }) => {
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
      accessorKey: 'application_method',
      header: 'Application Method',
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

  const nutrientsQuery = useNutrients({ params: queryParams });

  if (nutrientsQuery.isLoading) {
    return <DataTableSkeleton columns={4} rows={8} />;
  }

  let nutrients = nutrientsQuery?.data?.data?.nutrients || [];

  return (
    <DataTable
      columns={columns}
      data={nutrients}
      CreateResource={CreateNutrient}
    />
  );
};
